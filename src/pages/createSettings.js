import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import Player from '../lib/Player';
import DataUploader from '../lib/DataUploader';

const createSettingsTemplate = require('../templates/createSettings.hbs');

const pageScript = (data) => {
	const playBtnId = 'playBtn';
	const playBtnIcon = 'play-solid'; // or pause-solid
	const navIdInvite = 'invite';
	const navIdOverview = 'overview';
	const navIdSettings = 'settings';
	const backBtnId = 'backBtn';

	App.render(createSettingsTemplate({
		data,
		playBtnId,
		playBtnIcon,
		navIdInvite,
		navIdOverview,
		navIdSettings,
		backBtnId,
	}));

	/* Event listeners */

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

const collectData = (settings) => {
	let description;
	let modifierParasite;
	let modifierPlague;
	if (settings.gameMode === 'parasite') {
		description = 'The alien monster carries a dangerous parasite with him! When he catches a crew member the parasite will jump to him/her. Now he/she is the alien monster and will try to catch the others!';
		modifierParasite = 'a-button-container__button--active';
		modifierPlague = '';
	} else {
		description = 'When the alien monster catches a crew member, this member will turn in an alien too and together they will try to infect the others! This untill there are no crew members left or the time runs out. You win by being the last astronaut.';
		modifierParasite = '';
		modifierPlague = 'a-button-container__button--active';
	}

	return {
		settings: {
			description,
			modifierParasite,
			modifierPlague,
			radius: settings.radius,
			duration: settings.duration,
		},
	};
};

export default async () => {
	const currentPage = '/crewOverview';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		// check for updates in crewMembers
		const { crewCode } = Player.crew;
		const settingsUpdateListener = await App.firebase.db.collection('crews').doc(crewCode).onSnapshot(async (doc) => {
			if (doc.exists) {
				const result = doc.data();
				// check if player is still in crew otherwise he/she already left
				// and we can shut down the listener
				if (result.members && result.members.includes(Player.userId)) {
					const data = await collectData(result.settings);
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
					settingsUpdateListener();
					gameHasStartedListener();
					console.log('STARTED');
				}
			}
		});
	}
	App.router.navigate('/createSettings');
};
