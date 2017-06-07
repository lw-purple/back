'use strict';
import UserModel from '../../models/v1/user'
import UserInfoModel from '../../models/v1/userInfo'
import config from 'config';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dtime from 'time-formater';
class User {
    constructor() {
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.encryption = this.encryption.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }
    // 登陆
    async login(req, res, next) {
        const newpassword = this.encryption(req.body.password)
        UserModel.findOne({ token: req.headers.token }, function (err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else if (user) {
                if (user.username !== req.body.username) {
                    res.json({
                        type: false,
                        data: "用户名错误 "
                    });
                    return
                } else if (user.password !== newpassword) {
                    res.json({
                        type: false,
                        data: "密码错误 "
                    });
                    return
                }
                res.json({
                    type: true,
                    data: user
                });
            } else if (!user) {
                throw new Error('此账号数据出错')
            }
        })
    }
    // 注册
    async register(req, res, next) {
        const username = req.body.username;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const password = this.encryption(req.body.password);

        if (!username) {
            throw new Error('用户名参数错误');
        } else if (!password) {
            throw new Error('密码参数错误');
        } else if (req.body.password !== req.body.password_) {
            throw new Error('确认密码错误错误');
        } else if (!email) {
            throw new Error('密码参数错误');
        }

        UserModel.findOne({ username }, function (err, user) {
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
                    // userInfoModel.password = password;
                    userInfoModel.registe_time = registe_time;

                    userInfoModel.save(function (err, user) {
                        user.token = jwt.sign(user, config.JWT_SECRET);
                        user.save(function (err, user1) {
                            res.json({
                                type: true,
                                token: user1.token
                            });
                        });
                    }).then((user) => {
                        user.token = jwt.sign(user, config.JWT_SECRET);
                        const newUser = { username, password, token: user.token };
                        UserModel.create(newUser);
                    })


                }
            }
        });
    }
    // 修改个人信息
    async changePassword(req, res, next) {
        const { username, password, password_ } = req.body
        try {
            if (!username) {
                throw new Error('用户名参数错误');
            } else if (!password) {
                throw new Error('必须填写新密码');
            } else if (!password_) {
                throw new Error('必须填写确认密码');
            } else if (password !== password_) {
                throw new Error('两次密码不一致');
            } 
        } catch (err) {
            console.log('修改密码参数错误', err);
            res.send({
                status: 0,
                type: 'ERROR_QUERY',
                message: err.message,
            })
            return
        }
       
        try{
				const user = await UserModel.findOne({username});
				if (!user) {
					res.send({
						status: 0,
						type: 'USER_NOT_FOUND',
						message: '未找到当前用户',
					})
				}else{
					user.password = this.encryption(password);
					user.save();
					res.send({
						status: 1,
						success: '密码修改成功',
					})
				}
			}catch(err){
				console.log('修改密码失败', err);
				res.send({
					status: 0,
					type: 'ERROR_CHANGE_PASSWORD',
					message: '修改密码失败',
				})
			}
    }

    encryption(password) {
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword
    }
    Md5(password) {
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }
}
export default new User()