/**
 * The About Page
 */

import Renderer from '../lib/core/Renderer';

const aboutTemplate = require('../templates/about.hbs');

export default () => {
  // set the title of this page
  const title = 'Mijn aboutpagina!';

  // render the template
  Renderer.render(aboutTemplate({ title }));
};
