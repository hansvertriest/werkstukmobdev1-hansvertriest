import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';

const loginTemplate = require('../templates/login.hbs');

const pageScript = () => {
	/* DOM variables	*/
	const emailFieldId = 'emailField';
	const passwordFieldId = 'passwordField';
	const submitBtnId = 'submitBtn';
	const googleBtnId = 'googleBtn';
	const errorContainerId = 'errorContainer';

	App.render(loginTemplate({
		emailFieldId,
		passwordFieldId,
		submitBtnId,
		googleBtnId,
		errorContainerId,
	}));
	App.router.navigate('/login');

	/* Event listeners */
	// login
	EventController.addClickListener(submitBtnId, () => {
		const email = document.getElementById(emailFieldId).value;
		const password = document.getElementById(passwordFieldId).value;
		App._firebase.getAuth().signInWithEmailAndPassword(email, password)
			.then(() => {
				App.router.navigate('/home');
			})
			.catch((error) => {
				console.log(error.message);
				document.getElementById(errorContainerId).innerText = error.message;
			});
	});

	// google btn
	EventController.addClickListener(googleBtnId, () => {
		App._firebase.getAuth().signInWithPopup(App._firebase.getProvider())
			.then(() => {
				App.router.navigate('/home');
			}).catch((error) => {
				console.log(error.message);
			});
	});
};

export default async () => {
	/*
	do checkups and start pageScript
	*/
	const auth = await Page.checkAcces('/login');
	if (auth === true) {
		pageScript();
	} else if (typeof auth === 'string') {
		App.router.navigate(auth);
	} else {
		App.router.navigate('/home');
	}
};
