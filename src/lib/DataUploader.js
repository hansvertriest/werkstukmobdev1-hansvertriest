import App from './App';
import Player from './Player';

class DataUploader {
	/**
	 * @description adds new user in db with a specified userId and a specified screenName
	 * @param {*} userId
	 * @param {*} screenName
	 */
	async addNewUser(userId, screenName) {
		await App.firebase.db.collection('users').doc(userId).set({
			screenName, crewCode: '',
		})
			.catch((e) => {
				console.log(e);
			});
	}

	/**
	 * @description joins the player to a crew with specified crewcode
	 * @param {*} crewCode
	 */
	async joinCrew(crewCode) {
		// leave crew
		if (Player.crew.crewCode !== '') {
			await this.leaveCrew(Player.crew.crewCode);
		}
		// add crewcode to user
		await App.firebase.db.collection('users').doc(Player.userId).update({
			crewCode,
		});
		// add to crewMembers
		await App.firebase.db.collection('crews').doc(crewCode).get()
			.then((doc) => {
				const { members } = doc.data();
				members.push(Player.userId);
				App.firebase.db.collection('crews').doc(crewCode).set({
					members,
				}, { merge: true });
			});
		// set listeners to update model
		const playerListener = App.firebase.db.collection('users').doc(Player.userId).onSnapshot((docPlayer) => {
			const playerInfo = docPlayer.data();
			if (playerInfo.crewCode === crewCode) {
				Player.joinCrew(playerInfo.crewCode);
				console.log('Model update: crewCode');
				playerListener();
			}
		});
		const crewListener = App.firebase.db.collection('crews').doc(crewCode).onSnapshot((docCrew) => {
			const crewInfo = docCrew.data();
			if (crewInfo.moderator === Player.userId && crewInfo.members.includes(Player.userId)) {
				Player.crew.loadCrew(docCrew.id, crewInfo.moderator, crewInfo.members);
				Player.crew.setSettings(
					crewInfo.settings.gameMode,
					crewInfo.settings.duration,
					crewInfo.settings.radius,
					crewInfo.settings.centerpoint,
				);
				console.log('Model update: loaded crew');
				crewListener();
			}
		});
	}

	/**
	 * @description makes the player leave a crew with the specified crewcode
	 * @param {*} crewCode
	 */
	async leaveCrew(crewCode) {
		// delete user crew code
		await App.firebase.db.collection('users').doc(Player.userId).update({
			crewCode: '', moderator: false,
		});

		// delete userId in crewMembers
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const { members } = crewDoc.data();
		const memberFiltered = members.filter((memberId) => memberId !== Player.userId);
		await App.firebase.db.collection('crews').doc(crewCode).update({
			members: memberFiltered,
		});

		// change captain
		if (Player.crew.playerIsModerator()) {
			await this.assignNewModerator(crewCode);
		}

		// set listener to update model
		const playerListener = App.firebase.db.collection('users').doc(Player.userId).onSnapshot((doc) => {
			if (doc.data().crewCode === '') {
				Player.leaveCrew();
				console.log('Model update: left crew');
				playerListener();
			}
		});
	}

	/**
	 * @description deletes the crewCode of the player in db
	 */
	async deleteCrewCode() {
		// delete user crew code
		App.firebase.db.collection('users').doc(Player.userId).update({
			crewCode: '',
		});

		// set listener to update model
		const playerListener = App.firebase.db.collection('users').doc(Player.userId).onSnapshot(() => {
			Player.leaveCrew();
			console.log('Model update: left crew');
			playerListener();
		});
	}

	/**
	 * @description creates a new crew in db with a specified crewcode
	 * @param {*} crewCode
	 */
	async createCrew(crewCode) {
		// Update the crew document
		await App.firebase.db.collection('crews').doc(crewCode).set({
			members: [],
			moderator: Player.userId,
			inGame: false,
			settings: {
				duration: 10,
				gameMode: 'parasite',
				radius: 50,
				centerpoint: [3.7239323, 51.0570054],
			},
			taggers: [],
			location: [],
		});
		this.joinCrew(crewCode.toString());
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
			// delete the crew doc and locations collection
			await App.firebase.db.collection('crews').doc(crewCode).delete();
			await App.firebase.db.collection('crews').doc(crewCode).collection('locations').delete();
		}
	}

	/**
	/**
	 * @description sets the specified user as the tagger of the specified crew in db
	 * @param {*} members
	 * @param {*} crewCode
	 * @param {*} taggers
	 */
	async addTagger(crewCode, userId, gameMode) {
		// define the new tagger array
		if (gameMode === 'plague') {
			const doc = await App.firebase.db.collection('crews').doc(crewCode).get();
			let { taggers } = doc.data();
			if (taggers !== undefined) {
				taggers.push(userId);
			} else {
				taggers = [userId];
			}
			App.firebase.db.collection('crews').doc(crewCode).set({
				taggers,
			}, { merge: true });
		} else if (gameMode === 'parasite') {
			const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
			const { taggers } = crewDoc.data();
			// set old taggers Db
			App.firebase.db.collection('crews').doc(crewCode).set({
				previousTaggers: taggers,
			}, { merge: true });
			App.firebase.db.collection('crews').doc(crewCode).set({
				taggers: [userId],
			}, { merge: true });
		}
	}

	/**
	 * @description initializes and starts the game
	 * @param {*} crewCode
	 */
	async startGame(crewCode, gameMode) {
		// get crew information
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const { members, settings } = crewDoc.data();

		// choose tagger
		const randomIndex = Math.floor(Math.random() * members.length);
		await this.addTagger(Player.crew.crewCode, members[randomIndex], gameMode);

		// set inGame to true
		await App.firebase.db.collection('crews').doc(crewCode).update({
			inGame: true,
		});

		// set start date
		settings.startDate = new Date();
		await App.firebase.db.collection('crews').doc(crewCode).update({
			settings,
		});

		// set listener to update model
		await App.firebase.db.collection('crews').doc(crewCode).onSnapshot((doc) => {
			const updatedSettins = doc.data().settings;
			Player.crew.setSettings(
				updatedSettins.gameMode,
				updatedSettins.duration,
				updatedSettins.radius,
				updatedSettins.centerpoint,
				doc.data().taggers,
			);
			console.log('Model update: set settings');
		});

		await App.firebase.db.collection('crews').doc(crewCode).onSnapshot((doc) => {
			const { inGame, taggers } = doc.data();
			if (inGame) {
				Player.crew.startGame();
				Player.crew.setTaggers(taggers);
				console.log('Model update: started game and added taggers');
			}
		});
	}

	async stopGame(crewCode) {
		await App.firebase.db.collection('crews').doc(crewCode).update({
			inGame: false,
			previousTaggers: [],
		});
	}

	async changePlayerLocation(lon, lat) {
		await App.firebase.db.collection('crews').doc(Player.crew.crewCode).collection('locations').doc(Player.userId)
			.set({
				lon,
				lat,
			});
	}
}

export default new DataUploader();
