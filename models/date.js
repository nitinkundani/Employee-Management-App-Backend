var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable

var DateSchema = new Schema({
    id: { type: String, required: true, unique: true },
    date: { type: Date, required: true }
    
});

const DateObj = module.exports = mongoose.model('DateObj', DateSchema);