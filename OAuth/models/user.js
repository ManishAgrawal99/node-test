var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

//The fields of username & password will be automatically added in to the schema model
var User = new Schema({
    firstname: {
        type: String,
        default:''
    },
    lastname: {
        type: String,
        default:''
    },
    //The facebookId will store the fb Id of the user that has passed in the access token
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);