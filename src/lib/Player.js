import Crew from './Crew';

class Player {
	constructor() {
		this.userId = undefined;
		this.screenName = '';
		this.avatar = '';
		this.location = {};
		this.crew = new Crew();
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
		this.crew.crewCode = undefined;
		this.crew.resetCrew();
	}

	joinCrew(crewCode) {
		this.crew.crewCode = crewCode;
		// import all crew members
	}
}

export default new Player();
