'use strict';
import express from 'express';
import User from '../controller/v1/user'
const router = express.Router();
router.post('/login',User.login)
router.post('/register',User.register)
router.post('/changePassword',User.changePassword)

export default router