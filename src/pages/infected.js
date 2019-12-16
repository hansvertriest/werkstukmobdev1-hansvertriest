import App from '../lib/App';

const infectedTemplate = require('../templates/infected.hbs');

export default () => {
	const title = 'infected automatic';

	App.render(infectedTemplate({ title }));
	App.router.navigate('/infected');
};
