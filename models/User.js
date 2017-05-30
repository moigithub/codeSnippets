import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema({
	email: { 
		type: String,
		unique: true,
		lowercase : true,
		trim: true
	},
	password: String,
	displayName: String,
	isAdmin: Boolean
});

export default mongoose.model('User', UserSchema);