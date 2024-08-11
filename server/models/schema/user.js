const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        username: { type: String, required: true, maxLength: 30, unique: true },
        password: { type: String, required: true, maxLength: 30 },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        roles: { type: [String], enum: ['user', 'moderator'], default: ['user'] },
    },
    { collection: "User" }  
);