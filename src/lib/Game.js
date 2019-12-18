class Game {
	constructor() {
		this.isSet = false;
		this.gameMode = undefined; // parasite / plague
		this.duration = undefined; // amount of seconds
		this.startTime = undefined; // date object
		this.center = undefined; // array of lon lat
		this.radius = undefined; // in meters
		this.taggers = []; // array of userId's
		this.messages = [];
	}

	/*
	Sets all parameters of the game.
	*/
	setSettings(gameMode, duration, center, radius, taggers, startTime) {
		this.gameMode = gameMode;
		this.duration = duration;
		this.startTime = startTime;
		this.center = center;
		this.radius = radius;
		this.taggers = taggers;
		this.isSet = true;
	}

	addMessage(sender, msg, timestamp) {
		this.messages.push({ sender, msg, timestamp });
	}
}

export default new Game();
