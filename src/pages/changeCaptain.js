import App from '../lib/App';

const changeCaptainTemplate = require('../templates/changeCaptain.hbs');

export default () => {
	const title = 'changeCaptain automatic';

	App.render(changeCaptainTemplate({ title }));
	App.router.navigate('/changeCaptain');
};
