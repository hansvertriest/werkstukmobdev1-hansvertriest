import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import Player from '../lib/Player';
import DataUploader from '../lib/DataUploader';

const crewOverviewTemplate = require('../templates/crewOverview.hbs');

const pageScript = async (data) => {
	/* DOM variables */
	const leaveBtnId = 'leaveBtn';

	App.render(crewOverviewTemplate({ data, leaveBtnId }));

	/* Event listeners */

	// Leave crew
	EventController.addClickListener(leaveBtnId, () => {
		DataUploader.leaveCrew(Player.crew.crewCode);
		App.router.navigate('/home');
	});

	// listen if game has started
	const gameStartedListener = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).onSnapshot((doc) => {
		const { inGame, taggers } = doc.data();
		if (inGame && taggers.length !== 0) {
			if (taggers.includes(Player.userId)) {
				App.router.navigate('/gameStart');
			} else if (inGame) {
				App.router.navigate('/game');
			}
			gameStartedListener();
		}
	});
};

/**
 * @description Collects the data necessary for this page
 * @param {*} crewMemberIds the ids of all the members of the group
 */
const collectData = async (crewMemberIds) => {
	const moderatorDoc = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).get();
	const { moderator } = moderatorDoc.data();
	const crewArray = [];
	const createArray = await new Promise((resolve) => {
		crewMemberIds.forEach(async (memberId) => {
			const emblem = (memberId === moderator) ? 'shield-alt-solid' : '';
			// emblem = (taggers.includes(memberId)) ? 'splotch-solid' : '' ;
			const doc = await App.firebase.db.collection('users').doc(memberId).get();
			const member = doc.data();
			const memberObject = {
				userId: memberId,
				screenName: member.screenName,
				avatar: member.avatar,
				emblem,
			};
			crewArray.push(memberObject);
			if (crewArray.length === crewMemberIds.length) {
				resolve({ crew: crewArray });
			}
		});
	});
	return createArray;
};


export default async () => {
	const currentPage = '/crewOverview';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		const { crewCode } = Player.crew;
		// check for updates in crewMembers
		const crewUpdateListener = await App.firebase.db.collection('crews').doc(crewCode).onSnapshot(async (doc) => {
			if (doc.exists) {
				const result = doc.data();
				// check if player is in the crew otherwise terminate the listener
				if (result.members && result.members.includes(Player.userId)) {
					const data = await collectData(result.members);
					pageScript(data);
				} else {
					App.router.navigate('/home');
					crewUpdateListener();
				}
			} else {
				DataUploader.deleteCrewCode(crewCode);
				App.router.navigate('/home');
				crewUpdateListener();
			}
			App.router.navigate(init);
		});
		Page.gameListeners.push(crewUpdateListener);
	}
};
