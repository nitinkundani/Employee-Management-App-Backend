
var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable



// User Mongoose Schema
var UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    role: {type: String, required: true}, 
    //dob: {type: Date, required: true}
});


const User = module.exports = mongoose.model('User', UserSchema);
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback){
    const query = {email: email};
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    newUser.save(callback);
}

module.exports.updateUserByUsername = function(updatedUser, callback){
    const query = {username: updatedUser.username};
    User.updateOne(query, {User: updatedUser}, callback);
}

module.exports.deleteUserByUsername = function(username, callback){
    const query = {username: username};
    User.deleteOne (query, callback);
}

module.exports.comparePassword = function(candidatePassword, actualPassword, callback){
        //if(err) throw err;
        callback(null, candidatePassword === actualPassword);
}

/* module.exports.checkUserFieldForBlank= function(user, res){
    if(user.username == " " || user.password == " " || user.role == " " || user.name == " ")
    {
        return res.status(400).json({msg: 'The input fields should not be blank.'});
    }
} */

