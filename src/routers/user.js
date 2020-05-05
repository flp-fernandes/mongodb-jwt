//package
const express = require('express')

//files
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

//routes
router.get('/', (req, res) => {
    res.send({ msg: "ok" });
})

router.post('/users', async (req, res) => {
    //create a new user
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/login', async (req, res) => {
    //login a registered user
    try{
        const { email, password } = req.body;
        
        const user = await User.findByCredentials(email, password);
        if (!user) return res.status(401).send({ error: 'Login failed! Check authentication credentials' })

        const token = await user.generateAuthToken();
        
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/users/me', auth, async (req, res) => {
    //view logged in user profile
    res.send(req.user);
})

router.post('/users/me/logout', auth, async (req, res) => {
    //logout user
    try {
        req.user.tokens = req.user.tokens.filter( token => token.token != req.token );
        await req.user.save();
        
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/users/me/logoutall', auth, async (req, res) => {
    //logout of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();

        res.send()
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;