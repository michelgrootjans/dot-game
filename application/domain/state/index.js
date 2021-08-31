const fs = require('fs');
const path = require("path");

const initialState = () => {
  let rawdata = fs.readFileSync(path.join(__dirname, 'initial-state.json'));
  return JSON.parse(rawdata);
}

module.exports = {initialState}