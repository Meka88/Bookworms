const Review = require('../models/review');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = function(app) {
    
    // get home route, all reviews
    app.get('/', (req, res) => {
        const currentUser = req.user;
        Review.find().lean().populate('author')
            .then(reviews => {
                res.render('reviews-index', {reviews, currentUser });
            })
            .catch(err => {
                console.log(err);
            });
    });


    // new review 
    app.get('/reviews/new', (req, res) => {
        res.render('reviews-new', {title: 'Post a New Review'});
    })
    // create 
    app.post('/reviews/new', (req, res) => {
        //const currentUser = req.user;
        
        if (req.user) {
            const userId = req.user._id;
            console.log(userId);
            const review = new Review(req.body);
            review.author = userId;
            console.log('auth', review.author)
            review
            .save()
            .then(() => User.findById(userId))
            .then((user) => {
                console.log(review, review.author);
                user.reviews.unshift(review);
                user.save();
                return res.redirect(`/reviews/${review._id}`);
            }).catch((err) => {
                console.log(err.message);
            })
        } else {
            return res.redirect(`/login`);
        }
    });

    app.get('/reviews/:id', (req, res) => {
        const currentUser = req.user;
        // find review
        Review.findById(req.params.id).populate('author').populate('comments').lean()
        .then(review => {
            console.log("review", review)
          // fetch its comments
        Comment.find({ reviewId: req.params.id }).then(comments => {
            // respond with the template with both values
            res.render('reviews-show', { review, comments, currentUser })
          })
        }).catch((err) => {
          // catch errors
          console.log(err.message)
        });
      });




    // Edit
    app.get('/reviews/:id/edit', (req, res) => {
        Review.findById(req.params.id, function(err, review) {
        res.render('reviews-edit', { review: review, title: 'Edit Review' });
        })
    })
    // Update
    app.put('reviews/:id', (req, res) => {
        Review.findByIdAndUpdate(req.params.id, req.body)
        .then(review => {
            res.redirect(`/reviews/${review._id}`)
        })
        .catch(err => {
            console.log(err.message)
        })
    })
    
    // Delete
    app.delete('/reviews/:id', function (req,res) {
        console.log('DELETE review')
        Review.findByIdAndRemove(req.params.id).then((review) => {
            console.log(`Delete success: ${review}`)
            res.redirect('/');
        }).catch((err) => {
        console.log(err.message);
        })
    })
};