const Faq = require("../model/schemas/FaqSchema");
const User = require("../model/schemas/UserSchema");
const Ticket = require("../model/schemas/TicketSchema");
const Message = require("../model/schemas/MessageSchema");
const jwt = require('jsonwebtoken');

//Tratamento de erros
const handleErrors = (err) =>{
    console.log(err.message, err.code);
    let errors = {username: '', password:''};

    if(err.message === 'Username Incorreto!'){
        errors.username = 'Este username não existe';
    }
    if(err.message === 'Password Incorreta!'){
        errors.password = 'A palavra passe está incorreta';
    }
    if(err.code === 11000){
        errors.username = 'Esse username já existe!';
        return errors;
    }
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60; //3 dias em segundos
const createToken = (id) =>{
    return jwt.sign({id},'#secret-Signature-For-Payload',{
        expiresIn: maxAge
    });
};

const profile_get = (req, res) =>{
    res.render('profile');
}

const freqAskQ = (req,res) => {
    res.render('faq',{title:'faq'});
}

const freqAskQ_post = (req,res) => {
    const {categoria} = req.body;
    Faq.find({'category': categoria, 'pinned':true},(err,result)=>{
        if(err)
            console.log(err);
        res.send(result)
    });
}

const aboutus_get= (req,res) => {
    res.render('about');
}

const criarConta_get =  (req, res) => {
    res.render('createAccount',{title:'Criar nova conta'})
}

const login_get = (req,res) => {
    res.render('login', {title: 'login'})
}

const criarConta_post =  async (req,res) =>{
    const {username, password} = req.body;

    try {
        const user = await User.create({username, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: user._id});
    }catch (err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const novoTicket_post = async (req, res) =>{
    const {assunto, solicitante,email,categoria,agente,prioridade,descricao} = req.body;

    try{
        console.log('BODY:', req.body);
        console.log(assunto, solicitante,email,categoria,agente,prioridade,descricao);
        const ticket = await Ticket.create({assunto, solicitante,email,categoria,agente,prioridade,descricao});
        const token = createToken(ticket._id);
        //res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: ticket._id});
    }catch (err){
        console.log(err);
    }
}

const login_post = async (req, res) =>{
    const {username, password} = req.body;

    try{
        const user = await User.login(username,password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });

    }catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const logout_get = (req,res)=>{
    res.cookie('jwt', '', {maxAge: 1 });
    res.redirect('/');
}

const novoTicket_get = (req, res) => {
    User.find()
        .then( (result)=>{
            res.render('novo-ticket',{users:result})
        })
        .catch((err)=>{
            console.log(err);
    });
}

const chat_get =  (req, res) =>{
    Message.find()
        .then((result)=>{
            res.render('chat',{messages:result})
        })
        .catch((err)=>{
            console.log(err);
        })
}

const addMensagens  = async (req,res,next)=>{

    const {messagem} = req.body;
    console.log('ADD MESSAGE: ', messagem);
    try{
        const msg = await Message.create({messagem})
        res.status(201).json({messages: msg._id});
    }catch (err){
        console.log(err);
        next(err);
    }
}


const editMessages = async (req,res, next)=>{
    Message.find()
        .then((result)=>{
            res.render('chat',{messages:result})
        })
        .catch((err)=>{
            console.log(err);
        })
}

module.exports = {
    freqAskQ,
    freqAskQ_post,
    aboutus_get,
    criarConta_get,
    criarConta_post,
    login_post,
    login_get,
    logout_get,
    profile_get,
    novoTicket_get,
    novoTicket_post,
    chat_get,
    addMensagens,
    editMessages
}