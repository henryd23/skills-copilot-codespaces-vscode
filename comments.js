// Create web server
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var Comment = require('../models/comment');
var Post = require('../models/post');

// Get all comments
router.get('/', function(req, res) {
    Comment.find(function(err, comments) {
        if (err) return res.status(500).send({ error: 'database failure' });
        res.json(comments);
    })
});
// Get single comment
router.get('/:comment_id', function(req, res) {
    Comment.findOne({ _id: req.params.comment_id }, function(err, comment) {
        if (err) return res.status(500).json({ error: err });
        if (!comment) return res.status(404).json({ error: 'comment not found' });
        res.json(comment);
    })
});
// Get comments by user
router.get('/user/:user_id', function(req, res) {
    Comment.find({ user_id: req.params.user_id }, function(err, comments) {
        if (err) return res.status(500).json({ error: err });
        if (comments.length === 0) return res.status(404).json({ error: 'comment not found' });
        res.json(comments);
    })
});
// Get comments by post
router.get('/post/:post_id', function(req, res) {
    Comment.find({ post_id: req.params.post_id }, function(err, comments) {
        if (err) return res.status(500).json({ error: err });
        if (comments.length === 0) return res.status(404).json({ error: 'comment not found' });
        res.json(comments);
    })
});
// Create comment
router.post('/', jsonParser, function(req, res) {
    var comment = new Comment();
    comment.user_id = req.body.user_id;
    comment.post_id = req.body.post_id;
    comment.content = req.body.content;
    comment.save(function(err) {
        if (err) {
            console.error(err);
            res.json({ result: 0 });
            return;
        }
        // Update post
        Post.findOne({ _id: req.body.post_id }, function(err, post) {
            if (err) return res.status(500).json({ error: err });
            if (!post) return res.status(404).json({ error: 'post not found' });
        }) 
    })
})