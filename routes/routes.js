const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const { requireAuth } = require("../middleware/middlewareAutenticaion");

router.post('/create', controller.criarConta_post);
router.get('/faq', controller.freqAskQ);
router.get('/about', controller.aboutus_get);
router.get('/login', controller.login_get);
router.get('/create', controller.criarConta_get);
router.post('/login', controller.login_post);
router.get('/logout', controller.logout_get);
router.get('/profile', requireAuth, controller.profile_get);
router.get('/novo-ticket', controller.novoTicket_get);
router.post('/novo-ticket', controller.novoTicket_post);
router.get('/chat', controller.chat_get); // Default route, will be handled with a room parameter
router.get('/chat/:room', controller.chat_get); // Handle specific room
router.post('/chat/:room', controller.addMensagens); // Add message to specific room
router.put('/chat/:room/:messageId', controller.editMessages); // Edit message in specific room
router.delete('/chat/:room/:messageId', controller.deleteMessages); // Delete message in specific room

module.exports = router;
