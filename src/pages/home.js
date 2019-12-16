import App from '../lib/App';

const homeTemplate = require('../templates/home.hbs');

export default () => {
	const data = {
		screenName: 'AlienDestroyer3000',
		avatar: 'astro1',
	};

	// render the template
	App.render(homeTemplate({ data }));
};
