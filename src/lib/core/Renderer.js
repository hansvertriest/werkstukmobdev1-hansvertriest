/**
 * The Renderer for our HTML
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import Router from './Router';

class Renderer {
  static init(element) {
    this.element = element;
  }

  static render(html) {
    this.element.innerHTML = html;
    Router.updatePageLinks();
  }
}

export default Renderer;
