import App from '../lib/App';

const connectionLostTemplate = require('../templates/connectionLost.hbs');

export default () => {
	const title = 'connectionLost automatic';

	App.render(connectionLostTemplate({ title }));
	App.router.navigate('/connectionLost');
};
