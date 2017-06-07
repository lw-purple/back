'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
	id: Number,
    username: String,
	// password: String,
	email: {type: String, default: ''},
    mobile: {type: String, default: ''},
    registe_time: String,
    change_time:String
})
userInfoSchema.index({id: 1});


const UserInfoModel = mongoose.model('UserInfo', userInfoSchema);

export default UserInfoModel;