const { cmd } = require('../arslan');

cmd({
  pattern: "unblock",
  alias: ["unb", "unblk", "unblok"],
  react: "✅",
  category: "owner",
  desc: "Unblock user (reply or inbox)",
  filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
  try {

    // 🔒 Owner only
    if (!isOwner) {
      return reply("🚫 This command is for the owner only.");
    }

    let jid;

    // 📌 Reply case
    if (m.quoted) {
      jid = m.quoted.sender;
    }
    // 📌 Inbox case
    else if (from.endsWith("@s.whatsapp.net")) {
      jid = from;
    } 
    else {
      return reply("⚠️ Reply to a message or use this in the inbox to unblock someone.");
    }

    await conn.updateBlockStatus(jid, "unblock");

    await conn.sendMessage(from, {
      react: { text: "✅", key: mek.key }
    });

    reply(`✅  U N B L O C K E D\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n▸ User has been unblocked.\n\nKAIRO ZYNEX`, { mentions: [jid] });

  } catch (e) {
    console.log("UNBLOCK ERROR:", e);
    reply("❌ Failed to unblock the user.");
  }
});
