/**
 * The Router, based on Navigo Routing
 * docs: https://github.com/krasimir/navigo
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import Navigo from 'navigo';

class Router {
  constructor(mainUrl, hash) {
    this.router = new Navigo(mainUrl, true, hash);
  }

  addRoute(path, f, hooks = {}) {
    if (this.router) this.router.on(path, f, hooks).resolve();
  }

  navigate(l) {
    if (this.router) this.router.navigate(l);
  }

  updatePageLinks() {
    if (this.router) this.router.updatePageLinks();
  }
}

export default Router;
