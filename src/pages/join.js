import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import Player from '../lib/Player';
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

const collectData = async () => {
	const crewCodesFetch = await App.firebase.db.collection('crews').get()
		.then((doc) => {
			const crewCodes = doc.docs.map((document) => document.id);
			return { crewCodes };
		})
		.catch((error) => {
			console.log(error);
			return null;
		});
	return crewCodesFetch;
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
					App.router.navigate('/crewOverview');
				}
			});
		const data = await collectData();
		pageScript(data);
	} else if (typeof auth === 'string') {
		App.router.navigate(auth);
	} else {
		App.router.navigate('/login');
	}
};
