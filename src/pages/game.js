import App from '../lib/App';
import Page from '../lib/Page';
import Game from '../lib/Game';
import DataUploader from '../lib/DataUploader';
import Player from '../lib/Player';
import Mapbox from '../lib/core/MapBox';

const gameTemplate = require('../templates/game.hbs');

/**
 * @description gives the colors to the points according if the point is a tagger or not
 * @param {*} taggers
 * @param {*} members
 * @param {*} map
 */
const givePointsColor = async (map, pointSources, taggers) => {
	pointSources.forEach((source) => {
		let color;
		if (taggers.includes(source)) {
			// change color to yellow
			color = Game.taggerColor;
		} else {
			// change color to blue
			color = Game.basicColor;
		}
		map.getMap().setPaintProperty(source, 'circle-color', color);
	});
};

const getMemberLocObj = async (member) => {
	const locationDoc = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).collection('locations').doc(member)
		.get();
	const locationMember = locationDoc.data();
	return { userId: member, lat: locationMember.lat, lon: locationMember.lon };
};

/**
 * @description returns an array with all objects containing userId, lon, lat
 * of the members that should be displayed
 * @param {*} members array of userIds of all members
 * @param {*} isTagger if the player is tagger
 */
const getMemberLocObjsToBeDisplayed = async (members, isTagger) => {
	let memberObjsToBeAdded;
	if (isTagger) {
		// return all membersLocObjs
		memberObjsToBeAdded = [];
		await new Promise((resolve) => {
			members.forEach(async (member) => {
				const memberLocObj = await getMemberLocObj(member);
				memberObjsToBeAdded.push(memberLocObj);
				if (memberObjsToBeAdded.length === members.length) {
					resolve();
				}
			});
		});
		return memberObjsToBeAdded;
	} else {
		return [await getMemberLocObj(Player.userId)];
	}
};

/**
 * @description removes the members that are visible and shouldn't and
 * add the members that aren't but should to the map
 * @param {*} map map object
 * @param {*} visibleMembers members that are visible
 * @param {*} membersLocObjsToBeAdded memberLoCobjs that should be visible
 */
const updatePoints = (map, visibleMembers, membersLocObjsToBeAdded) => {
	const memberIdsToBeAdded = membersLocObjsToBeAdded.map((member) => member.userId);
	// get all members that have to be removed
	// eslint-disable-next-line max-len
	const membersToBeRemoved = visibleMembers.filter((member) => !memberIdsToBeAdded.includes(member));
	membersToBeRemoved.forEach((member) => {
		map.removePoint(member);
	});
	// get all members that have to be added
	// eslint-disable-next-line max-len
	const membersToBeAdded = membersLocObjsToBeAdded.filter((member) => !visibleMembers.includes(member.userId));
	membersToBeAdded.forEach((member) => {
		map.addPoint(member.userId, [member.lon, member.lat]);
	});
};


const checkDistance = (lon1, lat1, lon2, lat2) => {
	if ((lat1 === lat2) && (lon1 === lon2)) {
		return 0;
	} else {
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
};

/**
 * @description returns an array with distances to each tagger
 * @param {*} member is a userID of the member
 * @param {*} taggers is the array of userId's of the tagger
 */
const getDistanceToTagger = async (member, taggers) => {
	// get location of member
	const locationDoc = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).collection('locations').doc(member)
		.get();
	const locationMember = locationDoc.data();
	// get all taggers
	let taggerArray;
	if (taggers === undefined) {
		const crewDoc = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).get();
		taggerArray = crewDoc.data().taggers;
	} else {
		taggerArray = taggers;
	}
	// get all distances to tagger
	const distances = [];
	const taggerLocationDoc = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).collection('locations').get();
	taggerLocationDoc.forEach(async (taggerDoc) => {
		if (taggerArray.includes(taggerDoc.id)) {
			const taggerlocation = taggerDoc.data();
			// eslint-disable-next-line max-len
			const distance = await checkDistance(locationMember.lon, locationMember.lat, taggerlocation.lon, taggerlocation.lat);
			distances.push({
				tagger: taggerDoc.id,
				distance,
				userId: member,
			});
		}
	});
	return distances;
};

/**
 * @description checks for tagged members and updates the database and map
 * @param {*} taggers userIds of the taggers
 * @param {*} members userIds of the members
 * @param {*} map
 *  */
const checkNewTagger = async (taggers) => {
	if (!taggers.includes(Player.userId)) {
		// get all distances => returns objects with userId with the distance to the taggers
		const distanceToTaggerObjs = await getDistanceToTagger(Player.userId, taggers);
		// get smallest distance
		let smallestDistanceObj;
		distanceToTaggerObjs.forEach((obj) => {
			if (smallestDistanceObj === undefined || obj.distance < smallestDistanceObj.distance) {
				smallestDistanceObj = obj;
			}
		});
		// update on screen
		Page.changeInnerText('distance', smallestDistanceObj.distance);
		// get old taggers
		const previousTaggerDoc = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).get();
		const { previousTaggers } = previousTaggerDoc.data();
		// if member is tagged
		if (smallestDistanceObj.distance < Game.tagRadius && !previousTaggers.includes(Player.userId)) {
			App.router.navigate('/taggedConfirm');
		}
		Page.changeInnerText('debug', 'not tagged');
	}
};

const pageScript = (data) => {
	/* Dom variables */
	const buttonMsgId = 'buttonMsg';
	const buttonCrewId = 'buttonCrew';
	const buttonSettingsId = 'buttonSettings';
	const mapId = 'map';
	const timerId = 'timer';

	/* updating page data */

	// update timer
	const timerInterval = setInterval(() => {
		const now = new Date().getTime() / 1000;
		const difference = Math.floor(now - data.startDate.seconds);
		const differenceMinutes = Math.floor(difference / 60);
		const differenceSeconds = (difference - differenceMinutes * 60);
		let minutesLeft = data.duration - differenceMinutes;
		let secondsLeft = 60 - differenceSeconds;
		if (secondsLeft === 60) {
			secondsLeft = '00';
		} else if (secondsLeft !== 0) {
			minutesLeft -= 1;
		}
		if (minutesLeft < 0) {
			DataUploader.stopGame(Player.crew.crewCode);
			clearInterval(timerInterval);
		}
		Page.changeInnerText(timerId, `${minutesLeft}:${secondsLeft}`);
	}, 1000);
	Page.gameIntervals.push(timerInterval);

	App.render(gameTemplate({
		data,
		buttonMsgId,
		buttonCrewId,
		buttonSettingsId,
		mapId,
		timerId,
	}));

	/* handle map */

	// init map
	const map = new Mapbox('pk.eyJ1IjoicGltcGFtcG9taWtiZW5zdG9tIiwiYSI6ImNqdmM1a3dibjFmOHE0NG1qcG9wcHdmNnIifQ.ZwK_kkHHAYRTbnQvD7oVBw');

	// set map points
	map.getMap().on('load', async () => {
		// set member and tagger array so these can be updated
		let { taggers, members } = data;

		// listen for changes in location
		const listenLocation = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).collection('locations').onSnapshot(async (crewDocs) => {
			crewDocs.forEach(async () => {
				// update point on map if shown
				// eslint-disable-next-line max-len
				const membersToBeAdded = await getMemberLocObjsToBeDisplayed(members, taggers.includes(Player.userId));
				const visibleMembers = map.getMemberLayers(members);
				updatePoints(map, visibleMembers, membersToBeAdded);
				givePointsColor(map, visibleMembers, taggers);
				checkNewTagger(taggers);
			});
		});
		Page.gameListeners.push(listenLocation);

		// listen for changes in tagger
		const listenTaggers = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).onSnapshot(async (crewDoc) => {
			// update map
			taggers = crewDoc.data().taggers;
			members = crewDoc.data().members;
			// reset points
			// eslint-disable-next-line max-len
			const membersToBeAdded = await getMemberLocObjsToBeDisplayed(members, taggers.includes(Player.userId));
			const visibleMembers = map.getMemberLayers(members);
			updatePoints(map, visibleMembers, membersToBeAdded);
			givePointsColor(map, visibleMembers, taggers);
		});
		Page.gameListeners.push(listenTaggers);

		const userLoc = await getMemberLocObj(Player.userId);
		map.goToCoords(userLoc.lon, userLoc.lat);
	});
};

const collectData = async () => {
	// get centerpoint, taggers, members
	const crewDoc = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).get();
	const {
		settings,
		taggers,
		members,
		moderator,
		avatar,
	} = crewDoc.data();
	return {
		avatar,
		centerpoint: settings.centerpoint,
		taggers,
		members,
		startDate: settings.startDate,
		duration: settings.duration,
		isModerator: (moderator === Player.userId),
	};
};

export default async () => {
	const currentPage = '/game';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		const data = await collectData();
		pageScript(data);

		// set GPS tracking, then update DB
		navigator.geolocation.watchPosition(
			(position) => {
				DataUploader.changePlayerLocation(position.coords.longitude, position.coords.latitude);
			},
			() => {
				// App.router.navigate('/connectionLost');
			},
			{
				enableHighAccuracy: true,
				timeout: 1000,
			},
		);
	}


	App.router.navigate(init);

	const gameStoppedListener = App.firebase.db.collection('crews').doc(Player.crew.crewCode).onSnapshot((crewDoc) => {
		const { inGame, taggers, settings } = crewDoc.data();
		if (!inGame) {
			if (taggers.includes(Player.userId) && settings.gameMode === 'parasite') {
				App.router.navigate('/loseParasite');
			} else if (!taggers.includes(Player.userId) && settings.gameMode === 'parasite') {
				App.router.navigate('/winParasite');
			}
			gameStoppedListener();
		}
	});
};
