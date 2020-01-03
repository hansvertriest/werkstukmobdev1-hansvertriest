import App from '../lib/App';
import Page from '../lib/Page';
import Backend from '../lib/Backend';
import Mapbox from '../lib/core/MapBox';

const backMapTemplate = require('../templates/backMap.hbs');

/**
 * @description adds all members to the map
 * @param {*} map
 * @param {*} members
 * @param {*} centerpoint
 * @param {*} taggers
 */
const addPoints = (map, members, centerpoint) => {
	members.forEach((member) => {
		const source = member;
		map.addPoint(source, centerpoint);
	});
};

/**
 * @description gives the colors to the points according if the point is a tagger or not
 * @param {*} taggers
 * @param {*} members
 * @param {*} map
 */
const givePointColors = async (taggers, members, map) => {
	members.forEach((member) => {
		const source = member;
		let color;
		if (taggers.includes(source)) {
			// change color to yellow
			color = Backend.tagColor;
		} else {
			// change color to blue
			color = Backend.normalColor;
		}
		map.getMap().setPaintProperty(member, 'circle-color', color);
	});
};

/**
 * @description checks for tagged members and updates the database and map
 * @param {*} taggers userIds of the taggers
 * @param {*} members userIds of the members
 * @param {*} map
 *  */
const checkNewTagger = async (taggers, members) => {
	// check if tagged
	members.forEach(async (member) => {
		if (!taggers.includes(member)) {
			// get all distances => returns objects with userId with the distance to the taggers
			const distanceToTaggerObjs = await Backend.getDistanceToTagger(member, taggers);
			// get smallest distance
			let smallestDistanceObj;
			distanceToTaggerObjs.forEach((obj) => {
				if (smallestDistanceObj === undefined || obj.distance < smallestDistanceObj.distance) {
					smallestDistanceObj = obj;
				}
			});
			// if member is tagged
			if (smallestDistanceObj.distance < Backend.tagRadius && !Backend.oldTagger.includes(member)) {
				console.log('TaggerSwitch');
				// update the taggers
				await Backend.addTagger(Backend.crewCode, member);
			}
		}
	});
};

const pageScript = async (data) => {
	const mapId = 'map';

	App.render(backMapTemplate({ mapId }));
	/* handle map */

	// init map
	const map = new Mapbox('pk.eyJ1IjoicGltcGFtcG9taWtiZW5zdG9tIiwiYSI6ImNqdmM1a3dibjFmOHE0NG1qcG9wcHdmNnIifQ.ZwK_kkHHAYRTbnQvD7oVBw');

	// set map points
	map.getMap().on('load', () => {
		// add points and set color
		addPoints(map, data.members, data.centerpoint, data.taggers);
		givePointColors(data.taggers, data.members, map);

		// listen for changes in location
		const listenLocation = App.firebase.db.collection('crews').doc(Backend.crewCode).collection('locations').onSnapshot(async (crewDocs) => {
			crewDocs.forEach(async (doc) => {
				const coordinates = {
					type: 'Point',
					coordinates: [doc.data().lon, doc.data().lat],
				};
				map.changeData(doc.id, coordinates);
				console.log(coordinates.coordinates);
				checkNewTagger(data.taggers, data.members, map);
			});
		});
		Backend.listeners.push(listenLocation);

		// listen for changes in tagger
		const listenTaggers = App.firebase.db.collection('crews').doc(Backend.crewCode).onSnapshot((crewDoc) => {
			const { members, taggers } = crewDoc.data();
			givePointColors(taggers, members, map);
			console.log('change');
		});
		Backend.listeners.push(listenTaggers);
	});
	map.goToCoords(data.centerpoint[0], data.centerpoint[1]);
};

const collectData = async () => {
	const crewDoc = await App.firebase.db.collection('crews').doc(Backend.crewCode).get();
	const { members, taggers, settings } = crewDoc.data();
	const data = {
		members,
		taggers,
		centerpoint: settings.centerpoint,
	};
	return data;
};

export default async () => {
	const currentPage = '/backCrewDetail';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		const data = await collectData();
		pageScript(data);
	}

	App.router.navigate('/backMap');
};
