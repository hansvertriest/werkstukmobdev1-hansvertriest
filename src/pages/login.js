import App from '../lib/App';

const loginTemplate = require('../templates/login.hbs');

export default () => {
	const emailFieldId = 'emailField';
	const passwordFieldId = 'passwordField';
	const submitBtnId = 'submitBtn';
	const googleBtnId = 'googleBtn';

	App.render(loginTemplate({
		emailFieldId,
		passwordFieldId,
		submitBtnId,
		googleBtnId,
	}));
	App.router.navigate('/login');
};
