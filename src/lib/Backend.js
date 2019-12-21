import App from './App';

class Backend {
	constructor() {
		this.crewCode = '6398';
		this.screenNames = ['AlienDestroyer', 'CaféZuiper', 'KlokjesJanine', 'SimpleJohn', 'Zatlap3000'];
		this.avatars = ['astro1', 'astro2'];
	}

	async getExistingCrewCodes() {
		// Get all existing users
		const crewCodesDoc = await App.firebase.db.collection('crews').get();
		const crewCodes = [];
		crewCodesDoc.forEach((user) => {
			crewCodes.push(user.id);
		});
		return crewCodes;
	}

	async getExistingUsers() {
		// Get all existing users
		const userIdsDoc = await App.firebase.db.collection('users').get();
		const userIds = [];
		userIdsDoc.forEach((user) => {
			userIds.push(user.id);
		});
		return userIds;
	}

	async getExistingUsersAndCrewCodes() {
		// Get all existing users
		const usersDoc = await App.firebase.db.collection('users').get();
		const userObjects = [];
		usersDoc.forEach((user) => {
			const userObject = {
				userId: user.id,
				crewCode: user.data().crewCode,
			};
			userObjects.push(userObject);
		});
		return userObjects;
	}

	/**
	 * @description deletes a specified user out of a specified crew
	 * @bug when firing it multiple times fast
	 * @param {*} userId
	 * @param {*} crewCode
	 */
	async deleteUserOutOfCrew(userId, crewCode) {
		// get crew members
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const { members } = crewDoc.data();
		const membersFiltered = members.filter((member) => member !== userId);
		await App.firebase.db.collection('crews').doc(crewCode).update({
			members: membersFiltered,
		});
	}

	async deleteFictionalUsersOutOfCrew(crewCode) {
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const { members } = crewDoc.data();
		const membersFiltered = members.filter((member) => member.substring(0, 5) !== 'fict-');
		await App.firebase.db.collection('crews').doc(crewCode).update({
			members: membersFiltered,
		});
	}

	/*
		DATASEEDER
	*/
	async generateRandomUser() {
		let userId;
		// Get all existing users
		const userIds = await this.getExistingUsers();
		// Generate ids while no unique ids has ben generated
		await new Promise((resolve) => {
			do {
				userId = Math.floor((Math.random() * 89999999) + 1000);
				if (!userIds.includes(userId)) {
					resolve();
				}
			} while (userIds.includes(userId));
		});
		userId = `fict-${userId}`.toString();
		// choose random avatar
		const avatar = this.avatars[Math.floor(Math.random() * this.avatars.length)];
		// choose random screenName
		const screenName = this.screenNames[Math.floor(Math.random() * this.screenNames.length)];
		// Upload member
		await App.firebase.db.collection('users').doc(userId).set({
			avatar,
			crewCode: '',
			moderator: false,
			screenName,
		});
		this.joinUserToCrew(userId, this.crewCode);
	}

	async joinUserToCrew(userId, crewCode) {
		// first check if user exists
		const userDoc = await App.firebase.db.collection('users').doc(userId).get();
		if (userDoc.exists) {
			// update members
			const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
			const crewInfo = crewDoc.data();
			const { members } = crewInfo;
			members.push(userId);
			await App.firebase.db.collection('crews').doc(crewCode).update({
				members,
			});
		}
		await App.firebase.db.collection('users').doc(userId).update({
			crewCode,
		});
	}

	async deleteFictionalusers() {
		// get all users
		const userObjects = await this.getExistingUsersAndCrewCodes();
		const users = userObjects.map((userObject) => userObject.userId);
		// get all fictional users
		const fictionalUserObjects = userObjects.filter((userObject) => userObject.userId.substring(0, 5) === 'fict-');
		const fictionalUsers = users.filter((user) => user.substring(0, 5) === 'fict-');
		// delete users out of their crews
		fictionalUserObjects.forEach(async (fictionalUserObject) => {
			await this.deleteFictionalUsersOutOfCrew(fictionalUserObject.crewCode);
		});
		// delete all fictional users
		fictionalUsers.forEach(async (user) => {
			await App.firebase.db.collection('users').doc(user).delete();
		});
	}
}

export default new Backend();
