import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import PageDataCollector from '../lib/PageDataCollector';

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

export default () => {
	/*
	do checkups and start pageScript
	*/
	Page.checkAcces('/home')
		.then((resp) => {
			if (resp) {
				// get data
				PageDataCollector.dataHome()
					.then((data) => {
						// run script
						pageScript(data);
						App.router.navigate('/home');
					});
			} else {
				App.router.navigate('/login');
			}
		});
};
