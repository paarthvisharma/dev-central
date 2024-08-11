const mongoose = require("mongoose");

const reportedPost = require("./schema/reportedPost");

module.exports = mongoose.model("ReportedPost", reportedPost);