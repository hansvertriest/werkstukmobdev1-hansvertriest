import App from './App';
import Player from './Player';
import Backend from './Backend';

class Page {
	constructor() {
		this.currentPage = undefined;
		this.lastPage = '/home';
		this.modelIsLoaded = false;
		this.createListeners = [];
		this.gameListeners = [];
		this.gameIntervals = [];
	}

	/**
	 * @description logs the error and reroutes to lostconnection
	 * @param {*} e error
	 */
	handleError(e) {
		console.log(e);
		App.router.navigate('./lostConnection');
	}

	/**
	 * @description sets the lastPage value to the currentPage and updates the currentPage
	 * @param {*} page name of page that's now displayed
	 */
	setCurrentPage(page) {
		this.lastPage = this.currentPage;
		this.currentPage = page;
	}

	/**
	 * @description resets the player and crew parameters
	 */
	resetModel() {
		Player.resetParams();
		Player.crew.resetParams();
		this.modelIsLoaded = false;
	}

	changeInnerText(elementId, innerText) {
		document.getElementById(elementId).innerText = innerText;
	}

	async checkGeolocation() {
		return new Promise((resolve) => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(() => {
					resolve();
				});
			} else {
				console.log('no geo');
			}
		});
	}

	/**
	 * @description checks if playerInfo exists (else the player get's signed out)
	 *  and then sets the parameters of the player
	 */
	async loadModel() {
		// Get user id
		Player.userId = await App.firebase.getAuth().currentUser.uid;
		// Load player info
		const docPlayer = await App.firebase.db.collection('users').doc(Player.userId).get();
		if (docPlayer.exists) {
			const playerInfo = docPlayer.data();
			Player.setParams(
				Player.userId,
				playerInfo.screenName,
				playerInfo.avatar,
			);
			const crewCode = (playerInfo.crewCode === undefined) ? '' : playerInfo.crewCode;
			Player.crew.setCrewCode(crewCode);
			// Check if player is moderator
			if (Player.crew.crewCode !== '') {
				const docCrewCode = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).get();
				if (docCrewCode.exists && docCrewCode.data().moderator === Player.userId) {
					Player.crew.setPlayerModerator(true);
				}
			}
		} else {
			App._firebase.getAuth().signOut().then(() => {
				console.log('User was not found in db');
				App.router.navigate('/login');
			}, (error) => {
				console.log(error);
			});
		}
		// Load crewInfo
		if (Player.crew.crewCode !== '') {
			const docCrew = await App.firebase.db.collection('crews').doc(Player.crew.crewCode).get();
			if (docCrew.exists) {
				const crewInfo = docCrew.data();
				const isModerator = (crewInfo.moderator === Player.userId);
				Player.crew.loadCrew(Player.crew.crewCode, isModerator, crewInfo.members);
			}
		}
		this.modelIsLoaded = true;
	}

	/**
	 * @description check if model is loaded, if signed in => loads model, reroutes if necessary
	 * @param {*} page current page
	 */
	async initPage(page) {
		console.log(`Routed to ${page}`);
		// clear listeners
		this.createListeners.forEach((listener) => {
			listener();
		});
		Backend.listeners.forEach((listener) => {
			listener();
		});
		this.gameListeners.forEach((listener) => {
			listener();
		});
		this.gameIntervals.forEach((interval) => {
			clearInterval(interval);
		});

		// check if player has been loaded
		if (!this.modelIsLoaded) {
			// check if player is logged in
			const isLoggedIn = await new Promise((resolve) => {
				App.firebase.getAuth().onAuthStateChanged(async (user) => {
					if (user) {
						console.log(`Logged in user: ${App._firebase.getAuth().currentUser.email}`);
						resolve(true);
					} else {
						console.log('Logged in user: NONE');
						Player.resetParams();
						resolve(false);
					}
				});
			});

			if (isLoggedIn === true) {
				await this.loadModel();
				return page;
			} if (page !== '/register' && page !== '/login' && page !== '/registerAvatar') {
				return '/login';
			}
		}
		// if page = bakcend
		const backendPages = ['/backCrewList', '/backCrewDetail'];
		if (backendPages.includes(page) && Player.userId === 'QDSWJu9rahSu5j1na9TpcmiHkMy1') {
			return page;
		} else if (backendPages.includes(page)) {
			Backend.listeners.forEach((interval) => {
				clearInterval(interval);
			});
			return '/permissionDenied';
		}
		// if page =  player is not yet in a crew
		const crewOnlyPages = ['/crewOverview', '/game'];
		if (crewOnlyPages.includes(page) && Player.crew.crewCode === '') {
			return '/home';
		}
		// if page = crewOverview but player is a moderator
		if (page === '/crewOverview' && Player.crew.playerIsModerator()) {
			return '/createOverview';
		}
		// if page = a login/registerPage
		const signUpPages = ['/login', '/register', '/registerAvatar'];
		if (signUpPages.includes(page) && Player.crew.crewCode !== '') {
			return '/home';
		}
		// if page = join but player is already in a crew
		if (page === '/join' && Player.crew.crewCode !== '') {
			if (Player.crew.playerIsModerator()) {
				return page;
			}
			return '/crewOverview';
		}
		return page;
	}
}

export default new Page();
