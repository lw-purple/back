'use strict';
import UserModel from '../../models/v1/user'
import UserInfoModel from '../../models/v1/userInfo'
import config from 'config';
import jwt from 'jsonwebtoken';
import formidable from 'formidable';
import crypto from 'crypto';
import dtime from 'time-formater';
class User {
    constructor() {
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.encryption = this.encryption.bind(this);
    }
    async login(req, res, next) {
        console.log(req.headers.token)
        UserInfoModel.findOne({token:req.headers.token},function(err,user){
            console.log(user)
        })
    }
    async register(req, res, next) {
        const username = req.body.username;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const password = this.encryption( req.body.password);

        if(!username){
            throw new Error('用户名参数错误');
        }else if(!password){
            throw new Error('密码参数错误');
        }else if(req.body.password !== req.body.password_){
            throw new Error('确认密码错误错误');
        }else if(!email){
            throw new Error('密码参数错误');
        }

        UserInfoModel.findOne({username}, function (err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    res.json({
                        type: false,
                        data: "用户已经存在"
                    });
                } else {
                    var userInfoModel = new UserInfoModel();
                    const registe_time = dtime().format('YYYY-MM-DD HH:mm');
                    userInfoModel.username = username;
                    userInfoModel.email = email;
                    userInfoModel.mobile = mobile;
                    userInfoModel.password = password;
                    userInfoModel.registe_time = registe_time;
                    userInfoModel.save(function (err, user) {
                        user.token = jwt.sign(user, config.JWT_SECRET);
                        user.save(function (err, user1) {
                            res.json({
                                type: true,
                                token: user1.token
                            });
                        });
                    })
                }
            }
        });
    }


    encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	}
	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	}
}
export default new User()