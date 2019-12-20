import Game from './Game';
import Player from './Player';

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

	seedPlayer() {
		const userId = '0000';
		const screenName = 'CoolBoy';
		const avatar = 'astro1';
		Player.setParams(userId, screenName, avatar);
	}

	seedCrew(amountOfMembers) {
		const waitTime = 3;

		// add members who already are in the crew before join
		for (let i = 0; i < amountOfMembers; i++) {
			this.addCrewMember();
			console.log('DATASEEDER: added member');
		}

		// assign a moderator
		if (Player.crew.crewCode !== undefined) {
			this.assignModerator('0000');
		}

		// simulate leaves/joins
		setTimeout(() => {
			if (Player.crew.crewCode !== undefined) {
				this.addCrewMember();
				console.log('DATASEEDER: waiting 3 sec');
			}
		}, waitTime * 1000);

		setTimeout(() => {
			if (Player.crew.crewCode !== undefined) {
				this.removeCrewMember(Player.crew.crewMembers[1].userId);
				console.log('DATASEEDER: waiting 2 sec');
			}
		}, (waitTime * 1000) + 2000);

		setTimeout(() => {
			if (Player.crew.crewCode !== undefined) {
				this.removeCrewMember(Player.crew.crewMembers[2].userId);
				console.log('DATASEEDER: waiting 20 sec');
			}
		}, (waitTime * 1000) + 3000);
		// start game
		setTimeout(() => {
			if (Player.crew.crewCode !== undefined) {
				// set game settings
				const gameMode = 'parasite';
				const duration = 300;
				const location = ['51.0873544', '3.6686911,15'];
				const radius = 100;
				const taggers = [Player.crew.crewMembers[0].userId];
				this.setGameSettings(gameMode, duration, location, radius, taggers);
				// start the game
				this.initGame();
				console.log('DATASEEDER: started game');
			}
		}, (waitTime * 1000) + 4000);
	}

	seedLocations() {
		setInterval(() => {
			// update player location
			this.updatePlayerLocation({ lat: 3.7239323, lon: 51.0570054 });
			// update crew location
			const locationObject = [];
			Player.crew.crewMembers.forEach((member) => {
				const locationMember = {
					userId: member.userId,
					lon: 3.7218819,
					lat: 51.0535952,
				};
				locationObject.push(locationMember);
			});
			this.updateLocationCrewMembers(locationObject);
		}, 3000);
	}

	seedGame() {
		console.log('DATASEEDER: seeding game');
	}

	/*
	Uploader methods
		Whenever something has to be changed from the client side to the DB.
		DataUploader will handle this.
		These functions replace the DataUploader.
	*/

	joinCrew(crewCode) {
		Player.crew.setCrewCode(crewCode);
		Player.crew.addMember(Player.userId, Player.screenName, Player.avatar);
	}

	// this would be a listener for the crewLocations
	// if a change in location of the player would happen => Player is also updated
	updatePlayerLocation(locationObject) {
		Player.crew.getMemberById('0000').location = locationObject;
		Player.location = locationObject;
	}

	updateLocationCrewMembers(locationObject) {
		locationObject.forEach((location) => {
			Player.crew.getMemberById(location.userId).setLocation(location.lon, location.lat);
		});
	}

	/*
	Simulating methods
		these simulate actions that would be performed by other players
		ex: adding/removing crewMmebers, simulating walking, start/stop game
	*/


	addCrewMember() {
		const userIds = Player.crew.crewMembers.map((member) => member.userId);
		let userId = Math.floor(Math.random() * 100);
		while (userIds.includes(userId)) {
			userId = Math.floor(Math.random() * 100);
		}
		Player.crew.addMember(
			userId,
			this.screenNames[Math.floor(Math.random() * this.screenNames.length)],
			this.avatars[Math.floor(Math.random() * this.avatars.length)],
		);
	}

	removeCrewMember(userId) {
		Player.crew.removeMember(userId);
	}

	assignRandomModerator() {
		// get random member
		// eslint-disable-next-line max-len
		const randomMember = Player.crew.crewMembers[Math.floor(Math.random() * Player.crew.crewMembers.length)];
		// assign moderator
		Player.crew.setModerator(randomMember.userId);
	}

	assignModerator(userId) {
		Player.crew.getMemberById(userId).setModerator();
	}

	setGameSettings() {
		Game.setSettings('parasite', 300, ['51.0873544', '3.6686911,15'], 100, [Player.crew.crewMembers[0].userId]);
	}

	initGame() {
		this.assignTagger('0000');
		Player.crew.startGame();
	}

	assignTagger(userId) {
		Player.crew.getMemberById(userId).setModerator();
	}

	assignRandomTagger() {
		// get random member
		// eslint-disable-next-line max-len
		const randomMember = Player.crew.crewMembers[Math.floor(Math.random() * Player.crew.crewMembers.length)];
		// assign moderator
		Player.crew.setTagger(randomMember.userId);
	}
}

export default new DataSeeder();
