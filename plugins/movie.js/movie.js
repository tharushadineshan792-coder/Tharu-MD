const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "movie",
    alias: ["film", "mvid"],
    use: '.movie <movie name>',
    react: "🎬",
    desc: "Search and download movies as documents",
    category: "download",
    filename: __filename
},
async (conn, m, mek, { from, q, reply, config }) => {
    try {
        if (!q) return await reply("❌ කරුණාකර චිත්‍රපටයේ නම ඇතුළත් කරන්න! \n\nඋදා: .movie Avatar");

        await reply(`⏳ *${q}* සොයමින් පවතී. කරුණාකර රැඳී සිටින්න...`);

        // ⚠️ සටහන: මෙහි පහතින් ඇති API URL එක උදාහරණයක් පමණි. 
        // ඔබේ බොට් එකට ගැලපෙන වැඩ කරන Movie API එකක් මෙතැනට ඇතුළත් කරන්න.
        const apiURL = `https://api.dark-yasiya.site/download/movie?search=${encodeURIComponent(q)}`; 
        
        const res = await axios.get(apiURL);
        const data = res.data;

        // API එකෙන් දත්ත ලැබෙනවාදැයි පරීක්ෂා කිරීම
        if (!data || !data.result || !data.result.dl_link) {
            return await reply("❌ මෙම චිත්‍රපටය සොයා ගැනීමට නොහැකි විය. කරුණාකර නම නිවැරදිදැයි පරීක්ෂා කරන්න.");
        }

        const downloadUrl = data.result.dl_link;
        const movieTitle = data.result.title || q;
        const fileSize = data.result.size || "Unknown";

        await reply(`✅ *සොයාගත්තා:* ${movieTitle}\n📦 *ප්‍රමාණය:* ${fileSize}\n\nදැන් Document එකක් ලෙස එවමින් පවතී. මඳ වෙලාවක් රැඳී සිටින්න...`);

        // Document එකක් ලෙස WhatsApp එකට යැවීම
        return await conn.sendMessage(from, { 
            document: { url: downloadUrl }, 
            mimetype: 'video/mp4', 
            fileName: `${movieTitle}.mp4`,
            caption: `🎥 *${movieTitle}*\n⚖️ *Size:* ${fileSize}\n\n*SHAN-MD Movie Downloader*`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await reply("⚠️ දෝෂයක් සිදු විය. API සර්වර් එකේ ගැටලුවක් විය හැක.");
    }
});
  
