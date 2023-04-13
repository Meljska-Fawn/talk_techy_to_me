const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Get all post with comments
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const postsData = await Post.findAll( {
            where: {
                user_id: req.session.id
            }
        }); 
        // { attributes: [ 'id', 'title', 'content', 'date_created' ]},
        //     {
        //     include: [
        //         {
        //         model: User,
        //         attributes: ['username']
        //     },
        //     {
        //         model: Comment,
        //         attributes: ['content', 'date_created'],
        //         include: {
        //             model: User,
        //             attribute: ['username']
        //         }
        //     }],
        //     order: [['date_created', 'DESC']],
        // });

        const posts = postsData.get({ plain: true });

        res.render('dashboard', { ...posts, logged_in: true });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
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

router.get('/newpost', withAuth, (req, res) => {
    res.render('new-post', { logged_in: true });
});

module.exports = router;