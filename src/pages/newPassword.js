import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';

const newPasswordTemplate = require('../templates/newPassword.hbs');

export default () => {
	/* DOM variables */
	const emailFieldId = 'emailField';
	const sendBtnId = 'sendBtn';
	const backBtnId = 'backBtn';

	Page.initPage('/newPassword');
	App.render(newPasswordTemplate({ emailFieldId, sendBtnId, backBtnId }));
	App.router.navigate('/newPassword');

	/* Event listeners */

	// Send password reset email
	EventController.addClickListener(sendBtnId, () => {
		const email = document.getElementById(emailFieldId).value;
		App._firebase.getAuth().sendPasswordResetEmail(email)
			.then(() => {
				App.router.navigate('/passwordSent');
			}).catch((error) => {
				console.log(error);
			});
	});

	// Handle backBtn
	EventController.addClickListener(backBtnId, () => {
		App.router.navigate('/login');
	});
};
