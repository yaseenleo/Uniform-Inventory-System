var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var PoSchema = new Schema({
    date: String,
    p_date:String,
    lpo_number:   String,
    ref: String,
    flag:String,
    vendor:  String,
    purchase_array :String,
    recieved_array:String,
    po_num: String,
    total:String

  });

  module.exports = mongoose.model('pos',PoSchema);