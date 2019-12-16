import App from '../lib/App';

const gameTemplate = require('../templates/game.hbs');

export default () => {
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
