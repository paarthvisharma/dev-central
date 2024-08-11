const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
    if (!req.session['currentUser']){
        return res.status(401).send({"message": 'Login First'});
    }
    const { qid, ans } = req.body;
    const newAns = {
        ans_by: req.session['currentUser']['username'],
        ...ans
    }
    const answer = await Answer.create(newAns);
    await Question.findOneAndUpdate(
        { _id: qid },  
        { $push: { 
           answers: { $each: [answer._id], $position: 0 }
        }
        },
        { new: true }  
    );
    res.json(answer);

};

const upVote = async (req, res) => {
    if (!req.session['currentUser']){
        return res.status(401).send({"message": 'Login First'});
    }
    try {
        let fetchedAnswer = await Answer.findOne({ _id: req.body.aid });
        if (fetchedAnswer.voted_by.includes(req.session['currentUser']['username'])) {
            return res.status(200).send({"message": 'You have already voted'});
        }
        const updatedAnswer = await Answer.findOneAndUpdate(
            { _id: req.body.aid },
            { 
                $inc: { ans_votes: 1 },
                $push: { voted_by: req.session['currentUser']['username'] }
            },
            { new: true }
        );
        res.status(201).json(updatedAnswer);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.toString() });
    }
};

const downVote = async (req, res) => {
    if (!req.session['currentUser']){
        return res.status(401).send({"message": 'Login First'});
    }
    try {
        let fetchedAnswer = await Answer.findOne({ _id: req.body.aid });
        if (fetchedAnswer.voted_by.includes(req.session['currentUser']['username'])) {
            return res.status(200).send({"message": 'You have already voted'});
        }
        const updatedAnswer = await Answer.findOneAndUpdate(
            { _id: req.body.aid },
            { 
                $inc: { ans_votes: -1 },
                $push: { voted_by: req.session['currentUser']['username'] }
            },
            { new: true }
        );
        res.status(201).json(updatedAnswer);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.toString() });
    }
};

const deleteAnswer = async (req, res) => {
    const currentUser = req.session['currentUser']
    if (!currentUser) {
        return res.status(403).send('Access denied');
    }

    if (!currentUser.roles || !currentUser.roles.includes('moderator')) {
        return res.status(403).send('Action can only be performed by a moderator');
    }
    const {aid, qid} = req.body;

    try{
    const answer = await Answer.findById(aid);
        if (!answer) {
            return res.status(404).send('Answer not found');
        }
    await Answer.findByIdAndDelete(aid);
    await Question.findByIdAndUpdate(qid, {
        $pull: { answers: aid }
    });

    res.status(200).send({ message: 'Answers deleted successfully.' });
    } catch (error) {
        res.status(500).send('Server Error');
    } 
}; 

// add appropriate HTTP verbs and their endpoints to the router.
router.post('/addAnswer', addAnswer);
router.post('/upVote', upVote);
router.post('/downVote', downVote);
router.post('/deleteAnswer', deleteAnswer);


module.exports = router;