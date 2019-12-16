import App from '../lib/App';

const registerAvatarTemplate = require('../templates/registerAvatar.hbs');

export default () => {
	const avatar = 'astro1';
	const chooseBtnId = 'chooseBt';

	App.render(registerAvatarTemplate({
		avatar,
		chooseBtnId,
	}));
	App.router.navigate('/registerAvatar');
};
