import '../styles/main.css';

const helloWorld = () => {
  // get our app container
  const app = document.getElementById('app');

  // create a new DOM element
  const element = document.createElement('div');
  element.innerHTML = 'Hello World!';

  // add to our app container
  app.appendChild(element);
};

// start hellWorld app
helloWorld();
