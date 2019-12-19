import Crew from './Crew';

class Player {
	constructor() {
		this.userId = undefined;
		this.screenName = '';
		this.avatar = '';
		this.location = {};
	}

	setParams(userId, screenName, avatar) {
		this.userId = userId;
		this.screenName = screenName;
		this.avatar = avatar;
	}

	resetParams() {
		this.userId = undefined;
		this.screenName = '';
		this.avatar = '';
		this.location = {};
	}

	leaveCrew() {
		Crew.crewCode = undefined;
		Crew.resetCrew();
	}

	joinCrew(crewCode) {
		Crew.crewCode = crewCode;
		// import all crew members
	}
}

export default new Player();
