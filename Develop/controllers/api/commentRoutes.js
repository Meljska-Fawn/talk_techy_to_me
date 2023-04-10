const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// post a comment
router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
            post_id: req.body.post_id
        });
        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

// update comment text
router.put('/:id', withAuth, async (req, res) => {
    try {
        const updateComment = await Comment.update(req.body,
            {
                where: {
                    id: req.params.id,
                }
            });

        if (!updateComment[0]) {
            res.status(404).json({ message: 'No post found with this id' })
            return;
        }
        res.status(200).json(updateComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id
            },
        });

        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;