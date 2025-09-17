require('dotenv').config();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");
const fileUpload = require('express-fileupload');
const { MongoClient } = require('mongodb');

// Import your plugins
const countryPlug = require('./plugins/country');
const cecanPlug = require('./plugins/cecan');
const darePlug = require('./plugins/dare');
const truthPlug = require('./plugins/truth');
const aniquotePlug = require('./plugins/aniquote');
const flirtPlug = require('./plugins/flirt');
const calPlug = require('./plugins/calculator');
const convertPlug = require('./plugins/convert');
const rizzPlug = require('./plugins/rizz');
const quotePlug = require('./plugins/quote');
const encodePlug = require('./plugins/encode');
const decodePlug = require('./plugins/decoder');
const waifuPlug = require('./plugins/waifu');
const jokePlug = require('./plugins/joke');
const obfPlug = require('./plugins/obf');
const tinyurlPlug = require('./plugins/tinyurl');
const ytmp3Plug = require('./plugins/ytmp3');
const ytmp4Plug = require('./plugins/ytmp4');
const tiktokPlug = require('./plugins/tiktok');
const ytsPlug = require('./plugins/yts');
const wachannelPlug = require('./plugins/wachannel')
const animePlug = require('./plugins/anime');
const xvidPlug = require('./plugins/xvideos');
const hentaiPlug = require('./plugins/hentai');
const npmcheckPlug = require('./plugins/npmcheck');
const wallpaperPlugin = require('./plugins/wallpaper');
const xsearchPlug = require('./plugins/xxxsearch');
const screenshotPlug = require('./plugins/screenshot');
const text2imagePlug = require('./plugins/text2image');
const fontPlug = require('./plugins/font');
const lyricsPlug = require('./plugins/lyrics');
const mediafirePlug = require('./plugins/mediafire');
const xnxxsearchPlug = require('./plugins/xnxxsearch');
const moviedlPlug = require('./plugins/moviedl');
const gpt3_5Plug = require('./plugins/gpt3.5');
const instaplug = require('./plugins/instagram');
const fbPlug = require('./plugins/facebook');
const twitterPlug = require('./plugins/twitter');
const spotifyPlug = require('./plugins/spotify');
const aioPlug = require('./plugins/all-in-one');
const shortclipPlug = require('./plugins/shortclip');
const pinterestPlug = require('./plugins/pinterest');
const apkdlPlug = require('./plugins/apkdl');
const threadPlug = require('./plugins/thread');
const translatePlug = require('./plugins/translate');
const tiktok2Plug = require('./plugins/tiktok2');
const uploadPlug = require('./plugins/upload');

const blue = express();
const PORT = process.env.PORT || 7860;
const MONGODB_URI = 'mongodb+srv://asmakev930h:Taloalob.1@aniplix.jsxe7pk.mongodb.net/?retryWrites=true&w=majority&appName=aniplix';
const DB_NAME = process.env.DB_NAME || 'api_requests';
const COLLECTION_NAME = 'request_counts';

let db;

// Middleware
blue.use(cors());
blue.use(express.json());
blue.use(express.static(path.join(__dirname, "public")));

blue.use(async (req, res, next) => {
    if (!db) {
        console.error("MongoDB not connected. Skipping request count update.");
        return next();
    }
    try {
        const collection = db.collection(COLLECTION_NAME);
        await collection.updateOne(
            { _id: "total_requests" },
            { $inc: { count: 1 } },
            { upsert: true }
        );
        next();
    } catch (error) {
        console.error("Error updating request count in MongoDB:", error);
        next(error);
    }
});

/*====================================*/
blue.use(fileUpload({ limits: { fileSize: 250 * 1024 * 1024 } }));
blue.use(countryPlug);
blue.use(cecanPlug);
blue.use(jokePlug);
blue.use(darePlug);
blue.use(truthPlug);
blue.use(aniquotePlug);
blue.use(calPlug);
blue.use(flirtPlug);
blue.use(convertPlug);
blue.use(rizzPlug);
blue.use(quotePlug);
blue.use(encodePlug);
blue.use(decodePlug);
blue.use(waifuPlug);
blue.use(obfPlug);
blue.use(tinyurlPlug);
blue.use(ytmp3Plug);
blue.use(ytmp4Plug);
blue.use(tiktokPlug);
blue.use(ytsPlug);
blue.use(wachannelPlug);
blue.use(animePlug);
blue.use(xvidPlug);
blue.use(hentaiPlug);
blue.use(npmcheckPlug);
blue.use(wallpaperPlugin);
blue.use(xsearchPlug);
blue.use(screenshotPlug);
blue.use(text2imagePlug);
blue.use(fontPlug);
blue.use(lyricsPlug);
blue.use(mediafirePlug);
blue.use(xnxxsearchPlug);
blue.use(moviedlPlug);
blue.use(gpt3_5Plug);
blue.use(instaplug);
blue.use(fbPlug);
blue.use(twitterPlug);
blue.use(spotifyPlug);
blue.use(aioPlug);
blue.use(shortclipPlug);
blue.use(pinterestPlug);
blue.use(apkdlPlug);
blue.use(threadPlug);
blue.use(translatePlug);
blue.use(tiktok2Plug);
blue.use(uploadPlug);
/*====================================*/

// API endpoint to get total requests from MongoDB
blue.get('/api/requests', async (req, res) => {
    if (!db) {
        return res.status(503).set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "BLUE DEMON",
                    status: 503,
                    success: false,
                    message: "Database not connected yet.",
                },
                null,
                2
            )
        );
    }
    try {
        const collection = db.collection(COLLECTION_NAME);
        const requestDoc = await collection.findOne({ _id: "total_requests" });
        const count = requestDoc ? requestDoc.count : 0;
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "BLUE DEMON",
                    status: 200,
                    success: true,
                    request_count: count,
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("Error fetching request count from MongoDB:", error);
        res.status(500).set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "BLUE DEMON",
                    status: 500,
                    success: false,
                    message: "Failed to retrieve request count.",
                    error: error.message,
                },
                null,
                2
            )
        );
    }
});

blue.get("/api", async (req, res) => {
    if (!db) {
        return res.status(503).set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "BLUE DEMON",
                    status: 503,
                    success: false,
                    message: "Database not connected yet.",
                },
                null,
                2
            )
        );
    }
    try {
        const collection = db.collection(COLLECTION_NAME);
        const requestDoc = await collection.findOne({ _id: "total_requests" });
        const totalRequests = requestDoc ? requestDoc.count : 0;
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "BLUE DEMON",
                    status: 200,
                    success: true,
                    message: "Welcome to the Combined API!",
                    totalRequests: totalRequests
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("Error fetching request count for /api:", error);
        res.status(500).set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "BLUE DEMON",
                    status: 500,
                    success: false,
                    message: "An unexpected error occurred while fetching total requests.",
                    error: error.message,
                },
                null,
                2
            )
        );
    }
});

// Catch-All for Undefined Routes (404)
blue.use((req, res) => {
    res.status(404).set("Content-Type", "application/json").send(
        JSON.stringify(
            {
                creator: "BLUE DEMON",
                status: 404,
                success: false,
                message: "Endpoint not found. Please check the URL and try again.",
            },
            null,
            2
        )
    );
});
blue.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).set("Content-Type", "application/json").send(
        JSON.stringify(
            {
                creator: "BLUE DEMON",
                status: 500,
                success: false,
                message: "An unexpected error occurred. Please try again later.",
                error: err.message,
            },
            null,
            2
        )
    );
});

async function startServer() {
    try {
        const client = await MongoClient.connect(MONGODB_URI);
        db = client.db(DB_NAME);
        console.log('Connected to MongoDB');

        blue.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

startServer();
