import App from '../lib/App';
import EventController from '../lib/EventController';

const permissionDeniedTemplate = require('../templates/permissionDenied.hbs');

export default () => {
	/* Dom variables */
	const toHomeBtnId = 'toHomeBtn';
	App.render(permissionDeniedTemplate({ toHomeBtnId }));
	App.router.navigate('/permissionDenied');

	/* Event lsiteners */
	EventController.addClickListener('toHomeBtn', () => {
		App.router.navigate('/home');
	});
};
