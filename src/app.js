import './styles/styles.scss';

import { initRoutes, navigate } from './routes';
import Renderer from './lib/core/Renderer';

window.addEventListener('load', () => {
  // create a DOM element for our renderer
  const app = document.createElement('div');
  app.setAttribute('id', 'app');
  document.body.appendChild(app);

  // init the renderer
  Renderer.init(app);

  // initialize routes
  initRoutes();

  // navigate to the first page
  navigate('/home');
});
