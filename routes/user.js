const express = require('express');
const UserController = require('../controllers/user');

// Api Router
const api = express.Router();


// User's routing
api.post('/sign-up', UserController.signUp);
api.post('/sign-in', UserController.signIn);




// Export api
module.exports = api;



