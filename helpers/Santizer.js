module.exports = {
  santize: (object) => {
    for (let propName in object) {
      if (object[propName].length < 1) delete object[propName];
      else object[propName];
    }
    return object;
  },
  santizeExclude: (object, excluded) => {
    for (let propName in object) {
      let element = object[propName];
      if (element.length < 1 && excluded.indexOf(element) == -1) delete element;
      else element;
    }
    return object;
  },
};
