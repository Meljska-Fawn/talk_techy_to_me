const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        // get all posts and JOIN with user data
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        // serialize data so the template can read it. get the project.js json model data. users need to match the homepage 
        const posts = postData.map((post) => post.get({ plain: true }));

        // pass serialized data and session flag into template
        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

// create a route to get a single post
router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: ['content', 'date_created'],
                    include: {
                        model: User,
                        attribute: ['username']
                    }
                },
            ],
        });
        console.log(postData);

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        // serialize the data so the template can read it
        const post = postData.get({ plain: true });
        // pass data to template
        console.log(post);
        res.render('post', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

// Get all post with comments
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id,
            },
        attributes: [ 'id', 'title', 'content', 'date_created' ],
            include: [
                {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['content', 'date_created'],
                include: {
                    model: User,
                    attribute: ['username']
                }
            }],
            order: [['date_created', 'DESC']],
    });

        const posts = postData.map((post) => post.get({ plain: true }));
console.log(posts);
        res.render('dashboard', { posts, logged_in: true });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/dashboard/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                }]
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id.' });
            return;
        }
        const post = postData.get({ plain: true });
        res.render('edit-post', {
            post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard/newpost', withAuth, (req, res) => {
    res.render('new-post', { logged_in: true });
});

module.exports = router;