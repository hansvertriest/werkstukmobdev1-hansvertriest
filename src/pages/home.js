/**
 * The Home Page
 */

import Renderer from '../lib/core/Renderer';

const homeTemplate = require('../templates/home.hbs');

export default () => {
  // set the title of this page
  const title = 'Mijn homepagina!';

  // render the template
  Renderer.render(homeTemplate({ title }));
};
