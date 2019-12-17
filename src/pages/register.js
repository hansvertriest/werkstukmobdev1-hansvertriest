import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';

const registerTemplate = require('../templates/register.hbs');

const pageScript = () => {
	/* DOM variables	*/
	const nameFieldId = 'nameField';
	const emailFieldId = 'emailField';
	const passwordFieldId = 'passwordField';
	const submitBtnId = 'submiBbtn';
	const googleBtnId = 'googleBtn';
	const errorContainerId = 'errorContainer';

	App.render(registerTemplate({
		nameFieldId,
		emailFieldId,
		passwordFieldId,
		submitBtnId,
		googleBtnId,
		errorContainerId,
	}));
	App.router.navigate('/register');

	/* Event listeners */

	// Submitting registration
	EventController.addClickListener(submitBtnId, () => {
		// const screenName = document.getElementById(nameFieldId);
		const email = document.getElementById(emailFieldId).value;
		const password = document.getElementById(passwordFieldId).value;
		App._firebase.getAuth().createUserWithEmailAndPassword(email, password)
			.then(() => {
				console.log('all went well!');
				App.router.navigate('/registerAvatar');
			})
			.catch((error) => {
				console.log(error.message);
				document.getElementById(errorContainerId).innerText = error.message;
			});
	});

	// Google authentication
	EventController.addClickListener(googleBtnId, () => {
		App._firebase.getAuth().signInWithPopup(App._firebase.getProvider())
			.then(() => {
				App.router.navigate('/registerAvatar');
			}).catch((error) => {
				console.log(error.message);
			});
	});
};

export default () => {
	/*
	clear all intervals
	*/
	Page.pageIntervals.forEach((interval) => clearInterval(interval));

	/*
	do checkups and start pageScript
	*/
	Page.checkLoggedIn()
		.then(() => {
			if (Page.checkAcces('/register')) {
				pageScript();
			} else {
				App.router.navigate('/home');
			}
		});
};
