
/**
 * The main App
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import Router from './core/Router';
import Renderer from './core/Renderer';
import FireBase from './core/FireBase';

class App {
  static initCore({ mainUrl, hash, element }) {
    this.router = new Router(mainUrl, hash);
    this.renderer = new Renderer(element, this.router);
  }

  static initFireBase({ apiKey, projectId, messagingSenderId }) {
    this.firebase = new FireBase(apiKey, projectId, messagingSenderId);
  }

  get router() {
    return this.router;
  }

  get renderer() {
    return this.renderer;
  }

  get firebase() {
    if (!this.firebase) throw new Error('Firebase was not initialized!');
    return this.firebase;
  }

  static render(html) {
    if (!this.renderer) throw new Error('The App Core was not initialized!');
    this.renderer.render(html);
  }
}

export default App;
