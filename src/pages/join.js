import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import Player from '../lib/Player';
import PageDataCollector from '../lib/PageDataCollector';
import DataUploader from '../lib/DataUploader';

const joinTemplate = require('../templates/join.hbs');

const pageScript = (data) => {
	/* DOM variables */
	const joinBtnId = 'joinBtn';
	const codeFieldId = 'codeField';
	const backBtnId = 'backBtn';

	App.render(joinTemplate({ joinBtnId, codeFieldId, backBtnId }));
	App.router.navigate('/join');

	/* Event listeners */

	// Join crew
	EventController.addClickListener(joinBtnId, () => {
		const crewCode = document.getElementById(codeFieldId).value;
		// check if crew exists
		if (data.crewCodes.includes(crewCode)) {
			DataUploader.joinCrew(crewCode);
		}
	});

	// Go back
	EventController.addClickListener(backBtnId, () => {
		App.router.navigate(Page.lastPage);
	});
};

export default async () => {
	const auth = await Page.checkAcces('/join');
	if (auth === true) {
		// listen if user has succesfully joined
		const joinedListener = App.firebase.db.collection('users').doc(Player.userId)
			.onSnapshot((doc) => {
				const dataDoc = doc.data();
				if (dataDoc.crewCode.length === 4) {
					Player.joinCrew(dataDoc.crewCode);
					joinedListener();

					// listen if user has left
					const leftListener = App.firebase.db.collection('users').doc(Player.userId)
						.onSnapshot((doc2) => {
							const dataDoc2 = doc2.data();
							if (dataDoc2.crewCode.length !== 4) {
								Player.leaveCrew(dataDoc2.crewCode);
								leftListener();
								App.router.navigate('/home');
							}
						});
					App.router.navigate('/crewOverview');
				}
			});

		const data = await PageDataCollector.dataJoin();
		pageScript(data);
	} else if (typeof auth === 'string') {
		App.router.navigate(auth);
	} else {
		App.router.navigate('/login');
	}
};
