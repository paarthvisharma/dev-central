const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
    // res.json(['Complete the function']);
    const questions = await Question.find().populate('tags');
    const tags = await Tag.find();
    let count = {};
    for (let tag of tags) {
        count[tag.name] = {name: tag.name, qcnt: 0};
    }
    // Incrementing the count if tag exists in map
    for (let question of questions) {
        for (let tag of question.tags) {
            if (count[tag.name]) {
                count[tag.name].qcnt += 1;
            }
        }
    }
    let tagCount = Object.values(count);
    res.json(tagCount);


};

// add appropriate HTTP verbs and their endpoints to the router.
router.get('/getTagsWithQuestionNumber', getTagsWithQuestionNumber);

module.exports = router;