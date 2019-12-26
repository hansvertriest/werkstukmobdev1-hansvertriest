import App from '../lib/App';
import EventController from '../lib/EventController';
import Backend from '../lib/Backend';
import Page from '../lib/Page';

const backCrewDetailTemplate = require('../templates/backCrewDetail.hbs');

const pageScript = (data) => {
	// DOM page variables
	const addUserBtnId = 'addUserBtn';
	const forceStartButtonId = 'forceStartButton';
	const status = (data.inGame) ? 'in game' : 'waiting for start';
	const startStopInnerText = (data.inGame) ? 'stop game' : 'start game';
	console.log(data);

	App.render(backCrewDetailTemplate({
		data,
		addUserBtnId,
		forceStartButtonId,
		status,
		startStopInnerText,
	}));

	/* Eventlisteners */

	EventController.addClickListener(addUserBtnId, () => {
		Backend.generateRandomUser();
	});
	EventController.addClickListener(forceStartButtonId, () => {
		if (data.inGame) {
			Backend.stopGame(Backend.crewCode);
		} else {
			Backend.startGame(Backend.crewCode);
		}
	});

	// delete user
	data.members.forEach((member) => {
		console.log(member);
		const id = `a-delete-${member.userId}`;
		EventController.addClickListener(id, () => {
			Backend.deleteUserFromCrew(Backend.crewCode, member.userId);
		});
	});
};
/**
 * @description Collects the data necessary for this page
 */
const collectData = async (crewInfo) => {
	const crewMembers = [];
	// fill crewMembers with user information
	await new Promise((resolve) => {
		crewInfo.members.forEach(async (member) => {
			const userDoc = await App.firebase.db.collection('users').doc(member).get();
			const userInfo = userDoc.data();
			crewMembers.push({
				userId: userDoc.id,
				screenName: userInfo.screenName,
				avatar: userInfo.avatar,
			});
			console.log(crewMembers.length);
			if (crewMembers.length === crewInfo.members.length) {
				resolve();
			}
		});
	});
	const data = {
		crewCode: Backend.crewCode,
		members: crewMembers,
		inGame: crewInfo.inGame,
	};
	return data;
};

export default async () => {
	const currentPage = '/backCrewDetail';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		// listen if something changes in crewDoc
		const listenCrew = await App.firebase.db.collection('crews').doc(Backend.crewCode).onSnapshot(async (crewsDoc) => {
			const crewInfo = crewsDoc.data();
			console.log(crewInfo);
			if (crewInfo.members.length !== 0) {
				const data = await collectData(crewInfo);
				pageScript(data);
			}
		});
		Backend.listeners.push(listenCrew);
	}

	App.router.navigate(init);
};
