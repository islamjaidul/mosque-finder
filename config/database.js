var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/qplex');
//mongoose.connect('mongodb://islamjaidul:Ind38maK@ds045464.mlab.com:45464/mosque_app');

module.exports = {mongoose};