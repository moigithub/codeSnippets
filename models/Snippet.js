import mongoose from 'mongoose';

var SnippetSchema = new mongoose.Schema({
	title: String,
	description: String,
	language : String,
	code: String,
	tags : [String],
	links: [String],
	postedBy : {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	date : {
		type: Date,
		default: Date.now
	}
});

export default mongoose.model('Snippet', SnippetSchema);