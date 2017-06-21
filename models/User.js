import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// define the schema for our user model
var userSchema = mongoose.Schema({
		email: { 
			type: String,
		//	unique: true,
			lowercase : true,
			trim: true
		},
        password     : String,  //for local only
        name         : String,
        provider     : String,  // twitter, google, fb, etc
        id           : String,
        token        : String,

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
export default mongoose.model('User', userSchema);
