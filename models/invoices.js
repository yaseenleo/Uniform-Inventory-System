var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var InvoiceSchema = new Schema({
    lpo_ref:  String,
    number: String,
    items_list:String,
    date:String,
    ref:String,
    company:String

  });

  module.exports = mongoose.model('invoices',InvoiceSchema);