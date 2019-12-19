import App from './App';
import Player from './Player';
import Crew from './Crew';

class Page {
	constructor() {
		this.currentPage = undefined;
		this.lastPage = '/home';
		this.loggedIn = false;
		this.pageIntervals = [];
	}

	setCurrentPage(page) {
		this.lastPage = this.currentPage;
		this.currentPage = page;
	}

	checkLoggedIn() {
		return new Promise((resolve) => {
			App._firebase.getAuth().onAuthStateChanged((user) => {
				if (user) {
					Player.userId = App.firebase.getAuth().currentUser.uid;
					this.loggedIn = true;
					console.log(`Logged in user: ${App._firebase.getAuth().currentUser.email}`);
					resolve(true);
				} else {
					this.loggedIn = false;
					console.log('Logged in user: NONE');
					// reset player
					Player.resetParams();
					resolve(false);
				}
			});
		});
	}

	/* Checks if user should be on/has access to current page and reroutes */
	checkAcces(page) {
		return new Promise((resolve) => {
			this.checkLoggedIn()
				.then((resp) => {
					if (resp) {
						if (page === '/register' || page === '/registerAvatar' || page === '/login') {
							resolve(false);
						} else if (page === '/crewOverview' && Crew.crewCode === '') {
							resolve('/home');
						}
						resolve(true);
					} else {
						if (page === '/register' || page === '/registerAvatar' || page === '/login') {
							resolve(true);
						}
						resolve(false);
					}
					resolve(false);
				});
		});
	}
}

export default new Page();
