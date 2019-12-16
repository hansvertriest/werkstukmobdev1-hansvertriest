import App from '../lib/App';
import Page from '../lib/Page';
import EventController from '../lib/EventController';
import PageDataCollector from '../lib/PageDataCollector';
import DataSeeder from '../lib/DataSeeder';
import Crew from '../lib/Crew';

const crewOverviewTemplate = require('../templates/crewOverview.hbs');

export default () => {
	/* DOM variables */
	const leaveBtnId = 'leaveBtn';

	/* Set dataListeners */

	DataSeeder.seedCrew(3);

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

		// terminate interval when other page is visible
		if (Page.currentPage !== '/crewOverview') {
			clearInterval(screenRefresh);
		}
	}, 1000);
	App.router.navigate('/crewOverview');
	Page.checkAcces('/crewOverview', screenRefresh);
};
