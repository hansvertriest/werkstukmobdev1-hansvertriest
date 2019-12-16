import App from '../lib/App';

const loseParasiteTemplate = require('../templates/loseParasite.hbs');

export default () => {
	const data = {
		astronautsInfected: 10,
	};
	const toGameBtnId = 'toGameBtn';

	App.render(loseParasiteTemplate({ data, toGameBtnId }));
	App.router.navigate('/loseParasite');
};
