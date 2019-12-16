import App from './App';
import Crew from './Crew';

class Page {
	constructor() {
		this.currentPage = undefined;
	}

	/* Checks if user should be on/has access to current page and reroutes */
	async checkAcces(page) {
		this.currentPage = page;
		const user = App._firebase.getAuth().currentUser;
		if (user) {
			console.log(`Logged in user: ${App._firebase.getAuth().currentUser.email}`);
			if (page === '/login' || page === '/register') {
				App.router.navigate('/home');
			}
		} else {
			console.log(user);
			console.log('Logged in user: NONE');
			if (page !== '/login' && page !== '/register' && page !== '/registerAvatar') {
				App.router.navigate('/login');
			}
		}

		// check if player is in a crew
		if (page === '/crewOverview') {
			if (Crew.crewCode === undefined) {
				App.router.navigate('/home');
			}
		}
	}
}

export default new Page();
