import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import Player from '../lib/Player';
import DataUploader from '../lib/DataUploader';

const createInviteTemplate = require('../templates/createInvite.hbs');

const pageScript = (data) => {
	const playBtnId = 'id';
	const playBtnIcon = 'play-solid'; // or pause-solid
	const navIdInvite = 'invite';
	const navIdOverview = 'overview';
	const navIdSettings = 'settings';
	const backBtnId = 'backBtn';

	App.render(createInviteTemplate({
		data,
		playBtnId,
		playBtnIcon,
		navIdInvite,
		navIdOverview,
		navIdSettings,
		backBtnId,
	}));
	App.router.navigate('/createInvite');

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
		await DataUploader.startGame(Player.crew.crewCode, 'parasite');
		console.log(Player.crew.taggers);
	});
};

/**
 * Generates a new crewCode that isn't already in use
 */
const generateCrewCode = async () => {
	// Get all existing crewCodes
	let crewCode;
	const crewCodesDoc = await App.firebase.db.collection('crews').get();
	const crewCodes = [];
	crewCodesDoc.forEach((crew) => {
		crewCodes.push(crew.id);
	});
	// Generate codes while no unique code has ben generated
	do {
		crewCode = Math.floor((Math.random() * 8999) + 1000);
	} while (crewCodes.includes(crewCode));
	return crewCode;
};

export default async () => {
	const currentPage = '/createInvite';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		let crewCode;
		if (!Player.crew.playerIsModerator()) {
			crewCode = await generateCrewCode();
			crewCode = crewCode.toString();
			DataUploader.createCrew(crewCode);
			Player.joinCrew(crewCode);
		} else {
			crewCode = Player.crew.crewCode;
		}

		// listen if crew has been created
		const crewCreatedListener = App.firebase.db.collection('crews').doc(crewCode).onSnapshot((doc) => {
			if (doc.exists && doc.data().moderator === Player.userId) {
				Player.joinCrew(crewCode);
				pageScript({ crewCode: Player.crew.crewCode });
				crewCreatedListener();
			}
		});
		Page.createListeners.push(crewCreatedListener);

		if (!Player.crew.inGame) {
			// listen if game has started
			const gameStartedListener = App.firebase.db.collection('crews').doc(crewCode).onSnapshot((doc) => {
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
			Page.createListeners.push(gameStartedListener);
		} else {
			// listen if game has stopped
			const gameStoppedListener = App.firebase.db.collection('crews').doc(crewCode).onSnapshot((doc) => {
				const { inGame } = doc.data();
				if (!inGame) {
					// stop the fame
					console.log('Game stopped');
					gameStoppedListener();
				}
			});
			Page.createListeners.push(gameStoppedListener);
		}
	}
	App.router.navigate(currentPage);
};
