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

	App.render(createInviteTemplate({
		data,
		playBtnId,
		playBtnIcon,
		navIdInvite,
		navIdOverview,
		navIdSettings,
	}));
	App.router.navigate('/createInvite');

	EventController.addClickListener(navIdInvite, () => {
		App.router.navigate('/createInvite');
	});
	EventController.addClickListener(navIdOverview, () => {
		App.router.navigate('/createOverview');
	});
	EventController.addClickListener(navIdSettings, () => {
		App.router.navigate('/createSettings');
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
			console.log(crewCode);
		}
		const crewCreatedListener = App.firebase.db.collection('crews').doc(crewCode).onSnapshot((doc) => {
			if (doc.exists && doc.data().moderator === Player.userId) {
				Player.joinCrew(crewCode);
				pageScript({ crewCode: Player.crew.crewCode });
				crewCreatedListener();
			}
			console.log(doc.data());
		});
	}
	App.router.navigate(currentPage);
};
