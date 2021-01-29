const mongoose = require('mongoose');
/**
 * File Schema
 * @private
 */
const hairdresserSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  email: {
    type: String,
  },
  lastname: {
    type: String,
  },
  firstname: {
    type: String,
  },
  gender: {
    type: String,
  },
  socketId: {
    type: String,
    default:null
  },
});

module.exports = mongoose.model('Hairdresser', hairdresserSchema);
