import App from '../lib/App';

const winPlagueTemplate = require('../templates/winPlague.hbs');

export default () => {
	const data = {
		timeLasted: '10',
	};
	const toGameBtnId = 'toGameBtn';

	App.render(winPlagueTemplate({ data, toGameBtnId }));
	App.router.navigate('/winPlague');
};
