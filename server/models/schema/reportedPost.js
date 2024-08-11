const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        qid: { type : String, required: true, unique: true },
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reportedAt: { type: Date, default: Date.now }
    },
    { collection: "ReportedPost" }  
);