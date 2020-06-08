const express = require("express");
const NewsletterController = require("../controllers/newsletter");

// Api Router
const api = express.Router();

// Newsletter's routing
api.post("/suscribe-email/:email", NewsletterController.suscribeEmail);

// Export api
module.exports = api;
