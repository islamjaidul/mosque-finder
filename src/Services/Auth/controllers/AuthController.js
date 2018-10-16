const passport = require('passport');
const jwt = require('jsonwebtoken');
var pas = require('../../../../config/passport');
pas(passport);

const User = require('../../User/Models/User');
const { secret_key } = require('../../../../config/settings');

class AuthController {
    register(req, res) {
        if (!req.body.username || !req.body.password) {
            res.json({success: false, msg: 'Please pass username and password.'});
        } else {
            var newUser = new User({
                username: req.body.username,
                password: req.body.password
            });
            // save the user
            newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
            });
        }
    }

    loggedIn(req, res) {
        User.findOne(
            { username: req.body.username },
            (err, user) => {
                if (err) throw err;

                if (! user) {
                    res.status(401).send({
                        status: false,
                        msg: 'Authentication Failed, User Not Found!'
                    })
                } else {
                    user.comparePassword(req.body.password, (err, isMatch) => {
                        if (isMatch && !err) {
                            const token = jwt.sign(user.toJSON(), secret_key, { algorithm: 'RS256' }, { expiresIn: '1h' });
                            res.status(200).send({
                                status: true,
                                token: `JWT${token}`
                            })
                        } else {
                            res.status(401).send({
                                status: false,
                                msg: 'Authentication Failed, Wrong password'
                            })
                        }
                    })
                }
            } 
        )
    }
}

module.exports = new AuthController();