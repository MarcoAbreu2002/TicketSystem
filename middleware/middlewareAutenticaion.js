const jwt = require('jsonwebtoken');
const User = require("../model/schemas/UserSchema");

// Ensure `checkUser` is declared before usage
const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, '#secret-Signature-For-Payload', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                try {
                    let user = await User.findById(decodedToken.id);
                    res.locals.user = user;
                    next();
                } catch (error) {
                    console.error(error);
                    res.status(500).send('Internal Server Error');
                }
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, '#secret-Signature-For-Payload', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                try {
                    const user = await User.findById(decodedToken.id);
                    if (user) {
                        req.user = user;
                        next();
                    } else {
                        res.redirect('/login');
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).send('Internal Server Error');
                }
            }
        });
    } else {
        res.redirect('/login');
    }
};

module.exports = {
    requireAuth,
    checkUser
};
