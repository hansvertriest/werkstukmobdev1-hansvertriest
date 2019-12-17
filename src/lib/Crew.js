import CrewMember from './CrewMember';
import Game from './Game';

class Crew {
	constructor() {
		this.crewCode = undefined; // string
		this.inGame = false;
		this.moderator = undefined; // string
		this.crewMembers = [];
		this.moderatorEmblem = 'shield-alt-solid';
	}

	// query methods
	getMemberById(userId) {
		return this.crewMembers.filter((member) => member.userId === userId)[0];
	}

	getModerator() {
		return this.crewMembers.filter((member) => member.isModerator)[0];
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

	setModerator(userId) {
		if (this.crewCode !== undefined) {
			this.getMemberById(userId).isModerator = true;
			this.getMemberById(userId).emblem = this.moderatorEmblem;
		}
	}

	resetCrew() {
		this.crewCode = undefined; // string
		this.inGame = false;
		this.moderator = undefined; // string
		this.crewMembers = [];
	}

	// crew actions
	startGame() {
		if (Game.isSet) {
			this.inGame = true;
		}
	}
}

export default new Crew();
