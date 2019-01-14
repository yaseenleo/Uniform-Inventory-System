var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var InfoSchema = new Schema({
    last_number:  Number,
    po_num:Number,
    invoice_num:Number,
    sales_terms:String,
    purchase_terms:String
    
  });

  module.exports = mongoose.model('infos',InfoSchema);