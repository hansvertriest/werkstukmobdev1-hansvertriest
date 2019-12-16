import App from '../lib/App';

const taggedParasiteTemplate = require('../templates/taggedParasite.hbs');

export default () => {
	const data = {
		timeLasted: 8,
	};
	const toGameBtnId = 'toGameBtn';

	App.render(taggedParasiteTemplate({ data, toGameBtnId }));
	App.router.navigate('/taggedParasite');
};
