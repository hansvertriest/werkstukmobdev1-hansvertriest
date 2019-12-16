import App from '../lib/App';

const losePlagueTemplate = require('../templates/losePlague.hbs');

export default () => {
	const data = {
		astronautsInfected: 10,
		survivorsEmpty: true,
		survivorsExist: false,
		survivors: [
			{ screenName: 'lololol', avatar: 'astro1' },
			{ screenName: 'lololol', avatar: 'astro1' },
			{ screenName: 'lololol', avatar: 'astro1' },
		],
	};
	const toGameBtnId = 'toGameBtn';

	App.render(losePlagueTemplate({ data, toGameBtnId }));
	App.router.navigate('/losePlague');
};
