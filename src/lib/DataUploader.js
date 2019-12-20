import App from './App';
import Player from './Player';
import Crew from './Crew';


class DataUploader {
	joinCrew(crewCode) {
		// leave current crew
		if (Crew.crewCode !== '') {
			this.leaveCrew(Crew.crewCode);
		}
		// add crewcode to user
		App.firebase.db.collection('users').doc(Player.userId).update({
			crewCode,
		});
		// add to crewMembers
		App.firebase.db.collection('crews').doc(crewCode).get()
			.then((doc) => {
				const { members } = doc.data();
				members.push(Player.userId);
				App.firebase.db.collection('crews').doc(crewCode).set({
					members,
				});
			});
	}

	leaveCrew(crewCode) {
		// change captain
		if (Crew.playerIsModerator()) {
			this.assignNewModerator();
		}
		// delete user crew code
		App.firebase.db.collection('users').doc(Player.userId).update({
			crewCode: '',
		});
		// delete userId in crewMemebers
		App.firebase.db.collection('crews').doc(crewCode).get()
			.then((doc) => {
				const { members } = doc.data();
				const memberFiltered = members.filter((memberId) => memberId !== Player.userId);

				App.firebase.db.collection('crews').doc(crewCode).set({
					members: memberFiltered,
				});
			});
	}

	createCrew() {
		return new Promise((resolve) => {
			let crewCode;
			App.firebase.db.collection('crews').get()
				.then((doc) => {
					const crewCodes = [];
					doc.forEach((crew) => {
						crewCodes.push(crew.id);
					});

					do {
						crewCode = Math.floor((Math.random() * 8999) + 1000);
					} while (crewCodes.includes(crewCode));
				})
				.then(() => {
					App.firebase.db.collection('crews').doc(crewCode.toString()).set({
						members: [],
						moderator: Player.userId,
					});
				})
				.then(() => {
					this.joinCrew(crewCode.toString());
					resolve();
				});
		});
	}

	assignNewModerator() {
		App.firebase.db.collection('crews').doc(Crew.crewCode).get()
			.then((doc) => {
				const crew = doc.data().members;
				const randomIndex = Math.floor(Math.random() * crew.members.length);
				App.firebase.db.collection('crews').doc(Crew.crewCode).set({
					moderator: crew[randomIndex],
				});
			});
	}
}

export default new DataUploader();
