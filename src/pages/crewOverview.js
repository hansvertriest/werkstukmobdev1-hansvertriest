import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import Player from '../lib/Player';
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

const collectData = async (crewMemberIds) => {
	const crewArray = [];
	const createArray = await new Promise((resolve) => {
		crewMemberIds.forEach(async (memberId) => {
			const doc = await App.firebase.db.collection('users').doc(memberId).get();
			const member = doc.data();
			const memberObject = {
				userId: memberId,
				screenName: member.screenName,
				avatar: member.avatar,
			};
			crewArray.push(memberObject);
			if (crewArray.length === crewMemberIds.length) {
				resolve({ crew: crewArray });
			}
		});
	});
	return createArray;
};

const hasLeftCrewListener = () => {
	if (Crew.crewCode !== '') {
		App.firebase.db.collection('users').doc(Player.userId)
			.onSnapshot((doc) => {
				const dataDoc = doc.data();
				if (dataDoc.crewCode.length !== 4) {
					Player.leaveCrew(dataDoc.crewCode);
					App.router.navigate('/home');
				}
			});
	}
};

export default async () => {
	const auth = await Page.checkAcces('/crewOverview');
	if (auth === true) {
		// check for updates in crewMembers
		App.firebase.db.collection('crews').doc(Crew.crewCode)
			.onSnapshot(async (doc) => {
				// give the data to the collector and run page script
				const result = doc.data();
				const data = await collectData(result.members);
				pageScript(data);
			});
		hasLeftCrewListener();
		App.router.navigate('/crewOverview');
	} else if (typeof auth === 'string') {
		App.router.navigate(auth);
	} else {
		App.router.navigate('/login');
	}
};
