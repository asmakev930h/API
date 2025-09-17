/* huggingface.js */
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');
const { uploadFile } = require('@huggingface/hub');
const express = require('express');

const router   = express.Router();
const HUG_KEY  = process.env.HUG_KEY;
const REPO     = process.env.HREPO;
const MAX_SIZE = 250 * 1024 * 1024; // 250 MB

/**
 * POST /api/huggingface
 * Body (multipart/form-data)  ->  key = "file"
 * ------------------------------------------------------------------
 * 200  { creator:"BLUE DEMON", status:200, success:true,  url:"…" }
 * 400  { creator:"BLUE DEMON", status:400, success:false, message:"No file uploaded" }
 * 413  { creator:"BLUE DEMON", status:413, success:false, message:"File exceeds 250 MB" }
 * 500  { creator:"BLUE DEMON", status:500, success:false, message:"Upload failed" }
 */
router.post('/api/upload', async (req, res) => {
  try {
    /* 1. basic file presence check */
    if (!req.files || !req.files.file) {
      return res
        .status(400)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          creator: 'BLUE DEMON',
          status: 400,
          success: false,
          message: 'No file uploaded. Send multipart/form-data with key "file".'
        }, null, 2));
    }

    const file = req.files.file;        // express-fileupload / multer / etc.
    const { name: originalName, data: content } = file;

    /* 2. size check */
    if (content.length > MAX_SIZE) {
      return res
        .status(413)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          creator: 'BLUE DEMON',
          status: 413,
          success: false,
          message: 'File exceeds 250 MB limit'
        }, null, 2));
    }

    /* 3. unique safe name */
    const safeName = crypto.randomUUID().slice(0, 7) + path.extname(originalName);

    /* 4. upload to HF */
    await uploadFile({
      repo: { name: REPO, type: 'dataset' },
      file: { path: safeName, content: new Blob([content]) },
      credentials: { accessToken: HUG_KEY }
    });

    /* 5. respond */
    const url = `https://huggingface.co/datasets/${REPO}/resolve/main/${safeName}`;
    return res
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        creator: 'BLUE DEMON',
        status: 200,
        success: true,
        url
      }, null, 2));
  } catch (err) {
    console.error('❌ HuggingFace upload error:', err.message);
    return res
      .status(500)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        creator: 'BLUE DEMON',
        status: 500,
        success: false,
        message: 'Upload failed',
        error: err.message
      }, null, 2));
  }
});

module.exports = router;
