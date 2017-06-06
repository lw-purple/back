'use strict';
import express from 'express';

const router = express.Router();
router.post('/login',User.login)