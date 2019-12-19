import App from '../lib/App';
import EventController from '../lib/EventController';
import Page from '../lib/Page';

const registerAvatarTemplate = require('../templates/registerAvatar.hbs');

const pageScript = () => {
	/* Page data */
	const avatars = ['astro1', 'astro2'];
	let avatarIndex = 0;

	/* DOM variables	*/
	let avatar = avatars[avatarIndex];
	const chooseBtnId = 'chooseBtn';
	const goLeftBtnId = 'goLeftBtn';
	const goRightBtnId = 'geRightBtn';

	Page.checkAcces('/registerAvatar');
	App.render(registerAvatarTemplate({
		avatar,
		chooseBtnId,
		goLeftBtnId,
		goRightBtnId,
	}));
	App.router.navigate('/registerAvatar');

	/* Event listeners */

	EventController.addClickListener(goLeftBtnId, () => {
		avatarIndex = (avatarIndex === 0) ? avatars.length - 1 : avatarIndex - 1;
		avatar = avatars[avatarIndex];
		document.getElementById('avatarDiv').style.backgroundImage = `url(../../assets/images/avatar/${avatar}_128.png)`;
	});

	EventController.addClickListener(goRightBtnId, () => {
		avatarIndex = (avatarIndex + 1 === avatars.length) ? 0 : avatarIndex + 1;
		avatar = avatars[avatarIndex];
		document.getElementById('avatarDiv').style.backgroundImage = `url(../../assets/images/avatar/${avatar}_128.png)`;
	});

	// Register avatar
	EventController.addClickListener(chooseBtnId, () => {
		// Add to database
		const userUID = App.firebase.getAuth().currentUser.uid;
		App.firebase.db.collection('users').doc(userUID).set({
			avatar,
		}, { merge: true })
			.catch((e) => {
				console.log(e);
			});
		App.router.navigate('/home');
	});
};

export default () => {
	Page.checkAcces('/login')
		.then((resp) => {
			if (resp) {
				pageScript();
			} else {
				App.router.navigate('/home');
			}
		});
};
