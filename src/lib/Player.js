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
}

export default new Player();
