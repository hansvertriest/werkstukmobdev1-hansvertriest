import Crew from './Crew';

class Player {
	constructor() {
		this.userId = undefined;
		this.screenName = '';
		this.avatar = '';
		this.location = {};
		this.crew = new Crew();
		this.isLoaded = false;
	}

	/**
	 * @description sets the parameters of the player to the specified values
	 * @param {*} userId firebase id of player
	 * @param {*} screenName screenName of player
	 * @param {*} avatar chosen avatar of player
	 */
	setParams(userId, screenName, avatar) {
		this.userId = userId;
		this.screenName = screenName;
		this.avatar = avatar;
	}

	/**
	 * @description resets the parameters of the player
	 */
	resetParams() {
		this.userId = undefined;
		this.screenName = '';
		this.avatar = '';
		this.location = {};
		this.isLoaded = false;
	}

	/**
	 * @description sets creCode to '' and resets the crew parameters
	 */
	leaveCrew() {
		this.crew.crewCode = '';
		this.crew.resetCrew();
	}

	/**
	 * @description sets the crewCode to the specified value
	 * @param {*} crewCode code of crew the player wants to join
	 */
	joinCrew(crewCode) {
		this.crew.crewCode = crewCode;
		// import all crew members
	}
}

export default new Player();
