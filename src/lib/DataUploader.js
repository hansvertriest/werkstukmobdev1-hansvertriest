import App from './App';
import Player from './Player';

class DataUploader {
	async addNewUser(userId, screenName) {
		await App.firebase.db.collection('users').doc(userId).set({
			screenName, crewCode: '',
		})
			.catch((e) => {
				console.log(e);
			});
	}

	async joinCrew(crewCode) {
		// leave current crew
		if (Player.crew.crewCode !== '') {
			await this.leaveCrew(Player.crew.crewCode);
		}
		// add crewcode to user
		await App.firebase.db.collection('users').doc(Player.userId).update({
			crewCode,
		});
		// add to crewMembers
		App.firebase.db.collection('crews').doc(crewCode).get()
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
				console.log('Model update: loaded crew');
				crewListener();
			}
		});
	}

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
		const playerListener = App.firebase.db.collection('users').doc(Player.userId).onSnapshot(() => {
			Player.leaveCrew();
			console.log('Model update: left crew');
			playerListener();
		});
	}

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

	async createCrew(crewCode) {
		// Update the crew document
		await App.firebase.db.collection('crews').doc(crewCode).set({
			members: [], moderator: Player.userId, inGame: false,
		});
		this.joinCrew(crewCode.toString());
	}

	async assignNewModerator(crewCode) {
		const crewDoc = await App.firebase.db.collection('crews').doc(crewCode).get();
		const crew = crewDoc.data().members;
		if (crew.length > 0) {
			const randomIndex = Math.floor(Math.random() * crew.length);
			await App.firebase.db.collection('crews').doc(Player.crew.crewCode).update({
				moderator: crew[randomIndex],
			});
		} else {
			await App.firebase.db.collection('crews').doc(crewCode).delete();
		}
	}
}

export default new DataUploader();
