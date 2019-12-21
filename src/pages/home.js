import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import Player from '../lib/Player';

const homeTemplate = require('../templates/home.hbs');

const pageScript = (data) => {
	/* DOM variables */
	const joinBtnId = 'joinBtn';
	const createBtnId = 'createBtn';
	const logOutBtnId = 'logOutBtn';

	App.render(homeTemplate({
		data,
		joinBtnId,
		createBtnId,
		logOutBtnId,
	}));

	/* Event listeners */

	// logout
	EventController.addClickListener(logOutBtnId, () => {
		App._firebase.getAuth().signOut().then(() => {
			Page.resetModel();
			App.router.navigate('/login');
		}, (error) => {
			console.log(error);
		});
	});

	// Go to join page
	EventController.addClickListener(joinBtnId, () => {
		App.router.navigate('/join');
	});

	// Go to create page
	EventController.addClickListener(createBtnId, () => {
		App.router.navigate('/createInvite');
	});
};

/**
 * @description Collects the data necessary for this page
 */
const collectData = async () => {
	const doc = await App.firebase.db.collection('users').doc(Player.userId).get()
		.then((result) => result)
		.catch((error) => {
			console.log(error);
		});
	return doc.data();
};

export default async () => {
	const currentPage = '/home';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		const doc = await collectData();
		pageScript(doc);
	}
	App.router.navigate(init);
};
