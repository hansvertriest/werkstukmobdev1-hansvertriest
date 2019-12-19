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
		if (data.crewCodes.includes(crewCode) && App._firebase.getAuth().currentUser.email === 'test@test.com') {
			DataUploader.joinCrew(crewCode);
		}
	});

	// Go back
	EventController.addClickListener(backBtnId, () => {
		App.router.navigate(Page.lastPage);
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
	Page.checkAcces('/join')
		.then((resp) => {
			if (resp) {
				/* Data listener */

				// listen if user has joined
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
						Player.crewCode = dataDoc.crewCode;
					});

				PageDataCollector.dataJoin()
					.then((data) => {
						pageScript(data);
					});
			} else if (typeof resp === 'string') {
				App.router.navigate(resp);
			} else {
				App.router.navigate('/login');
			}
		});
};
