var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var JobSchema = new Schema({
    ref:  String,
    date: String,
    number: String,
    product:   String,
    style:   String,
    size:String,
    person:String,
    measurements:String,
    quantity : Number,
    printed : Number,
    cutting : Number,
    cutting_by:String,
    cutting_on:String,
    stitching : Number,
    stitching_by:String,
    stitching_on:String,
    packing : Number,
    packing_by:String,
    packing_on:String, 
    qc:Number,
    qc_by:String,
    qc_on:String,
    ready_to_deliver:Boolean,
    in_packing_list:Boolean,
    delivered : Number,
    delivery_by:String,
    delivery_on:String,
    starting_number : Number

  });

  module.exports = mongoose.model('job_slips',JobSchema);