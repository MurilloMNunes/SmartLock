const mongoose = require('mongoose');

const TrancaSchema = new mongoose.Schema({
  nome: String,
  ownerEmail: String,
  isOpen: { type: Boolean, default: false },
  isDoorOpen: { type: Boolean, default: false },
  serial_num: String,
  password: String
});

module.exports = mongoose.model('Tranca', TrancaSchema);
