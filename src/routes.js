// import the router
import Router from './lib/core/Router';

// import pages
import HomePage from './pages/home';
import FirebasePage from './pages/firebase';
import MapboxPage from './pages/mapbox';

/**
 * Init the router
 */
const initRoutes = () => {
  // init the router
  Router.init(window.location.origin);

  // add routes
  Router.addRoute('/home', HomePage);
  Router.addRoute('/firebase', FirebasePage);
  Router.addRoute('/mapbox', MapboxPage);
  // TODO add new or edit existing routes here
};

/**
 * Navigate to a specific page
 *
 * @param {string} page The page to navigate to
 */
const navigate = (page) => {
  Router.navigate(page);
};

export { initRoutes, navigate };
