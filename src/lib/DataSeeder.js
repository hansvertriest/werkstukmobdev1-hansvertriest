import Crew from './Crew';

class DataSeeder {
	constructor() {
		this.screenNames = ['AlienDestroyer', 'CaféZuiper', 'KlokjesJanine', 'SimpleJohn', 'Zatlap3000'];
		this.avatars = ['astro1'];
		this.crewCodes = ['0000'];
	}

	/*
	Listener/seeding methods
		these simulate the flow of individual actions to simulate a game that is being played.
		These portray the onsnapshot listeners that would indicate something has changed.
	*/

	seedCrew(amountOfMembers) {
		// add members who already are in the crew before join
		for (let i = 0; i < amountOfMembers; i++) {
			this.addCrewMember();
			console.log('DATASEEDER: added member');
		}

		// assign a moderator
		if (Crew.crewCode !== undefined) {
			this.assignRandomModerator();
		}

		// simulate leaves/joins
		setTimeout(() => {
			if (Crew.crewCode !== undefined) {
				this.addCrewMember();
				console.log('DATASEEDER: waiting 3 sec');
			}
		}, 10000);

		setTimeout(() => {
			if (Crew.crewCode !== undefined) {
				this.removeCrewMember(Crew.crewMembers[0].userId);
				console.log('DATASEEDER: waiting 2 sec');
			}
		}, 13000);

		setTimeout(() => {
			if (Crew.crewCode !== undefined) {
				this.removeCrewMember(Crew.crewMembers[1].userId);
				console.log('DATASEEDER: waiting 20 sec');
			}
		}, 15000);
	}

	/*
	Uploader methods
		Whenever something has to be changed from the client side to the DB.
		DataUploader will handle this.
		These functions replace the DataUploader.
	*/

	joinCrew(crewCode) {
		Crew.setCrewCode(crewCode);
	}

	/*
	Simulating methods
		these simulate actions that would be performed by other players
		ex: adding/removing crewMmebers, simulating walking, start/stop game
	*/


	addCrewMember() {
		const userIds = Crew.crewMembers.map((member) => member.userId);
		let userId = Math.floor(Math.random() * 100);
		while (userIds.includes(userId)) {
			userId = Math.floor(Math.random() * 100);
		}
		Crew.addMember(
			userId,
			this.screenNames[Math.floor(Math.random() * this.screenNames.length)],
			this.avatars[Math.floor(Math.random() * this.avatars.length)],
		);
	}

	removeCrewMember(userId) {
		Crew.removeMember(userId);
	}

	assignRandomModerator() {
		// get random member
		const randomMember = Crew.crewMembers[Math.floor(Math.random() * Crew.crewMembers.length)];
		// assign moderator
		Crew.setModerator(randomMember.userId);
	}
}

export default new DataSeeder();
