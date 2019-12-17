import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import PageDataCollector from '../lib/PageDataCollector';

const homeTemplate = require('../templates/home.hbs');

const pageScript = () => {
	/* Page data */
	const data = PageDataCollector.dataHome();
	console.log(data);
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

export default () => {
	/*
	clear all intervals
	*/
	Page.pageIntervals.forEach((interval) => clearInterval(interval));

	/*
	do checkups and start pageScript
	*/
	Page.checkLoggedIn()
		.then(() => {
			if (Page.checkAcces('/home')) {
				pageScript();
			} else {
				App.router.navigate('/login');
			}
		});
};
