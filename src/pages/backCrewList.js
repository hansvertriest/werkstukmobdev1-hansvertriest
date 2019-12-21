import App from '../lib/App';
import EventController from '../lib/EventController';
import Backend from '../lib/Backend';

const backCrewListTemplate = require('../templates/backCrewList.hbs');

const pageScript = (data) => {
	// Dom variables
	const deleteFictionalUsersBtnId = 'deleteFictionalUsersBtn';
	App.render(backCrewListTemplate({
		data,
		deleteFictionalUsersBtnId,
	}));

	// eventListeners
	data.crews.forEach((crew) => {
		EventController.addClickListener(crew.crewCode, () => {
			Backend.crewCode = crew.crewCode;
			App.router.navigate('/backCrewDetail');
		});
	});
	EventController.addClickListener(deleteFictionalUsersBtnId, () => {
		Backend.deleteFictionalusers();
	});
};
/**
 * @description Collects the data necessary for this page
 */
const collectData = async () => {
	const crewsDocs = await App.firebase.db.collection('crews').get();
	const crewArray = [];
	crewsDocs.forEach((crew) => {
		crewArray.push({ crewCode: crew.id });
	});
	return { crews: crewArray };
};

export default async () => {
	const data = await collectData();
	pageScript(data);
	App.router.navigate('/backCrewList');
};
