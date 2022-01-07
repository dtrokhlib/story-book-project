const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			default: 'public',
			enum: ['public', 'private'],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
		},
	},
	{ timestamps: true },
);

const StoryModel = mongoose.model('Story', StorySchema);

module.exports = StoryModel;
