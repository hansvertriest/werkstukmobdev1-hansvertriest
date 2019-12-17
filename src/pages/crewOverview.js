import App from '../lib/App';
import Page from '../lib/Page';
import EventController from '../lib/EventController';
import PageDataCollector from '../lib/PageDataCollector';
import DataSeeder from '../lib/DataSeeder';
import Crew from '../lib/Crew';

const crewOverviewTemplate = require('../templates/crewOverview.hbs');

const pageScript = () => {
	/* DOM variables */
	const leaveBtnId = 'leaveBtn';

	/* information refresh loop */

	const screenRefresh = setInterval(() => {
		const data = PageDataCollector.dataCrewOverview();
		App.render(crewOverviewTemplate({ data, leaveBtnId }));

		/* Event listeners */

		// Leave crew
		EventController.addClickListener(leaveBtnId, () => {
			Crew.resetCrew();
			clearInterval(screenRefresh);
			App.router.navigate('/join');
		});
		// check if game has started
		if (Crew.inGame) {
			App.router.navigate('/game');
		}
	}, 1000);

	Page.intervals.push(screenRefresh);
	App.router.navigate('/crewOverview');
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
			// Set dataListeners
			DataSeeder.seedCrew(3);
		})
		.then(() => {
			if (Page.checkAcces('/crewOverview')) {
				pageScript();
			} else {
				App.router.navigate('/login');
			}
		});
};
