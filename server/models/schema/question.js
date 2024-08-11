const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
    {
        // define the relevant properties.
        title: {type: String, required: true, maxLength: 100},
        text: {type: String, required: true},
        asked_by: {type: String, required: true},
        ask_date_time: {type: Date, required: true},
        views: {type : Number, default: 0},
        answers: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Answer' }],
        tags: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Tag'}]
    },
    { collection: "Question" }
);