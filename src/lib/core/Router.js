/**
 * The Router, based on Navigo Routing
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import Navigo from 'navigo';

class Router {
  static init(mainUrl) {
    this.router = new Navigo(mainUrl, true, '#!');
  }

  static addRoute(path, f, hooks = {}) {
    this.router.on(path, f, hooks).resolve();
  }

  static navigate(l) {
    this.router.navigate(l);
  }

  static updatePageLinks() {
    this.router.updatePageLinks();
  }
}

export default Router;
