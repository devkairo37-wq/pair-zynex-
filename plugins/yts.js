const { cmd } = require('../arslan')
const yts = require('yt-search')

cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    react: "🔍",
    desc: "Search videos on YouTube",
    category: "search",
    use: ".yts <video name>",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(
                "🔍 Search YouTube for a video\n\n" +
                "Use:\n.yts <video name>\n\n" +
                "Example:\n.yts Tajdar e Haram"
            )
        }

        const search = await yts(q)
        const videos = search.videos.slice(0, 10) // top 10 results

        if (videos.length === 0) {
            return reply("❌ No videos found.")
        }

        let text = "🔍  Y O U T U B E   S E A R C H\n"
        text += "▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n"

        for (let i = 0; i < videos.length; i++) {
            const v = videos[i]
            text +=
`${(i + 1).toString().padStart(2, '0')} → ${v.title}
    ⏱ ${v.timestamp}  •  👁 ${v.views} views
    🔗 ${v.url}

`
        }

        text += "KAIRO ZYNEX"

        await conn.sendMessage(
            from,
            { text },
            { quoted: mek }
        )

    } catch (e) {
        console.log("YTS ERROR:", e)
        reply("❌ Something went wrong while searching YouTube.")
    }
})
