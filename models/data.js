const mongoose = require("mongoose");

const DataScheme = mongoose.Schema({
    end_year: {
        type: Number,
        required: false,
    },
    intensity: {
        type: Number,
        required: false,
    },
    sector: {
        type: String,
        required: false,
    },
    topic: {
        type: String,
        required: false,
    },
    insight: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: false,
    },
    region: {
        type: String,
        required: false,
    },
    start_year: {
        type: String,
        required: false,
    },
    impact: {
        type: String,
        required: false,
    },
    added: {
        type: Date,
        required: false,
    },
    published: {
        type: Date,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    relevance: {
        type: Number,
        required: false,
    },
    pestle: {
        type: String,
        required: false,
    },
    source: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    likelihood: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("data", DataScheme);