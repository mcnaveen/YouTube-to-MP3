const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
var port = process.env.PORT || 4000;

app.use(cors());

app.listen(port, () => {
	console.log(`Server Works !!! At port ${port}`);
});

app.get('/downloadmp3', async (req, res, next) => {
	try {
		var url = req.query.url;
		if(!ytdl.validateURL(url)) {
			return res.sendStatus(400);
		}
		let title = 'audio';

		await ytdl.getBasicInfo(url, {
			format: 'mp4'
		}, (err, info) => {
			if (err) throw err;
			title = info.player_response.videoDetails.title.replace(/[^\x00-\x7F]/g, "");
		});

		res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
		ytdl(url, {
			format: 'mp3',
			filter: 'audioonly',
		}).pipe(res);

	} catch (err) {
		console.error(err);
	}
});
//http://localhost:4000/downloadmp3?url=https://www.youtube.com/watch?v=pMmCvixJS8c
