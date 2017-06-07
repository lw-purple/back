'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
	token: String,
	email: String,
	password: String,
})

const UserModel = mongoose.model('User', userSchema);

export default UserModel