const express = require('express');
const db = require('../../../db');
const Option = db.Option;
const router = express.Router();


// Option.create({
// 	name: 'Test Video',
// 	description: 'Video used to test users for playing youtube video',
// 	youtubeUrl: 'https://www.youtube.com/watch?v=8A3R_xz7nJQ&list=LL_uyk3EWD4JyUBgDCCfLLTQ&index=26',
// 	thumbnail: 'asdf',
// 	length: 100
// })

router.get('/getVideo', (req, res) => {
	Option.findAll({
		where: {
			id: 1
		}
	})
		.then(data => {
      res.send(data);
    })
})

module.exports = router;