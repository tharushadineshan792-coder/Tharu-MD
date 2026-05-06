const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "movie",
    alias: ["cinesubz", "mvid"],
    use: '.movie <movie name>',
    react: "🎬",
    desc: "Download movies from CineSubz as documents",
    category: "download",
    filename: __filename
},
async (conn, m, mek, { from, q, reply, config }) => {
    try {
        if (!q) return await reply("❌ කරුණාකර චිත්‍රපටයේ නම ඇතුළත් කරන්න! (උදා: .movie Avatar)");

        await reply(`⏳ *${q}* CineSubz හරහා සොයමින් පවතී...`);

        // GiftedTech API එක භාවිතා කිරීම
        const apiURL = `https://api.giftedtech.my.id/api/download/cinesubz?search=${encodeURIComponent(q)}&apikey=gifted`;
        
        const res = await axios.get(apiURL);
        const data = res.data;

        // API එකෙන් ලැබෙන දත්ත පරීක්ෂා කිරීම (Gifted API එකේ සාමාන්‍යයෙන් result ඇතුලේ තමයි දත්ත එන්නේ)
        if (!data || !data.result || !data.result.download_url) {
            return await reply("❌ මෙම චිත්‍රපටය සොයා ගැනීමට නොහැකි විය. වෙනත් නමකින් උත්සාහ කරන්න.");
        }

        const downloadUrl = data.result.download_url;
        const movieTitle = data.result.title || q;

        await reply(`✅ *සොයාගත්තා Shan:* ${movieTitle}\n\nදැන් Document එකක් ලෙස එවමින් පවතී. මඳ වෙලාවක් රැඳී සිටින්න...`);

        // ඩොකියුමන්ට් එකක් ලෙස යැවීම
        return await conn.sendMessage(from, { 
            document: { url: downloadUrl }, 
            mimetype: 'video/mp4', 
            fileName: `${movieTitle}.mp4`,
            caption: `🎥 *Movie:* ${movieTitle}\n\n*SHAN-MD Movie Downloader*`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await reply("⚠️ API එකේ හෝ සම්බන්ධතාවයේ දෝෂයක් සිදු විය.");
    }
});
