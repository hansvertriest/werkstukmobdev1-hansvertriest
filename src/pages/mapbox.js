/**
 * The Mapbox Page
 */

import Renderer from '../lib/core/Renderer';

const mapboxTemplate = require('../templates/mapbox.hbs');

export default () => {
  // set the title of this page
  const title = 'Mapbox';

  // render the template
  Renderer.render(mapboxTemplate({ title }));
};
