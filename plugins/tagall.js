const config = require('../config')
const { cmd, commands } = require('../arslan')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "📣",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("⚠️ This command can only be used in groups.");

        const botOwner = conn.user.id.split(":")[0]; // Extract bot owner's number
        const senderJid = senderNumber + "@s.whatsapp.net";

        if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
            return reply("🚫 Only group admins can use this command.");
        }

        // Ensure group metadata is fetched properly
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ Couldn't tag members right now.");

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) return reply("❌ No members found in this group.");

        // Proper message extraction
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "Attention Everyone"; // Default message

        let teks = `📣  T A G A L L\n`;
        teks += `▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n`;
        teks += `▸ Group   : ${groupName}\n`;
        teks += `▸ Members : ${totalMembers}\n`;
        teks += `▸ Note    : ${message}\n`;
        teks += `▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n`;

        let i = 1;
        for (let mem of participants) {
            if (!mem.id) continue; // Prevent undefined errors
            teks += `${i.toString().padStart(2, '0')} → @${mem.id.split('@')[0]}\n`;
            i++;
        }

        teks += `\nKAIRO ZYNEX`;

        conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ Error occurred: ${e.message || e}`);
    }
});
