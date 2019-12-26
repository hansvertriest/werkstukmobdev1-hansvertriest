import App from './App';
import walkingCoordinates from '../assets/dataseeder/route1';

class Backend {
	constructor() {
		this.crewCode = '';
		this.screenNames = ['AlienDestroyer', 'CaféZuiper', 'KlokjesJanine', 'SimpleJohn', 'Zatlap3000'];
		this.avatars = ['astro1', 'astro2'];
		this.listeners = [];
	}

	/**
	 * @description Fetches all existing crewCodes (array)
	 */
	async getExistingCrewCodes() {
		// Get all existing users
		const crewCodesDoc = await App.firebase.db.collection('crews').get();
		const crewCodes = [];
		crewCodesDoc.forEach((user) => {
			crewCodes.push(user.id);
		});
		return crewCodes;
	}

	/**
	 * @description Fetches all existing userId's (array)
	 */
	async getExistingUsers() {
		// Get all existing users
		const userIdsDoc = await App.firebase.db.collection('users').get();
		const userIds = [];
		userIdsDoc.forEach((user) => {
			userIds.push(user.id);
		});
		return userIds;
	}

	/**
	 * @description returns an array of objects of all users with corresponding crewCode
	 */
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
	 * @description deletes all fictional characters out of the crew members
	 * @param crewCode
	 */
	async deleteFictionalUsersOutOfCrew(crewCode) {
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const { members, taggers } = crewDoc.data();
		const membersFiltered = members.filter((member) => member.substring(0, 5) !== 'fict-');
		const taggersFiltered = taggers.filter((tagger) => tagger.substring(0, 5) !== 'fict-');
		await App.firebase.db.collection('crews').doc(crewCode).update({
			members: membersFiltered,
			taggers: taggersFiltered,
		});
	}

	async deleteUserFromCrew(crewCode, userId) {
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const { members, taggers, moderator } = crewDoc.data();
		if (moderator === userId) {
			await this.assignNewModerator(crewCode);
		}
		const membersFiltered = members.filter((member) => member !== userId);
		const taggersFiltered = taggers.filter((tagger) => tagger !== userId);
		await App.firebase.db.collection('crews').doc(crewCode).update({
			members: membersFiltered,
			taggers: taggersFiltered,
		});
	}

	/**
	 * @description deletes all fictional user out of the db
	 */
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

	/**
	 * @description joins a specified user to a specified crew
	 * @param userId
	 * @param crewCode
	 */
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

	/**
	 * @description sets the specified user as the tagger of the specified crew in db
	 * @param {*} members
	 * @param {*} crewCode
	 * @param {*} taggers
	 */
	async addTagger(crewCode, userId) {
		// set taggers
		await App.firebase.db.collection('crews').doc(crewCode).get()
			.then((doc) => {
				let { taggers } = doc.data();
				if (taggers !== undefined) {
					taggers.push(userId);
				} else {
					taggers = [userId];
				}
				App.firebase.db.collection('crews').doc(crewCode).set({
					taggers,
				}, { merge: true });
			});
	}

	/**
	 * @description initializes and starts the game
	 * @param {*} crewCode
	 */
	async startGame(crewCode) {
		// choose tagger
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const { members } = crewDoc.data();
		const randomIndex = Math.floor(Math.random() * members.length);
		await this.addTagger(crewCode, members[randomIndex]);
		// set inGame to true
		await App.firebase.db.collection('crews').doc(crewCode).update({
			inGame: true,
		});
	}

	async stopGame(crewCode) {
		await App.firebase.db.collection('crews').doc(crewCode).update({
			inGame: false,
			taggers: [],
		});
	}

	/**
	 * @description assigns a new, random moderator to the crew
	 * @param {*} crewCode
	 */
	async assignNewModerator(crewCode) {
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const crew = crewDoc.data().members;
		if (crew.length > 0) {
			const randomIndex = Math.floor(Math.random() * crew.length);
			await App.firebase.db.collection('crews').doc(crewCode).update({
				moderator: crew[randomIndex],
			});
		} else {
			await App.firebase.db.collection('crews').doc(crewCode).delete();
		}
	}

	/*
		DATASEEDER
	*/

	/**
	 * @description Generates a random user
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

	async getNextStep(routeNumber, stepNumber) {
		return walkingCoordinates.routes[routeNumber][stepNumber];
	}

	async simulateGame(){

	}
}

export default new Backend();
