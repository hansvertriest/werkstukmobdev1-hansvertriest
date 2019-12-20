import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import PageDataCollector from '../lib/PageDataCollector';
import DataUploader from '../lib/DataUploader';
import Crew from '../lib/Crew';

const crewOverviewTemplate = require('../templates/crewOverview.hbs');

const pageScript = (data) => {
	/* DOM variables */
	const leaveBtnId = 'leaveBtn';

	App.render(crewOverviewTemplate({ data, leaveBtnId }));

	/* Event listeners */

	// Leave crew
	EventController.addClickListener(leaveBtnId, () => {
		DataUploader.leaveCrew(Crew.crewCode);
	});

	// check if game has started
	if (Crew.inGame) {
		App.router.navigate('/game');
	}

	App.router.navigate('/crewOverview');
};

export default async () => {
	const auth = await Page.checkAcces('/crewOverview');
	if (auth === true) {
		// check for updates in crewMembers
		App.firebase.db.collection('crews').doc(Crew.crewCode)
			.onSnapshot(async (doc) => {
				// give the data to the collector and run page script
				const result = doc.data();
				const data = await PageDataCollector.dataCrewOverview(result.members);
				pageScript(data);
			});
		App.router.navigate('/crewOverview');
	} else if (typeof auth === 'string') {
		App.router.navigate(auth);
	} else {
		App.router.navigate('/login');
	}
};
