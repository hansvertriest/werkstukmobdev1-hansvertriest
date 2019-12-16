import App from '../lib/App';

const createOverviewTemplate = require('../templates/createOverview.hbs');

export default () => {
	// input data
	const data = {
		crew: [
			{ screenName: 'josé', avatar: 'astro1', emblem: 'shield' },
			{ screenName: 'josanne', avatar: 'astro1', emblem: 'shield' },
			{ screenName: 'peterken', avatar: 'astro1', emblem: 'shield' },
		],
	};

	const playBtnId = 'id';
	const playBtnIcon = 'play-solid'; // or pause-solid
	const navIdInvite = 'invite';
	const navIdOverview = 'overview';
	const navIdSettings = 'settings';

	App.render(createOverviewTemplate({
		data,
		playBtnId,
		playBtnIcon,
		navIdInvite,
		navIdOverview,
		navIdSettings,
	}));
	App.router.navigate('/createOverview');

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
