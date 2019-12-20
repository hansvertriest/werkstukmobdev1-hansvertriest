import CrewMember from './CrewMember';
import Game from './Game';

class Crew {
	constructor() {
		this.crewCode = ''; // string
		this.inGame = false;
		this.moderator = undefined; // string
		this.crewMembers = [];
		this.moderatorEmblem = 'shield-alt-solid';
	}

	// query methods
	getMemberById(userId) {
		return this.crewMembers.filter((member) => member.userId === userId)[0];
	}

	playerIsModerator() {
		return this.moderator;
	}

	// crew modification methods

	setCrewCode(code) {
		this.crewCode = code;
	}

	addMember(userId, screenName, avatar, emblem) {
		if (this.crewCode !== undefined) {
			this.crewMembers.push(new CrewMember(userId, screenName, avatar, emblem));
		}
	}

	removeMember(userId) {
		if (this.crewCode !== undefined) {
			this.crewMembers = this.crewMembers.filter((member) => member.userId !== userId);
		}
	}

	setPlayerModerator(bool) {
		this.moderator = bool;
	}

	resetCrew() {
		this.crewCode = undefined; // string
		this.inGame = false;
		this.moderator = undefined; // string
		this.crewMembers = [];
	}

	// updatePlayerInCrew() {
	// 	const playerCrewMember = this.crewMembers.filter((member) => {
	// 		return member.userId === Player.userId;
	// 	})[0];
	// 	playerCrewMember.
	// }

	// crew actions
	startGame() {
		if (Game.isSet) {
			this.inGame = true;
		}
	}
}

export default new Crew();
