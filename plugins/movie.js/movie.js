const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "movie",
    alias: ["film", "mvid"],
    use: '.movie <name>',
    react: "🎬",
    desc: "Search and download movies",
    category: "download",
    filename: __filename
},
async (conn, m, mek, { from, q, reply, config }) => {
    try {
        if (!q) return await reply("❌ කරුණාකර චිත්‍රපටයේ නම ඇතුළත් කරන්න! (උදා: .movie Avatar)");

        await reply(`⏳ *${q}* සොයමින් පවතී. කරුණාකර රැඳී සිටින්න...`);

        // වඩාත් ස්ථාවර API එකක්
        const apiURL = `https://api.p-asitha.online/download/movie?q=${encodeURIComponent(q)}`; 
        
        const res = await axios.get(apiURL);
        const data = res.data;

        // දත්ත ලැබී ඇත්දැයි පරීක්ෂා කිරීම
        if (!data || !data.status || !data.result || !data.result.dl_link) {
            // API එක මාරු වුණොත් දෙවන ක්‍රමයක් ලෙස මෙය උත්සාහ කරයි
            return await reply("❌ චිත්‍රපටය සොයා ගැනීමට නොහැකි විය. කරුණාකර නම නිවැරදිදැයි පරීක්ෂා කරන්න.");
        }

        const movieData = data.result;
        const movieTitle = movieData.title || q;
        const downloadUrl = movieData.dl_link;
        const fileSize = movieData.size || "Unknown";

        await reply(`✅ *සොයාගත්තා Shan:* ${movieTitle}\n📦 *ප්‍රමාණය:* ${fileSize}\n\nදැන් Document එකක් ලෙස එවමින් පවතී...`);

        // Document එකක් ලෙස යැවීම
        return await conn.sendMessage(from, { 
            document: { url: downloadUrl }, 
            mimetype: 'video/mp4', 
            fileName: `${movieTitle}.mp4`,
            caption: `🎥 *Movie:* ${movieTitle}\n⚖️ *Size:* ${fileSize}\n\n*SHAN-MD*`
        }, { quoted: mek });

    } catch (e) {
        console.log("Error details:", e.message);
        await reply("⚠️ තාක්ෂණික දෝෂයක් සිදු විය. API සර්වර් එකේ ගැටලුවක් විය හැක.");
    }
});
  
