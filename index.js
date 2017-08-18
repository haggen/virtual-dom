function h(spec, properties, ...children) {
  for (let i = 0, l = children.length; i < l; i++) {
    if (Array.isArray(children[i])) {
      children = children.concat(children[i]);
      children.splice(i, 1);
      i--;
      l--;
    }
  }
  properties = properties || {};
  return { spec, properties, children };
}

function isNodeSpec(node) {
  return typeof node === 'object' && node.hasOwnProperty('spec');
}

function isTextNode(node) {
  return !isNodeSpec(node);
}

function createElement(node) {
  let element;
  if (isNodeSpec(node)) {
    element = document.createElement(node.spec);
    setProperties(element, node.properties);
    appendChildren(element, node.children);
  } else {
    element = document.createTextNode(node);
  }
  return element;
}

function updateElement(element, newNode, oldNode) {;
  if (isTextNode(newNode) || isTextNode(oldNode)) {
    if (newNode != oldNode) {
      replaceElement(element, createElement(newNode));
    }
  } else if (newNode.spec != oldNode.spec) {
    replaceElement(element, createElement(newNode));
  } else {
    updateProperties(element, newNode.properties, oldNode.properties);
    updateChildren(element, newNode.children, oldNode.children);
  }
}

function replaceElement(a, b) {
  a.replaceWith(b);
}

function setProperties(element, properties) {
  for (let name in properties) {
    if (properties.hasOwnProperty(name)) {
      setProperty(element, name, properties[name]);
    }
  }
}

function setProperty(element, name, value) {
  if (name.indexOf('on') === 0 && typeof value === 'function') {
    element.addEventListener(name.substr(2).toLowerCase(), value);
  } else {
    element.setAttribute(name, value);
    if (element.hasOwnProperty(name)) {
      element[name] = value;
    }
  }
}

function updateProperties(element, newProperties, oldProperties) {
  const allProperties = Object.keys(Object.assign({}, newProperties, oldProperties));
  for (let i = 0, l = allProperties.length; i < l; i++) {
    const name = allProperties[i];
    if (newProperties.hasOwnProperty(name)) {
      if (oldProperties.hasOwnProperty(name)) {
        updateProperty(element, name, newProperties[name], oldProperties[name]);
      } else {
        setProperty(element, name, newProperties[name]);
      }
    } else if (oldProperties.hasOwnProperty(name)) {
      removeProperty(element, name, oldProperties[name]);
    }
  }
}

function updateProperty(element, name, newValue, oldValue) {
  if (newValue != oldValue) {
    if (name.indexOf('on') === 0 && typeof oldValue === 'function') {
      removeProperty(element, name, oldValue);
    }
    setProperty(element, name, newValue);
  }
}

function removeProperty(element, name, value) {
  if (name.indexOf('on') === 0 && typeof value === 'function') {
    element.removeEventListener(name.substr(2).toLowerCase(), value);
  } else {
    element.removeAttribute(name);
    if (element.hasOwnProperty(name)) {
      element[name] = null;
    }
  }
}

function appendChildren(parent, children) {
  for (let i = 0, l = children.length; i < l; i++) {
    appendChild(parent, children[i]);
  }
}

function appendChild(parent, child) {
  parent.appendChild(createElement(child));
}

function updateChildren(parent, newChildren, oldChildren) {
  for (let i = 0; true; i++) {
    if (i < newChildren.length) {
      if (i < oldChildren.length) {
        updateElement(parent.childNodes[i], newChildren[i], oldChildren[i]);
      } else {
        appendChild(parent, newChildren[i]);
      }
    } else if (i < oldChildren.length) {
      removeChild(parent, i);
    } else {
      break;
    }
  }
}

function removeChild(parent, index) {
  parent.childNodes[index].remove();
}
