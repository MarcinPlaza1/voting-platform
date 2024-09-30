import express from 'express';
import User from '../models/user.js';
import auth from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = new express.Router();

router.post('/users/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send({ error: 'Invalid login credentials' });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).send({ error: 'Invalid password' });

        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/users/me', auth, (req, res) => {
    res.send(req.user);
});

export default router;