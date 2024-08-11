const express = require("express");
const reportedPost = require("../models/reportedPost");
const Question = require("../models/questions");

const router = express.Router();

const reportPost = async (req, res) => {
    if (!req.session['currentUser']){
        return res.status(401).send('Login First');
    }
    const { qid } = req.body;
    try{
        const existingReport = await reportedPost.findOne({ qid });

        if (existingReport) {
            return res.status(200).send({"message": 'Post already reported'});
        }

        const addreportedPost = await reportedPost.create({qid});
        res.status(200).send(addreportedPost);

    } catch (error) {
        res.status(500).send(error.message);
    }  

};


const getReportedPost = async (req, res) => {
    const currentUser = req.session['currentUser']
    if (!currentUser) {
        return res.status(403).send('Access denied');
    }

    if (!currentUser.roles.includes('moderator')) {
        return res.status(403).send('Action can only be performed by a moderator');
    }

    try{
        const reportedPosts = await reportedPost.find({});
        const objectIds = reportedPosts.map(q => q.qid);

        const response = await Question.find({
            '_id': { $in: objectIds }
        }).populate('tags');
        res.status(200).send(response);
    }catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteReportedPost = async (req, res) => {
    const currentUser = req.session['currentUser']
    if (!currentUser) {
        return res.status(403).send('Access denied');
    }

    if (!currentUser.roles || !currentUser.roles.includes('moderator')) {
        return res.status(403).send('Action can only be performed by a moderator');
    }
    const { qid } = req.body;

    try {
        const result = await reportedPost.deleteOne({qid});
        if (result) {
            console.log('Deleted', result);
            return res.status(200).send({"message": 'Resolved Successfully'});
        } else {
            console.log('No available doc with this ID', {qid});
        }
    } catch (error) {
        console.error('Error deleting document:', error);
    }
};



router.post('/reportPost', reportPost);
router.get('/getReportedPosts', getReportedPost);
router.post('/deleteReportedPost', deleteReportedPost);

module.exports = router;
