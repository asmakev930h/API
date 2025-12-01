require('dotenv').config();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");
const fileUpload = require('express-fileupload');
const { MongoClient } = require('mongodb');

// Plugins are now loaded dynamically

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

// Dynamically load plugins
const pluginsDir = path.join(__dirname, 'plugins');

try {
    if (fs.existsSync(pluginsDir)) {
        const files = fs.readdirSync(pluginsDir);
        
        // Filter and sort files to ensure consistent loading order (alphabetical)
        const pluginFiles = files.filter(file => file.endsWith('.js')).sort();
    
        pluginFiles.forEach(file => {
            try {
                const pluginPath = path.join(pluginsDir, file);
                const plugin = require(pluginPath);
                blue.use(plugin);
                console.log(`Loaded plugin: ${file}`);
            } catch (err) {
                console.error(`Error loading plugin ${file}:`, err);
            }
        });
    } else {
        console.error("Plugins directory not found:", pluginsDir);
    }
} catch (err) {
    console.error('Error reading plugins directory:', err);
}

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