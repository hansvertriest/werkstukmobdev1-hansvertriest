import App from '../lib/App';

const registerTemplate = require('../templates/register.hbs');

export default () => {
	const nameFieldId = 'nameField';
	const emailFieldId = 'emailField';
	const passwordFieldId = 'passwordField';
	const submitBtnId = 'submiBbtn';
	const googleBtnId = 'googleBtn';

	App.render(registerTemplate({
		nameFieldId,
		emailFieldId,
		passwordFieldId,
		submitBtnId,
		googleBtnId,
	}));
	App.router.navigate('/register');
};
