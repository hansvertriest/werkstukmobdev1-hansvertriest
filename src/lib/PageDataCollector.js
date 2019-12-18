import Player from './Player';
import Crew from './Crew';
import Game from './Game';

/*
	Contains a method per page that returns the necessary data for that particular page
*/
class PageDataCollector {
	dataCrewOverview() {
		const crewArray = [];
		Crew.crewMembers.forEach((member) => {
			crewArray.push({
				userId: member.userId,
				screenName: member.screenName,
				avatar: member.avatar,
			});
		});
		const data = { crew: crewArray };
		return data;
	}

	dataHome() {
		return {
			screenName: Player.screenName,
			avatar: Player.avatar,
		};
	}

	dataGame() {
		const locationCrew = [];
		Crew.crewMembers.forEach((member) => {
			locationCrew.push(member.location);
		});

		const isModerator = (Crew.moderator === Player.userId);
		const isTagger = (Game.taggers.includes(Player.userId));
		const currentTime = new Date(Date.now());
		const endTime = new Date(Game.startTime - Game.duration);
		const time = currentTime.getTime() - endTime.getTime();

		// calculate distance from every tagger
		const taggerLocations = Game.taggers.map((taggerId) => {
			const tagger = Crew.getMemberById(taggerId);
			console.log(tagger);
			const distance = {
				userId: tagger.userId,
				distance: this.distance(
					Player.location.lat,
					Player.location.lon,
					tagger.location.lat,
					tagger.location.lon,
				),
			};
			return distance;
		});

		// get smallest distance
		let distance;
		taggerLocations.forEach((tagger) => {
			console.log(tagger);
			if (tagger.distance < distance && distance !== undefined) {
				distance = tagger.distance;
			}
		});

		return {
			avatar: Player.avatar,
			isModerator,
			isTagger,
			time,
			distanceToAlien: distance,
			messages: Game.messages,
			locationPlayer: Player.location,
			locationCrew,
		};
	}

	distance(lat1, lon1, lat2, lon2) {
		if ((lat1 === lat2) && (lon1 === lon2)) {
			return 0;
		}
		const radlat1 = (Math.PI * lat1) / 180;
		const radlat2 = (Math.PI * lat2) / 180;
		const theta = lon1 - lon2;
		const radtheta = (Math.PI * theta) / 180;
		// eslint-disable-next-line max-len
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = (dist * 180) / Math.PI;
		dist = dist * 60 * 1.1515;
		dist *= 1.609344;
		return dist;
	}
}

export default new PageDataCollector();
