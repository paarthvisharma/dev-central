const express = require("express");
const Question = require("../models/questions");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');
const Answer = require("../models/answers");
const reportedPost = require("../models/reportedPost");

const router = express.Router();

// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {
    const search =  req.query.search || '';
    const order = req.query.order || 'newest';


    try {
        let qlist = await getQuestionsByOrder(order);
        const questionsFiltered = filterQuestionsBySearch(qlist, search);
        res.json(questionsFiltered);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.toString() });
    }
};

// To get Questions by Id
const getQuestionById = async (req, res) => {
    // res.json({msg: 'complete the function'});
    const questionId = req.params.id; 
    try {
        const question = await Question.findOneAndUpdate(
            { _id: questionId },
            { $inc: { views: 1 } }
            // { new: true } 
        ).populate('answers');

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json(question);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.toString() });
    }
    
};

// To add Question
const addQuestion = async (req, res) => {
    if (!req.session['currentUser']){
        return res.status(401).send({"message": 'Login First'});
    }
    const { title, text, tags, answers, asked_by } = req.body;
    const processedTags = await Promise.all(tags.map(tag => addTag(tag)));

    const newQuestion = await Question.create({
        title,
        text,
        tags: processedTags,
        answers,
        asked_by: req.session['currentUser']['username'],
        ask_date_time: new Date()
    });
    // res.json(newQuestion); 
    res.send(newQuestion); 
};

const deletePost = async (req, res) => {
    const currentUser = req.session['currentUser']
    if (!currentUser) {
        return res.status(403).send('Access denied');
    }

    if (!currentUser.roles || !currentUser.roles.includes('moderator')) {
        return res.status(403).send('Action can only be performed by a moderator');
    }
    const {qid} = req.body;
    try{
    const question = await Question.findById(qid);
        if (!question) {
            return res.status(404).send('Question not found');
        }
    await Question.findByIdAndDelete(qid);
    await Answer.deleteMany({ _id: { $in: question.answers } });
    const isReported = await reportedPost.find({qid});
    if (isReported) {
        await reportedPost.deleteOne({qid});
    }
    res.status(200).send({ message: 'Question and all associated answers deleted successfully.' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}; 

// add appropriate HTTP verbs and their endpoints to the router

router.get('/getQuestion', getQuestionsByFilter);
router.get('/getQuestionById/:id', getQuestionById);
router.post('/addQuestion', addQuestion);
router.post('/deleteQuestion', deletePost);



module.exports = router;