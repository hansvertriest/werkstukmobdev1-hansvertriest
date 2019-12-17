import App from './App';
import Player from './Player';
import DataSeeder from './DataSeeder';

class Page {
	constructor() {
		this.currentPage = undefined;
		this.loggedIn = false;
		this.intervals = [];
	}

	checkLoggedIn() {
		return new Promise((resolve) => {
			App._firebase.getAuth().onAuthStateChanged((user) => {
				if (user) {
					this.loggedIn = true;
					console.log(`Logged in user: ${App._firebase.getAuth().currentUser.email}`);
					// add DBlistener for playerParams
					DataSeeder.seedPlayer();
					resolve();
				} else {
					this.loggedIn = false;
					console.log('Logged in user: NONE');
					// reset player
					Player.resetParams();
					resolve();
				}
			});
		});
	}

	/* Checks if user should be on/has access to current page and reroutes */
	checkAcces(page) {
		this.currentPage = page;
		if (this.loggedIn === false) {
			if (page === '/register' || page === '/registerAvatar' || page === '/login') {
				return true;
			}
		} else {
			if (page === '/register' || page === '/registerAvatar' || page === '/login') {
				return false;
			}
			return true;
		}
		return false;
	}
}

export default new Page();
