const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

// is with middleware to prevent access to route. 
router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['name', 'ASC']],
            include: [{ model: Post }],
        });
// serialize data so the template can read it. get the project.js json model data. users need to match the homepage 
        const users = userData.map((project) => project.get({ plain: true }));

// pass serialized data and session flag into template
        res.render('homepage', {
            users,
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

module.exports = router;