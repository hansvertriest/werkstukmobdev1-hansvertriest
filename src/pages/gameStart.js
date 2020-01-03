import App from '../lib/App';
import Page from '../lib/Page';
import EventController from '../lib/EventController';

const gameStartTemplate = require('../templates/gameStart.hbs');


const pageScript = () => {
	const doorId = 'door';

	App.render(gameStartTemplate({ doorId }));

	let counter = 0;

	EventController.addClickListener(doorId, () => {
		counter++;
		if (counter === 30) {
			App.router.navigate('/game');
		}
	});
};

export default async () => {
	const currentPage = '/gameStart';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		// const doc = await collectData();
		pageScript();
	}
	App.router.navigate(init);
};
