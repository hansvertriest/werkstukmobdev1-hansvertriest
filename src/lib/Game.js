class Game {
	constructor() {
		this.isSet = false;
		this.gameMode = undefined; // parasite / plague
		this.duration = undefined; // amount of seconds
		this.startTime = undefined; // date object
		this.center = undefined; // array of lon lat
		this.radius = undefined; // in meters
		this.taggers = []; // array of userId's
	}

	/*
	Sets all parameters of the game.
	*/
	setSettings(gameMode, duration, center, radius, taggers) {
		this.gameMode = gameMode;
		this.duration = duration;
		this.center = center;
		this.radius = radius;
		this.taggers = taggers;
		this.isSet = true;
	}
}

export default new Game();
