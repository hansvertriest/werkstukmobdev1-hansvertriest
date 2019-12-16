import App from '../lib/App';

const winParasiteTemplate = require('../templates/winParasite.hbs');

export default () => {
	const data = {
		timeLasted: '10',
	};
	const toGameBtnId = 'toGameBtn';

	App.render(winParasiteTemplate({ data, toGameBtnId }));
	App.router.navigate('/winParasite');
};
