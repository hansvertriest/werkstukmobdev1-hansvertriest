import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import DataSeeder from '../lib/DataSeeder';

const joinTemplate = require('../templates/join.hbs');

export default () => {
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
		// check if code is in seeder's code | when implementing DB -> else if code is in DB
		if (DataSeeder.crewCodes.includes(crewCode)) {
			DataSeeder.joinCrew(crewCode);
			App.router.navigate('/crewOverview');
		}
	});
};
