import App from '../lib/App';

const joinTemplate = require('../templates/join.hbs');

export default () => {
	const popupDisplay = 'none';
	App.render(joinTemplate(popupDisplay));
	App.router.navigate('/join');

	document.getElementById('btn').addEventListener('click', () => {
		App.render(joinTemplate(popupDisplay));
	});
};
