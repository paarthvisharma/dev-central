const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
    {
        // define relevant properties.
        text: {type: String, required: true},
        ans_by: {type: String, required: true},
        ans_date_time: {type: Date, required: true},
        ans_votes: {type: Number, required: true, default: 0},
        voted_by: {type: Array, required: true, default: []}
    },
    { collection: "Answer" }
);