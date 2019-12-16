import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';

const loginTemplate = require('../templates/login.hbs');

export default () => {
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
	Page.checkAcces('/login');

	/* Event listeners */
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
	EventController.addClickListener(googleBtnId, () => {
		App._firebase.getAuth().signInWithPopup(App._firebase.getProvider())
			.then(() => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				// var token = result.credential.accessToken;
				// The signed-in user info.
				// var user = result.user;
				// ...
				App.router.navigate('/home');
			}).catch((error) => {
				// Handle Errors here.
				// var errorCode = error.code;
				// var errorMessage = error.message;
				// The email of the user's account used.
				// var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				// var credential = error.credential;
				// ...
				console.log(error.message);
			});
	});
};
