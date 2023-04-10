const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const postsData = await Post.findAll(req.session.user.id, { attributes: [ 'title', 'content', 'date_created' ]},
            {
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

        const posts = postsData.get({ plain: true });

        res.render('dashboard', { ...posts });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;