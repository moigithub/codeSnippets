import mongoose from 'mongoose';

var SnippetSchema = new mongoose.Schema({
	Language : String,
	Description: String,
	Code: String,
	Tags : [String],
	Links: [String],
	PostedBy : {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	Date : {
		type: Date,
		default: Date.now
	}
});

export default mongoose.model('Snippet', SnippetSchema);