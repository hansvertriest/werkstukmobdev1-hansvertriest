import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';

const registerAvatarTemplate = require('../templates/registerAvatar.hbs');

export default () => {
	/* DOM variables	*/
	const avatar = 'astro1';
	const chooseBtnId = 'chooseBtn';

	Page.checkAcces('/registerAvatar');
	App.render(registerAvatarTemplate({
		avatar,
		chooseBtnId,
	}));
	App.router.navigate('/registerAvatar');

	/* Event listeners */

	// Register avatar
	EventController.addClickListener(chooseBtnId, () => {
		// Add to database
		App.router.navigate('/home');
	});
};
