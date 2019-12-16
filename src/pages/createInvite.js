import App from '../lib/App';

const createInviteTemplate = require('../templates/createInvite.hbs');

export default () => {
	// input data
	const data = {
		crew: [
			{ screenName: 'josé', avatar: 'astro1', emblem: 'shield' },
			{ screenName: 'josanne', avatar: 'astro1', emblem: 'shield' },
			{ screenName: 'peterken', avatar: 'astro1', emblem: 'shield' },
		],
		settings: {
			duration: '15',
			radius: '500',
			modifierParasite: 'a-button-container__button--active',
			modifierPlague: '',
			description: 'The alien monster carries a dangerous parasite with him! When he catches a crew member the parasite will jump to him/her. Now he/she is the alien monster and will try to catch the others!',
			isInGame: true,
		},
		code: '0471',
	};

	const playBtnId = 'id';
	const playBtnIcon = 'play-solid'; // or pause-solid
	const navIdInvite = 'invite';
	const navIdOverview = 'overview';
	const navIdSettings = 'settings';

	App.render(createInviteTemplate({
		data,
		playBtnId,
		playBtnIcon,
		navIdInvite,
		navIdOverview,
		navIdSettings,
	}));
	App.router.navigate('/createInvite');

	document.getElementById(navIdInvite).addEventListener('click', () => {
		App.router.navigate('/createInvite');
	});
	document.getElementById(navIdOverview).addEventListener('click', () => {
		App.router.navigate('/createOverview');
	});
	document.getElementById(navIdSettings).addEventListener('click', () => {
		App.router.navigate('/createSettings');
	});
};
