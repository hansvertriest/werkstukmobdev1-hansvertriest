import App from '../lib/App';

const crewOverviewTemplate = require('../templates/crewOverview.hbs');

export default () => {
	const data = {
		crew: [
			{ screenName: 'josé', avatar: 'astro1', emblem: 'shield-alt-solid' },
			{ screenName: 'josanne', avatar: 'astro1', emblem: '' },
			{ screenName: 'peterken', avatar: 'astro1', emblem: 'splotch-solid' },
		],
	};
	const leaveBtnId = 'id';

	App.render(crewOverviewTemplate({ data, leaveBtnId }));
	App.router.navigate('/crewOverview');
};
