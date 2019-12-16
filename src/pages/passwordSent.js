import App from '../lib/App';
import Page from '../lib/Page';

const passwordSentTemplate = require('../templates/passwordSent.hbs');

export default () => {
	const email = 'hans.vertriest@gmail.com';

	Page.checkAcces('/passwordSent');
	App.render(passwordSentTemplate({ email }));
	App.router.navigate('/passwordSent');
};
