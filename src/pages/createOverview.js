import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import Player from '../lib/Player';
import DataUploader from '../lib/DataUploader';

const createOverviewTemplate = require('../templates/createOverview.hbs');

const pageScript = (data) => {
	const playBtnId = 'id';
	const playBtnIcon = 'play-solid'; // or pause-solid
	const navIdInvite = 'invite';
	const navIdOverview = 'overview';
	const navIdSettings = 'settings';
	const backBtnId = 'backBtn';

	App.render(createOverviewTemplate({
		data,
		playBtnId,
		playBtnIcon,
		navIdInvite,
		navIdOverview,
		navIdSettings,
		backBtnId,
	}));
	App.router.navigate('/createOverview');

	/* Event lsiteners */

	// navigation
	EventController.addClickListener(navIdInvite, () => {
		App.router.navigate('/createInvite');
	});
	EventController.addClickListener(navIdOverview, () => {
		App.router.navigate('/createOverview');
	});
	EventController.addClickListener(navIdSettings, () => {
		App.router.navigate('/createSettings');
	});

	// Go back
	EventController.addClickListener(backBtnId, () => {
		App.router.navigate(Page.lastPage);
	});

	// start game
	EventController.addClickListener(playBtnId, async () => {
		await DataUploader.startGame(Player.crew.crewCode);
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
	const currentPage = '/createOverview';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		// check for updates in crewMembers
		const { crewCode } = Player.crew;
		const crewUpdateListener = await App.firebase.db.collection('crews').doc(crewCode).onSnapshot(async (doc) => {
			if (doc.exists) {
				const result = doc.data();
				// check if player is still in crew otherwise he/she already left
				// and we can shut down the listener
				if (result.members && result.members.includes(Player.userId)) {
					const data = await collectData(result.members);
					pageScript(data);
				} else {
					App.router.navigate('/home');
				}
			} else {
				DataUploader.deleteCrewCode(crewCode);
				App.router.navigate('/home');
			}
		});

		// check for game to start
		const gameHasStartedListener = App.firebase.db.collection('crews').doc(crewCode).onSnapshot(async (doc) => {
			if (doc.exists) {
				const result = doc.data();
				if (result.inGame) {
					// INSERT: begin game
					crewUpdateListener();
					gameHasStartedListener();
					console.log('STARTED');
				}
			}
		});
	}
	App.router.navigate(init);
};
