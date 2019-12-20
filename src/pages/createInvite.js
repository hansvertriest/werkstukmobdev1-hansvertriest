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

export default () => {
	Page.checkAcces('/createInvite')
		.then((resp) => {
			if (resp === true) {
				// if not already have crew => create one
				if (Player.crew.crewCode.length !== 4 || !Player.crew.playerIsModerator()) {
					DataUploader.createCrew();
				}

				// Listen if crew has been created
				const isCreated = App.firebase.db.collection('users').doc(Player.userId)
					.onSnapshot((doc) => {
						const playerInfo = doc.data();
						if (playerInfo.crewCode === Player.crew.crewCode) {
							pageScript({ crewCode: Player.crew.crewCode });
							isCreated();
						}
					});
				App.router.navigate('/createInvite');
			} else if (typeof resp === 'string') {
				App.router.navigate(resp);
			} else {
				App.router.navigate('/login');
			}
		});
};
