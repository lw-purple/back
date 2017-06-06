import express from 'express';
import bodyParser from 'body-parser';
import config from 'config';
import jwt from 'jsonwebtoken';

// import router from './routes/index.js';
import User from './models/v1/user'
import db from './mongodb/db.js';
const  app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// router(app);

app.post('/signin', function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        console.log(err,user)
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            }); 
        } else { 
            if (user) {
                res.json({ 
                    type: false,
                    data: "User already exists!"
                });  
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password; 
                 console.log(userModel)
                userModel.save(function(err, user) {
                    console.log(user)
                    user.token = jwt.sign(user,'secret');
                    console.log(user.token)
                    user.save(function(err, user1) {
                        res.json({ 
                            type: true, 
                            data: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
});

app.listen(3000,()=>{
    console.log('Running...')
})