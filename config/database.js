var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/MosqueApp');
mongoose.connect('mongodb://islamjaidul:Ind38maK@ds045464.mlab.com:45464/mosque_app');

module.exports = {mongoose};