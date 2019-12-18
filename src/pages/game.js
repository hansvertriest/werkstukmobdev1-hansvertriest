import App from '../lib/App';
import Page from '../lib/Page';
import DataSeeder from '../lib/DataSeeder';
import PageDataCollector from '../lib/PageDataCollector';

const gameTemplate = require('../templates/game.hbs');

const pageScript = () => {
	/* Dom variables */
	const buttonMsgId = 'buttonMsg';
	const buttonCrewId = 'buttonCrew';
	const buttonSettingsId = 'buttonSettings';

	const screenRefresh = setInterval(() => {
		/* Page data */
		const data = PageDataCollector.dataGame();
		console.log(data);
		App.render(gameTemplate({
			data,
			buttonMsgId,
			buttonCrewId,
			buttonSettingsId,
		}));
	}, 1000);
	/* Page data */
	// const data = {
	// 	avatar: 'astro1',
	// 	isModerator: true,
	// 	isNotTagger: false,
	// 	time: 60,
	// 	distanceToAlien: '8',
	// 	messages: [
	// 		{ sender: 'janine', msg: 'Lol dit is een berichtje cool he' },
	// 		{ sender: 'Pimpol', msg: 'Ik meot kakkeeeuuh' },
	// 		{ sender: 'Luka', msg: 'Snipperdoelel' },
	// 	],
	// 	locationPlayer: { lat: '465464564', lon: '54446464' },
	// 	locationCrew: [
	// 		{ lat: '465464564', lon: '54446464' },
	// 		{ lat: '465464564', lon: '54446464' },
	// 	],
	// };
	Page.pageIntervals.push(screenRefresh);
	App.router.navigate('/game');
};

export default () => {
	/*
	clear all intervals
	*/
	Page.pageIntervals.forEach((interval) => clearInterval(interval));

	/*
	do checkups and start pageScript
	*/
	Page.checkLoggedIn()
		.then(() => {
			// set DBlisteners
			DataSeeder.seedGame();
		})
		.then(() => {
			if (Page.checkAcces('/game')) {
				pageScript();
			} else {
				App.router.navigate('/home');
			}
		});
};
