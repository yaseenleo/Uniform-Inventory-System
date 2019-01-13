var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var GR_NoteSchema = new Schema({
    po_ref:  String,
    invoice_num: String,
    date:String,
    recieved_by:String,
    items_list:String,
    vendor : String,
    payment : String
  });

  module.exports = mongoose.model('gr_notes',GR_NoteSchema);