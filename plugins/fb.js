const { cmd } = require('../arslan');
const axios = require('axios');

cmd({
  pattern: "fb",
  react: "☺️",
  alias: ["facebook", "fbdl"],
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("*📥 WANT TO DOWNLOAD A FACEBOOK VIDEO? 📥*\n\n*✍️ USAGE:*\n*.fb ❮FACEBOOK VIDEO LINK❯*\n\n*✅ Send the command and I'll download the video for you here.*");

    const apiUrl = `https://movanest.xyz/v2/fbdown?url=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    // 🔎 API status check
    if (data.status !== true) {
      return reply("*❌ API ERROR ❌*");
    }

    // 🔎 Results check
    if (!Array.isArray(data.results) || data.results.length === 0) {
      return reply("*❌ NO FACEBOOK VIDEO FOUND ❌*");
    }

    const result = data.results[0];

    // 🎥 Quality selection (API ke mutabiq)
    const videoUrl = result.hdQualityLink
      ? result.hdQualityLink
      : result.normalQualityLink;

    if (!videoUrl) {
      return reply("*⚠️ PLEASE SEND A VALID FACEBOOK LINK ⚠️*");
    }

    // 📝 Caption API data se
    const caption = `┏━━ ✦ *FB VIDEO* ✦ ━━┓
┃ ⏱ Duration : *${result.duration}*
┃ 👤 Creator  : *${data.creator}*
┗━━━━━━━━━━━━━━━━━━┛

*🌐 BY: KAIRO ZYNEX*`;

    await conn.sendMessage(
      from,
      {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: caption
      },
      { quoted: mek }
    );

  } catch (err) {
    console.log(err);
    reply("*❌ SOMETHING WENT WRONG ❌*");
  }
});
