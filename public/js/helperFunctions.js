//helper functions
const checkImportScript = function checkImportScript(scriptSrc, onLoadHandler) {
  //check if script is referenced in document
  //if not, import script
  if(!document.querySelector(`script[src='${scriptSrc}']`)) {
    const newScript = document.createElement('script');
    if (onLoadHandler) {newScript.onload = onLoadHandler};
    newScript.type = `text/javascript`;
    newScript.src = scriptSrc;
    document.head.appendChild(newScript);
  }
}

const getDescendantProp = function getDescendantProp(model, desc) {
  //Get a descendant property of an object; c in {a:{b:{c:'f'}}}
  let propArray = desc.split('.');
  let obj = Object.assign({}, model[propArray.shift()]);
  while (propArray.length) {
    obj = obj[propArray.shift()];
  }
  return obj;
}

const getTemplateString = function getTemplateString(templateUrl, callback) {
  //read html file as DOMstring
  const req = new XMLHttpRequest();
  req.onload = () => {
    return callback(req.responseText);
  }
  req.open('GET', templateUrl, true);
  req.send();
}

const compileDomString = function compileDomString(responseText, model) {
  //model is an Object that contains value(s) for the template placeholders
  //Replace placeholders with their respective values
  const regex = /:(\w+)/gi;
  return responseText.replace(regex, (match, p, offset, string) => {
    return (/\w+\.\w+/.test(p))?getDescendantProp(model, p) : model[p];
  });
}

const updateView = function updateView(view, template, templateUrl, model) {
  //Take a view(an element) and update it with another specified view.
  if (templateUrl) {
    getTemplateString(templateUrl, (templateString) => {
      const domString = (templateString.includes(':') && model)?compileDomString(templateString, model):templateString;
      view.innerHTML = domString;
    });
  }
  else {
    const domString = (template.includes(':') && model)?compileDomString(template, model):template;
    view.innerHTML = domString;
  }
}
