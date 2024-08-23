const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const {requireAuth} = require("../middleware/middlewareAutenticaion");
const jsonParser = require("../app");
//const bodyParser = require("body-parser");
//const bodyPars = require("body-parser");


router.post('/create',controller.criarConta_post);
router.get('/faq',controller.freqAskQ);
router.get('/about',controller.aboutus_get);
router.get('/login',controller.login_get);
router.get('/create', controller.criarConta_get);
router.post('/login',controller.login_post);
router.get('/logout',controller.logout_get);
router.get('/profile', requireAuth ,controller.profile_get);
router.get('/novo-ticket', controller.novoTicket_get);
router.post('/novo-ticket', controller.novoTicket_post);
router.get('/chat', controller.chat_get);
router.get('/chat/:x', controller.chat_get);
router.post('/chat/:x', controller.addMensagens);
router.post('/chat/:x',controller.editMessages);



module.exports = router;