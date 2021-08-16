const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Comment = require('../models/comment')

var reviewSchema = new Schema({
    bookTitle: String,
    bookAuthor: String,
    description: String,
    author: { type: Schema.Types.ObjectId, req: 'User'}
});

// reviewSchema
//  .pre('findOne', Populate('author'))
//  .pre('find', Populate('author'));

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;