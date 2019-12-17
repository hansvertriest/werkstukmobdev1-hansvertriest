import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import DataSeeder from '../lib/DataSeeder';

const joinTemplate = require('../templates/join.hbs');

const pageScript = () => {
	/* DOM variables */
	const joinBtnId = 'joinBtn';
	const codeFieldId = 'codeField';

	Page.checkAcces('/join');
	App.render(joinTemplate({ joinBtnId, codeFieldId }));
	App.router.navigate('/join');

	/* Event listeners */

	// Join crew
	EventController.addClickListener(joinBtnId, () => {
		const crewCode = document.getElementById(codeFieldId).value;
		console.log(crewCode);
		// check if code is in seeder's code | when implementing DB -> else if code is in DB
		if (DataSeeder.crewCodes.includes(crewCode) && App._firebase.getAuth().currentUser.email === 'test@test.com') {
			DataSeeder.joinCrew(crewCode);
		}
		App.router.navigate('/crewOverview');
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
			if (Page.checkAcces('/join')) {
				pageScript();
			} else {
				App.router.navigate('/login');
			}
		});
};
