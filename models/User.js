const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		googleId: {
			type: String,
			required: true,
		},
		displayName: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		image: {
			type: String,
		},
	},
	{ timestamps: true },
);

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
