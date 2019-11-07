import Handlebars from 'handlebars';

export default (page, text) => {
  const escapedPage = Handlebars.escapeExpression(page);
  const escapedText = Handlebars.escapeExpression(text);
  return text !== '' ? new Handlebars.SafeString(`<a href="/${escapedPage}" data-navigo>${escapedText}</a>`) : '';
};
