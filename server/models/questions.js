// Question Document Schema
const mongoose = require("mongoose");

const Question = require("./schema/question");

Question.virtual('latestAnswerTime').get(function () {
    if (this.answers && this.answers.length > 0) {
        return this.answers.sort((a, b) => b.ans_date_time - a.ans_date_time)[0].ans_date_time;
    }
    return null; 
});

module.exports = mongoose.model("Question", Question);