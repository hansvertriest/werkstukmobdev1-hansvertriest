import App from '../lib/App';
import EventController from '../lib/EventController';
import Backend from '../lib/Backend';


const backCrewDetailTemplate = require('../templates/backCrewDetail.hbs');

const pageScript = (data) => {
	// DOM page variables
	const addUserBtnId = 'addUserBtn';
	App.render(backCrewDetailTemplate({
		data,
		addUserBtnId,
	}));

	// Eventlisteners
	EventController.addClickListener(addUserBtnId, () => {
		Backend.generateRandomUser();
	});
};
/**
 * @description Collects the data necessary for this page
 */
const collectData = async () => {
	const crewsDoc = await App.firebase.db.collection('crews').doc(Backend.crewCode).get();
	const crewInfo = crewsDoc.data();
	const crewMembers = [];
	// fill crewMembers with user information
	await new Promise((resolve) => {
		crewInfo.members.forEach(async (member) => {
			const userDoc = await App.firebase.db.collection('users').doc(member).get();
			const userInfo = userDoc.data();
			crewMembers.push({
				screenName: userInfo.screenName,
				avatar: userInfo.avatar,
			});
			if (crewMembers.length === crewInfo.members.length) {
				resolve();
			}
		});
	});
	const data = {
		crewCode: Backend.crewCode,
		members: crewMembers,
	};
	return data;
};

export default async () => {
	const data = await collectData();
	pageScript(data);
	App.router.navigate('/backCrewDetail');
};
