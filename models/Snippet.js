import mongoose from 'mongoose';

var SnippetSchema = new mongoose.Schema({
	language : String,
	description: String,
	title: String,
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