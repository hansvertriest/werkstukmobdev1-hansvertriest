import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';
import DataUploader from '../lib/DataUploader';

const registerTemplate = require('../templates/register.hbs');

const checkFormRequirements = (nameFieldId, errorContainerId) => {
	if (document.getElementById(nameFieldId).value === '') {
		document.getElementById(errorContainerId).innerText = 'Please choose a screen name!';
		return false;
	}
	return true;
};

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
		const screenName = document.getElementById(nameFieldId).value;
		const email = document.getElementById(emailFieldId).value;
		const password = document.getElementById(passwordFieldId).value;
		App._firebase.getAuth().createUserWithEmailAndPassword(email, password)
			.then(() => {
				console.log('all went well!');
				const userId = App.firebase.getAuth().currentUser.uid;
				DataUploader.addNewUser(userId, screenName);
				App.router.navigate('/registerAvatar');
			})
			.catch((error) => {
				console.log(error.message);
				document.getElementById(errorContainerId).innerText = error.message;
			});
	});

	// Google authentication
	EventController.addClickListener(googleBtnId, () => {
		if (checkFormRequirements(nameFieldId, errorContainerId)) {
			const screenName = document.getElementById(nameFieldId).value;
			App._firebase.getAuth().signInWithPopup(App._firebase.getProvider())
				.then(() => {
					const userId = App.firebase.getAuth().currentUser.uid;
					DataUploader.addNewUser(userId, screenName);
					App.router.navigate('/registerAvatar');
				}).catch((error) => {
					console.log(error.message);
				});
		}
	});
};

export default async () => {
	const currentPage = '/register';
	const init = await Page.initPage(currentPage);
	if (init === currentPage) {
		pageScript();
	}
};
