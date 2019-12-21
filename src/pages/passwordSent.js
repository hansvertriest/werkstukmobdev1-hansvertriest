import App from '../lib/App';
import Page from '../lib/Page';
import EventController from '../lib/EventController';

const passwordSentTemplate = require('../templates/passwordSent.hbs');

const pageScript = (data) => {
	const toLoginBtnId = 'toLoginBtn';
	App.render(passwordSentTemplate({ data, toLoginBtnId }));

	EventController.addClickListener(toLoginBtnId, () => {
		App.router.navigate('/login');
	});
};

export default () => {
	const data = 'hans.vertriest@gmail.com';

	Page.initPage('/passwordSent');
	pageScript(data);

	App.router.navigate('/passwordSent');
};
