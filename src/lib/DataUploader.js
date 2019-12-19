import App from './App';
import Player from './Player';


class DataUploader {
	joinCrew(crewCode) {
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
}

export default new DataUploader();
