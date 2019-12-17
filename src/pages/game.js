import App from '../lib/App';
import Page from '../lib/Page';
import DataSeeder from '../lib/DataSeeder';

const gameTemplate = require('../templates/game.hbs');

const pageScript = () => {
	/* Page data */
	const data = {
		avatar: 'astro1',
		isModerator: true,
		isNotTagger: false,
		time: 60,
		distanceToAlien: '8',
		messages: [
			{ sender: 'janine', msg: 'Lol dit is een berichtje cool he' },
			{ sender: 'Pimpol', msg: 'Ik meot kakkeeeuuh' },
			{ sender: 'Luka', msg: 'Snipperdoelel' },
		],
		locationPlayer: { lat: '465464564', lon: '54446464' },
		locationCrew: [
			{ lat: '465464564', lon: '54446464' },
			{ lat: '465464564', lon: '54446464' },
		],
	};

	/* Dom variables */
	const buttonMsgId = 'buttonMsg';
	const buttonCrewId = 'buttonCrew';
	const buttonSettingsId = 'buttonSettings';

	data.time -= 1;
	App.render(gameTemplate({
		data,
		buttonMsgId,
		buttonCrewId,
		buttonSettingsId,
	}));
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
