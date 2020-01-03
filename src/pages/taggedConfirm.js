import App from '../lib/App';
import Page from '../lib/Page';
import EventController from '../lib/EventController';
import DataUploader from '../lib/DataUploader';
import Player from '../lib/Player';

const taggedConfirmTemplate = require('../templates/taggedConfirm.hbs');

const pageScript = () => {
	const confirmBtnId = 'confirmBtn';
	const denyBtnId = 'denyBtn';

	App.render(taggedConfirmTemplate({
		confirmBtnId,
		denyBtnId,
	}));

	/*
		Add event listeners
	*/

	EventController.addClickListener(confirmBtnId, async () => {
		// update the taggers
		await DataUploader.addTagger(Player.crew.crewCode, Player.userId, 'parasite');
		App.router.navigate('/game');
	});

	EventController.addClickListener(denyBtnId, () => {
		App.router.navigate('/game');
	});
};

export default async () => {
	const currentPage = '/taggedConfirm';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		pageScript();
	}
	App.router.navigate('/taggedConfirm');
};
