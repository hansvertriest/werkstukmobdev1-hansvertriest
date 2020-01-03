import App from './App';
import walkingCoordinates from '../assets/dataseeder/route1';

class Backend {
	constructor() {
		this.crewCode = '';
		this.screenNames = ['AlienDestroyer', 'CaféZuiper', 'KlokjesJanine', 'SimpleJohn', 'Zatlap3000'];
		this.avatars = ['astro1', 'astro2'];
		this.listeners = [];
		this.gameMode = 'parasite';
		this.tagRadius = 0.05;
		this.tagColor = '#ebbd34';
		this.normalColor = '#0e7bb5';
		this.oldTagger = [];
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
		// get this users from crew
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const { members, taggers } = crewDoc.data();
		// filter the arrays
		const membersFiltered = members.filter((member) => member.substring(0, 5) !== 'fict-');
		const taggersFiltered = taggers.filter((tagger) => tagger.substring(0, 5) !== 'fict-');
		// replace the arrays
		await App.firebase.db.collection('crews').doc(crewCode).update({
			members: membersFiltered,
			taggers: taggersFiltered,
		});
		// delete users out of locations too
		const fictionalUsersArray = members.filter((member) => member.substring(0, 5) === 'fict-');
		fictionalUsersArray.forEach((member) => {
			App.firebase.db.collection('crews').doc(crewCode).collection('locations').doc(member)
				.delete();
		});
	}

	async deleteUserFromCrew(crewCode, userId) {
		// delete user crew code
		await App.firebase.db.collection('users').doc(userId).update({
			crewCode: '', moderator: false,
		});

		// delete userId in crewMembers
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const { members, taggers, moderator } = crewDoc.data();
		const membersFiltered = members.filter((member) => member !== userId);
		const taggersFiltered = taggers.filter((tagger) => tagger !== userId);
		await App.firebase.db.collection('crews').doc(crewCode).update({
			members: membersFiltered,
			taggers: taggersFiltered,
		});

		// change captain
		if (moderator === userId) {
			await this.assignNewModerator(crewCode);
		}
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
		// define the new tagger array
		if (this.gameMode === 'plague') {
			await App.firebase.db.collection('crews').doc(crewCode).get()
				.then((doc) => {
					let { taggers } = doc.data();
					this.oldTagger = taggers;
					if (taggers !== undefined) {
						taggers.push(userId);
					} else {
						taggers = [userId];
					}
					App.firebase.db.collection('crews').doc(crewCode).set({
						taggers,
					}, { merge: true });
				});
		} else if (this.gameMode === 'parasite') {
			const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
			const { taggers } = crewDoc.data();
			this.oldTagger = taggers;
			App.firebase.db.collection('crews').doc(crewCode).set({
				taggers: [userId],
			}, { merge: true });
		}
	}

	/**
	 * @description initializes and starts the game
	 * @param {*} crewCode
	 */
	async startGame(crewCode) {
		// get crew information
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const { members, settings } = crewDoc.data();
		// choose tagger
		const randomIndex = Math.floor(Math.random() * members.length);
		await this.addTagger(crewCode, members[randomIndex]);
		// set inGame to true
		await App.firebase.db.collection('crews').doc(crewCode).update({
			inGame: true,
		});
		// set start date
		settings.startDate = new Date();
		await App.firebase.db.collection('crews').doc(crewCode).update({
			settings,
		});
	}

	async stopGame(crewCode) {
		await App.firebase.db.collection('crews').doc(crewCode).update({
			inGame: false,
			previousTaggers: [],
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

	async checkDistance(lon1, lat1, lon2, lat2) {
		if ((lat1 === lat2) && (lon1 === lon2)) {
			return 0;
		} else {
			const radlat1 = (Math.PI * lat1) / 180;
			const radlat2 = (Math.PI * lat2) / 180;
			const theta = lon1 - lon2;
			const radtheta = (Math.PI * theta) / 180;
			// eslint-disable-next-line max-len
			let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = (dist * 180) / Math.PI;
			dist = dist * 60 * 1.1515;
			dist *= 1.609344;
			return dist;
		}
	}

	/**
	 * @description returns an array with distances to each tagger
	 * @param {*} member is a userID of the member
	 * @param {*} taggers is the array of userId's of the tagger
	 */
	async getDistanceToTagger(member, taggers) {
		// get location of member
		const locationDoc = await App.firebase.db.collection('crews').doc(this.crewCode).collection('locations').doc(member)
			.get();
		const locationMember = locationDoc.data();
		// get all taggers
		let taggerArray;
		if (taggers === undefined) {
			const crewDoc = await App.firebase.db.collection('crews').doc(this.crewCode).get();
			taggerArray = crewDoc.data().taggers;
		} else {
			taggerArray = taggers;
		}
		// get all distances to tagger
		const distances = [];
		const taggerLocationDoc = await App.firebase.db.collection('crews').doc(this.crewCode).collection('locations').get();
		taggerLocationDoc.forEach(async (taggerDoc) => {
			if (taggerArray.includes(taggerDoc.id)) {
				const taggerlocation = taggerDoc.data();
				// eslint-disable-next-line max-len
				const distance = await this.checkDistance(locationMember.lon, locationMember.lat, taggerlocation.lon, taggerlocation.lat);
				distances.push({
					tagger: taggerDoc.id,
					distance,
					userId: member,
				});
			}
		});
		return distances;
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

	async changeLocationOfCrewMember(member, routeNumber, step) {
		await App.firebase.db.collection('crews').doc(this.crewCode).collection('locations').doc(member)
			.set({
				lon: walkingCoordinates.routes[routeNumber][step][0],
				lat: walkingCoordinates.routes[routeNumber][step][1],
			});
	}

	async simulateGame() {
		let step = 0;
		const interval = setInterval(async () => {
			// get crewMemberIds
			const crewDoc = await App.firebase.db.collection('crews').doc(this.crewCode).get();
			const { members } = crewDoc.data();
			// set init location of members
			if (step === 0) {
				this.changeLocationOfCrewMember(members[0], 0, 0);
				this.changeLocationOfCrewMember(members[1], 1, 0);
			}
			// let first member tag second member
			if (step <= 27) {
				this.changeLocationOfCrewMember(members[0], 0, step);
			}
			if (step <= 73 && step > 26) {
				this.changeLocationOfCrewMember(members[1], 1, step - 26);
			}
			console.log('updated location in db');

			// check for step limit
			if (step === 73) {
				clearInterval(interval);
			}
			// update stepNumber
			step++;
		}, 500);
	}
}

export default new Backend();
