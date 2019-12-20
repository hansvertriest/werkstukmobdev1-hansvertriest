import App from '../lib/App';
import EventController from '../lib/EventController';
import DataUploader from '../lib/DataUploader';
import Page from '../lib/Page';
import Player from '../lib/Player';
import Crew from '../lib/Crew';


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
				if (Crew.crewCode.length !== 4 || !Crew.playerIsModerator()) {
					DataUploader.createCrew();
				}

				// Listen if crew has been created
				const isCreated = App.firebase.db.collection('users').doc(Player.userId)
					.onSnapshot((doc) => {
						const playerInfo = doc.data();
						if (playerInfo.crewCode === Crew.crewCode) {
							pageScript({ crewCode: Crew.crewCode });
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
