import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';

const homeTemplate = require('../templates/home.hbs');

export default () => {
	/* Page data */
	const data = {
		screenName: 'AlienDestroyer3000',
		avatar: 'astro1',
	};
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
	App.router.navigate('/home');
	Page.checkAcces('/home');


	/* Event listeners */
	EventController.addClickListener(logOutBtnId, () => {
		App._firebase.getAuth().signOut().then(() => {
			App.router.navigate('/login');
		}, (error) => {
			console.log(error);
		});
	});

	// Go to join page
	EventController.addClickListener(joinBtnId, () => {
		App.router.navigate('/join');
	});
};
