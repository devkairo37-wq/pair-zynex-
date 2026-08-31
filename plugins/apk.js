const { cmd } = require('../arslan');
const axios = require('axios');

cmd({
  pattern: "apk",
  alias: ["app", "playstore", "application"],
  react: "☺️",
  desc: "Download APK via Aptoide",
  category: "download",
  use: ".apk <name>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("*📦 PLEASE PROVIDE AN APK NAME 📦*\n\n*✍️ USAGE:*\n*.apk ❮APK NAME❯*\n\n*✅ Once you send the command, I'll search and send you the APK file here.*");


    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`;
    const { data } = await axios.get(apiUrl);

        if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("*❌ NO APK FOUND ❌*");
    }


    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2);

    let caption = `┏━━ ✦ *APK INFO* ✦ ━━┓
┃ 📱 Name    : *${app.name.toUpperCase()}*
┃ 📦 Size    : *${appSize} MB*
┃ 🧩 Package : *${app.package.toUpperCase()}*
┃ 🔖 Version : *${app.file.vername}*
┗━━━━━━━━━━━━━━━━━━┛

*🌐 BY: KAIRO ZYNEX*`;


    await conn.sendMessage(from, { image: { url: app.icon }, caption }, { quoted: mek });

    await conn.sendMessage(from, {
      document: { url: app.file.path || app.file.path_alt },
      mimetype: "application/vnd.android.package-archive",
      fileName: `${app.name.toUpperCase()}.apk`
    }, { quoted: mek });

    await m.react("😍");
  } catch (err) {
    reply("*👑 ERROR :❯* TRY AGAIN!");
  }
});
                   
