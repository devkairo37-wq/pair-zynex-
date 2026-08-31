const { cmd } = require("../arslan");
const fetch = require("node-fetch");
const yts = require("yt-search");
const axios = require("axios");
const { fakevCard } = require('../lib/fakevCard');

cmd({
  pattern: "song",
  alias: ["ytmp3", "play", "mp3", "gana", "music", "audio"],
  react: "🎵",
  desc: "YouTube search & MP3 play",
  category: "download",
  use: ".play <song name or link>",
  filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {

  try {

    const query = args.join(" ");
    if (!query) return reply("❌ Please provide a song name or link");

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    /* 🔍 YouTube Search */
    const search = await yts(query);

    if (!search.videos || !search.videos.length) {
      return reply("❌ No results found");
    }

    const video = search.videos[0];

    /* 🎧 MP3 API */
    const apiUrl = `https://arslan-apis-v2.vercel.app/download/ytmp3?url=${video.url}`;

    const res = await axios.get(apiUrl, { timeout: 60000 });

    if (
      !res.data ||
      !res.data.status ||
      !res.data.result ||
      !res.data.result.download ||
      !res.data.result.download.url
    ) {
      return reply("❌ Audio not generated");
    }

    const dlUrl = res.data.result.download.url;
    const meta = res.data.result.metadata;
    const quality = res.data.result.download.quality || "128kbps";

    /* 🎵 SEND AUDIO */
    await conn.sendMessage(from, {
      audio: { url: dlUrl },
      mimetype: "audio/mpeg",
      ptt: false,
      fileName: `${meta.title || "song"}.mp3`,
      caption:
        `🎵 *${meta.title || "Unknown Title"}*\n` +
        `🎚️ Quality: ${quality}\n\n` +
        `*🌐 Powered by: KAIRO ZYNEX*`,
      contextInfo: {
        externalAdReply: {
          title: meta.title
            ? meta.title.substring(0, 40)
            : "YouTube Song",
          body: "▶︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• ★彡 KAIRO ZYNEX 彡★",
          thumbnailUrl: video.thumbnail,
          sourceUrl: video.url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fakevCard });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (err) {

    console.error("PLAY ERROR:", err);

    reply("❌ Something went wrong, please try again later");

    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });

  }

});


cmd({
  pattern: 'video1',
  alias: ["vid", "ytv"],
  desc: "Download YouTube Video",
  category: 'downloader',
  react: '🪄',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Please provide a YouTube link or search query.\n\nExample: .video1 Pasoori");
    }

    let videoUrl;
    if (q.includes("youtube.com") || q.includes('youtu.be')) {
      videoUrl = q;
    } else {
      let search = await yts(q);
      if (!search || !search.videos || search.videos.length === 0) {
        return reply("❌ No results found.");
      }
      videoUrl = search.videos[0].url;
    }

    // ⚠️ Replace APIKEY below with your real API key from gtech-api-xtp1
    const res = await fetch("https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=" + encodeURIComponent(videoUrl));
    const data = await res.json();

    if (!data.status) {
      return reply("❌ Failed to fetch video.");
    }

    const { video_url_hd: hdUrl, video_url_sd: sdUrl } = data.result.media;
    const finalUrl = hdUrl !== "No HD video URL available" ? hdUrl : sdUrl;

    if (!finalUrl || finalUrl.includes('No')) {
      return reply("❌ No downloadable video found.");
    }

    await conn.sendMessage(from, {
      video: { url: finalUrl },
      caption: "*🌐 Powered by: KAIRO ZYNEX*"
    }, { quoted: fakevCard });

  } catch (err) {
    reply("❌ Error while fetching video.");
    console.log(err);
  }
});
