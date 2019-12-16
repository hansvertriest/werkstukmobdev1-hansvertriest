import App from '../lib/App';

const accountTemplate = require('../templates/account.hbs');

export default () => {
	const data = {
		history: [
			{
				date: 'vrijdag',
				users: [{ screenName: 'josé', avatar: 'astro1' }, { screenName: 'josanne', avatar: 'astro1' }, { screenName: 'peterken', avatar: 'astro1' }],
			},
			{
				date: 'zondag',
				users: [{ screenName: 'josé', avatar: 'astro1' }, { screenName: 'josanne', avatar: 'astro1' }, { screenName: 'peterken', avatar: 'astro1' }],
			},
		],
		userAvatar: 'astro1',
	};

	App.render(accountTemplate({ data }));
	App.router.navigate('/account');
};
