const { cmd, commands } = require("../arslan");
const moment = require("moment-timezone");
const { fakevCard } = require('../lib/fakevCard');

cmd({
    pattern: "menu",
    alias: ["commandlist", "allmenu", "help"],
    desc: "Fetch and display all available bot commands",
    category: "system",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        let totalCommands = 0;
        let grouped = {};

        // Group commands by category
        for (const cmd of commands) {
            if (!cmd.pattern || !cmd.category) continue;

            totalCommands++;
            if (!grouped[cmd.category]) grouped[cmd.category] = [];
            grouped[cmd.category].push(cmd.pattern);
        }

        const time = moment().tz("Africa/Kampala").format("HH:mm:ss");
        const date = moment().tz("Africa/Kampala").format("dddd, MMMM Do YYYY");

        let menuText = "";
        for (const cat in grouped) {
            menuText += `\n▌ *${cat.toUpperCase()}*\n`;
            menuText += grouped[cat].map(c => `   ⇾ ${c}`).join("\n");
            menuText += `\n`;
        }

        const caption = `
════════════════════
 ▓▒░ *𝐊𝐀𝐈𝐑𝐎  𝐙𝐘𝐍𝐄𝐗* ░▒▓
════════════════════

  ⚙️ Commands   : *${totalCommands}*
  🕐 Time       : *${time}*
  🗓️ Date       : *${date}*
  🌐 Platform   : *kairo-zynex.xo.je*

════════════════════
${menuText}
════════════════════
 ▓ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴀɪʀᴏ ᴢʏɴᴇx▓
════════════════════
`.trim();

        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/hm1anj.jpg" },
            caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363409975095814@newsletter",
                    newsletterName: "𝗞𝗔𝗜𝗥𝗢-𝗭𝗬𝗡𝗘𝗫",
                    serverMessageId: 2,
                },
            },
        }, { quoted: fakevCard });

    } catch (err) {
        console.error("AllMenu Error:", err);
        reply("❌ Error while generating menu.");
    }
});
