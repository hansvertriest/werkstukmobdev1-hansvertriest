export default class CrewMember {
	constructor(userId, screenName, avatar, emblem) {
		this.userId = userId;
		this.screenName = screenName;
		this.avatar = avatar;
		this.emblem = emblem;
		this.location = undefined;
		this.isModerator = false;
	}

	assignEmblem(emblemString) {
		this.emblem = emblemString;
	}
}
