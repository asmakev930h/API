const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/api/xxxsearch', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify({
                creator: "BLUE DEMON",
                status: 400,
                success: false,
                message: "Please provide a search term using the 'q' query parameter."
            }, null, 2)
        );
    }

    const url = `https://www.xvideos.com/?k=${query.replace(/ /g, '+')}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const $ = cheerio.load(response.data);
        const videos = [];

        $('.mozaique .thumb-block').each((_, el) => {
            const element = $(el);

            const anchor = element.find('.thumb a');
            const videoUrl = 'https://www.xvideos.com' + anchor.attr('href');
            const thumbnailUrl = anchor.find('img').attr('src');
            const quality = anchor.find('.video-hd-mark').text().trim();

            const titleEl = element.find('.thumb-under .title a');
            const title = titleEl.text().replace(/\s*\d+ min$/, '').trim();
            const duration = element.find('.thumb-under .title .duration').text().trim();

            const uploader = element.find('.thumb-under .metadata .name').text().trim();
            const viewsRaw = element.find('.thumb-under .metadata').text();
            const viewsMatch = viewsRaw.match(/(\d[\d.,]*\s*[MK]?)/i);
            const views = viewsMatch ? viewsMatch[1].trim() : null;

            videos.push({
                title,
                videoUrl,
                thumbnailUrl,
                quality,
                duration,
                uploader,
                views
            });
        });

        if (videos.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify({
                    creator: "BLUE DEMON",
                    status: 404,
                    success: false,
                    message: `No results found for '${query}'.`
                }, null, 2)
            );
        }

        res.set("Content-Type", "application/json").send(
            JSON.stringify({
                creator: "BLUE DEMON",
                status: 200,
                success: true,
                searchQuery: query,
                resultCount: videos.length,
                videos
            }, null, 2)
        );

    } catch (error) {
        console.error("❌ Error fetching XVideos data:", error.message);
        res.set("Content-Type", "application/json").send(
            JSON.stringify({
                creator: "BLUE DEMON",
                status: 500,
                success: false,
                message: "An error occurred while searching XVideos.",
                error: error.message
            }, null, 2)
        );
    }
});

module.exports = router;