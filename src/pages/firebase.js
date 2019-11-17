/**
 * The Firebase Page
 */

import Renderer from '../lib/core/Renderer';

const firebaseTemplate = require('../templates/firebase.hbs');

export default () => {
  // set the title of this page
  const title = 'Firebase';

  // render the template
  Renderer.render(firebaseTemplate({ title }));
};
