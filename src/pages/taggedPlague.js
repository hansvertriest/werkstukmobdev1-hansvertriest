import App from '../lib/App';

const taggedPlagueTemplate = require('../templates/taggedPlague.hbs');

export default () => {
	const data = {
		timeLasted: 8,
	};
	const toGameBtnId = 'toGameBtn';

	App.render(taggedPlagueTemplate({ data, toGameBtnId }));
	App.router.navigate('/taggedPlague');
};
