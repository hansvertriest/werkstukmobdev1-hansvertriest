import App from '../lib/App';

const gameStartTemplate = require('../templates/gameStart.hbs');

export default () => {
	const title = 'gameStart automatic';

	App.render(gameStartTemplate({ title }));
	App.router.navigate('/gameStart');
};
