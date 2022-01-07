const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth.js');
const Story = require('../models/Story.js');

router.get('/add', ensureAuth, (req, res) => {
	try {
		res.render('stories/add');
	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
});

router.post('/', ensureAuth, async (req, res) => {
	try {
		req.body.user = req.user._id;
		await Story.create(req.body);
		res.redirect('/dashboard');
	} catch (error) {
		console.error(error);
		res.render('error/500');
	}
});

router.get('/', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({ status: 'public' })
			.populate('user')
			.sort({ createdAt: 'desc' })
			.lean();

		res.render('stories/index', { stories });
	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
});


router.get('/user/:id', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({ user: req.params.id, status: 'public' })
			.populate('user')
			.sort({ createdAt: 'desc' })
			.lean();

		res.render('stories/index', { stories });
	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
});


router.get('/:id', ensureAuth, async (req, res) => {
	try {
		const story = await Story.findOne({
			$or: [
				{ _id: req.params.id, user: req.user._id },
				{ _id: req.params.id, status: 'public' },
			],
		}).populate('user').lean();
		if (!story) {
			return res.render('error/404');
		}
		res.render('stories/view', {
			story,
		});
	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
});

router.get('/edit/:id', ensureAuth, async (req, res) => {
	try {
		const story = await Story.findOne({ _id: req.params.id, user: req.user._id }).lean();
		if (!story) {
			return res.render('error/404');
		}
		res.render('stories/edit', {
			story,
		});
	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
});

router.put('/:id', ensureAuth, async (req, res) => {
	try {
		const story = await Story.findOneAndUpdate(
			{ _id: req.params.id, user: req.user._id },
			req.body,
			{
				new: true,
				runValidators: true,
			},
		).lean();
		if (!story) {
			return res.render('error/404');
		}
		res.redirect('/dashboard');
	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
});

router.delete('/:id', ensureAuth, async (req, res) => {
	try {
		const story = await Story.findOneAndDelete({ _id: req.params.id, user: req.user._id });
		if (!story) {
			return res.render('error/500');
		}
		res.redirect('/dashboard');
	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
});

module.exports = router;
