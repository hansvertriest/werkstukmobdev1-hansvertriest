import App from '../lib/App';
import Page from '../lib/Page';
import Player from '../lib/Player';
import EventController from '../lib/EventController';
import PageDataCollector from '../lib/PageDataCollector';
import DataUploader from '../lib/DataUploader';
import Crew from '../lib/Crew';

const crewOverviewTemplate = require('../templates/crewOverview.hbs');

const pageScript = () => {
	/* DOM variables */
	const leaveBtnId = 'leaveBtn';

	/* information refresh loop */

	const data = PageDataCollector.dataCrewOverview();
	App.render(crewOverviewTemplate({ data, leaveBtnId }));

	/* Event listeners */

	// Leave crew
	EventController.addClickListener(leaveBtnId, () => {
		DataUploader.leaveCrew(Player.crewCode);
	});

	// check if game has started
	if (Crew.inGame) {
		App.router.navigate('/game');
	}

	App.router.navigate('/crewOverview');
};

export default () => {
	/*
	do checkups and start pageScript
	*/
	Page.checkAcces('/crewOverview')
		.then((resp) => {
			if (resp === true) {
				PageDataCollector.dataCrewOverview()
					.then((data) => {
						// run script
						pageScript(data);
						App.router.navigate('/crewOverview');
					});
			} else if (typeof resp === 'string') {
				App.router.navigate(resp);
			} else {
				App.router.navigate('/login');
			}
		});
};
