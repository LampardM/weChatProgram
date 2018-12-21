let _ = require('./lodash.min.js');
let moment = require( './moment');

let global = {
  _: _,
  moment: moment
}

module.exports = global;

