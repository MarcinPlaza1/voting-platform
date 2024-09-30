import express from 'express';
import Vote from '../models/vote.js';
import auth from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';
import { emitVoteUpdate } from '../app.js';

const router = new express.Router();

router.post('/votes', auth, checkRole(['admin']), async (req, res) => {
    try {
        const vote = new Vote({
            ...req.body,
            createdBy: req.user._id
        });
        await vote.save();
        emitVoteUpdate(vote);
        res.status(201).send(vote);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/votes/:id/vote', auth, async (req, res) => {
    try {
        const vote = await Vote.findById(req.params.id);
        if (!vote) return res.status(404).send({ error: 'Vote not found' });

        const option = vote.options.find(opt => opt.text === req.body.option);
        if (!option) return res.status(404).send({ error: 'Option not found' });

        option.votes += 1;
        await vote.save();
        emitVoteUpdate(vote);
        res.status(200).send(vote);
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;
