import App from '../lib/App';

const passwordSentTemplate = require('../templates/passwordSent.hbs');

export default () => {
	const email = 'hans.vertriest@gmail.com';

	App.render(passwordSentTemplate({ email }));
	App.router.navigate('/passwordSent');
};
