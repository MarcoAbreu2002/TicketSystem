const Faq = require("../model/schemas/FaqSchema");
const User = require("../model/schemas/UserSchema");
const Ticket = require("../model/schemas/TicketSchema");
const Message = require("../model/schemas/MessageSchema");
const jwt = require('jsonwebtoken');

// Error handling function
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '' };

    if (err.message === 'Username Incorreto!') {
        errors.username = 'Este username não existe';
    }
    if (err.message === 'Password Incorreta!') {
        errors.password = 'A palavra passe está incorreta';
    }
    if (err.code === 11000) {
        errors.username = 'Esse username já existe!';
        return errors;
    }
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || '#secret-Signature-For-Payload', {
        expiresIn: maxAge
    });
};

const profile_get = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized: No user found');
        }

        // Fetch tickets for the logged-in user
        const tickets = await Ticket.find({ solicitante: req.user.username }) || [];

        // Render the profile view
        res.render('profile', { user: req.user, tickets });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};



const freqAskQ = (req, res) => {
    Faq.find({}, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("An error occurred while fetching FAQs");
        } else {
            res.render('faq', {
                title: 'FAQ',
                result: result
            });
        }
    });
};

const freqAskQ_post = (req, res) => {
    const { categoria } = req.body;
    Faq.find({ 'category': categoria, 'pinned': true }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("An error occurred while fetching FAQs");
        } else {
            res.send(result);
        }
    });
}

const aboutus_get = (req, res) => {
    res.render('about');
}

const criarConta_get = (req, res) => {
    res.render('createAccount', { title: 'Criar nova conta' });
}

const login_get = (req, res) => {
    res.render('login', { title: 'login' });
}

const criarConta_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.create({ username, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const novoTicket_post = async (req, res) => {
    const { assunto, solicitante, email, categoria, agente, prioridade, descricao } = req.body;

    try {
        const ticket = await Ticket.create({ assunto, solicitante, email, categoria, agente, prioridade, descricao });
        res.status(201).json({ ticket });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const login_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

const novoTicket_get = (req, res) => {
    User.find()
        .then((result) => {
            res.render('novo-ticket', { users: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("An error occurred while fetching users");
        });
}

const chat_get = async (req, res) => {
    const room = req.params.room || 'default'; // Default room if none specified
    try {
        const messages = await Message.find({ room });
        res.render('chat', { messages, user: req.user, room });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).send('Failed to fetch messages');
    }
};




const addMensagens = async (req, res) => {
    const { messagem, solicitante } = req.body;
    const room = req.params.room;
    console.log('ADD MESSAGE: ', messagem, 'ROOM: ', room);
    try {
        const msg = await Message.create({ messagem, solicitante, room });
        res.status(201).json({ message: msg });
    } catch (err) {
        console.error('Error adding message:', err);
        res.status(500).send('Failed to add message');
    }
};



const editMessages = async (req, res) => {
    const { id } = req.params;
    const { messagem } = req.body;
    try {
        const updatedMessage = await Message.findByIdAndUpdate(id, { messagem }, { new: true });
        if (!updatedMessage) return res.status(404).send('Message not found');
        res.json({ message: updatedMessage });
    } catch (err) {
        console.error('Error updating message:', err);
        res.status(500).send('Failed to update message');
    }
};

// Assuming you also need a deleteMessages function
const deleteMessages = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedMessage = await Message.findByIdAndDelete(id);
        if (!deletedMessage) return res.status(404).send('Message not found');
        res.json({ message: 'Message deleted' });
    } catch (err) {
        console.error('Error deleting message:', err);
        res.status(500).send('Failed to delete message');
    }
};


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
    editMessages,
    deleteMessages
}
