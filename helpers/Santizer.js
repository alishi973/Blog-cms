module.exports = (postData) => {
  for (let propName in postData) {
    if (postData[propName].length < 1) delete postData[propName];
    else postData[propName];
  }
  return postData;
};
