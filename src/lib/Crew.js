export default class Crew {
	constructor() {
		this.crewCode = ''; // string
		this.inGame = false;
		this.moderator = false; // string
		this.taggers = [];
		this.crewMembers = [];
		this.moderatorEmblem = 'shield-alt-solid';
		this.settings = {};
	}

	/**
	 * @description returns if the player is moderator of the crew
	 */
	playerIsModerator() {
		return this.moderator;
	}

	// crew modification methods

	/**
	 * @description Resets the parameters of the crew object
	 */
	resetParams() {
		this.crewCode = '';
		this.inGame = false;
		this.moderator = false;
		this.crewMembers = [];
	}

	/**
	 * @description sets the crewcode to the specified value (bool)
	 * @param {*} code bool
	 */
	setCrewCode(code) {
		this.crewCode = code;
	}

	/**
	 * @description sets if the player is moderator of this crew
	 * @param {*} bool
	 */
	setPlayerModerator(bool) {
		this.moderator = bool;
	}

	/**
	 * @description resets all parameters of this crew
	 */
	resetCrew() {
		this.crewCode = ''; // string
		this.inGame = false;
		this.moderator = undefined; // string
		this.crewMembers = [];
	}

	/**
	 * @description fills in paramaters of this crew by the specified values
	 * @param {*} crewCode
	 * @param {*} moderator is the player moderator of this crew true/false
	 * @param {*} crewMembers array of crewmamber of this crew
	 */
	loadCrew(crewCode, moderator, crewMembers) {
		this.crewCode = crewCode; // string
		this.inGame = false;
		this.moderator = moderator; // string
		this.crewMembers = crewMembers;
	}

	/**
	 * @description sets the settings of the crew to the specified values
	 * @param {*} gameMode
	 * @param {*} duration
	 * @param {*} radius
	 * @param {*} centerpoint
	 * @param {*} taggers
	 */
	setSettings(gameMode, duration, radius, centerPoint, taggers) {
		this.settings = {
			gameMode,
			duration,
			radius,
			centerPoint,
			taggers,
		};
	}

	setTaggers(taggersArray) {
		this.taggers = taggersArray;
	}

	// crew actions
	/**
	 * @description sets inGame parameter of crew to true
	 */
	startGame() {
		this.inGame = true;
	}
}
