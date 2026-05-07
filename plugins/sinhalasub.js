const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "sinhalasub",
    alias: ["ssub", "slsub"],
    use: '.sinhalasub <movie name>',
    react: "🎬",
    desc: "Search and download movies from sinhalasub",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("කරුණාකර චිත්‍රපටයේ නම ලබා දෙන්න. (උදා: .sinhalasub Avatar)");

        await reply(`⌛ "${q}" සොයමින් පවතියි...`);

        const apiURL = `https://api-dark-shan-yt.koyeb.app/movie/sinhalasub-download?q=${encodeURIComponent(q)}`;
        const res = await axios.get(apiURL);
        
        // API දත්ත තිබේදැයි ඉතා හොඳින් පරීක්ෂා කිරීම
        if (!res.data || !res.data.result) {
            return await reply("❌ සමාවන්න, මෙම චිත්‍රපටය සොයා ගැනීමට නොහැකි විය.");
        }

        const data = res.data.result;

        // දත්ත නැතිනම් Error නොවී 'N/A' පෙන්වීමට සකසා ඇත
        let desc = `✨ *${data.title || q}* ✨\n\n` +
                   `▫️ 📅 *Year* ➜ ${data.date || 'N/A'}\n` +
                   `▫️ ⭐ *IMDb* ➜ ${data.rating || 'N/A'}\n` +
                   `▫️ ⏳ *Runtime* ➜ ${data.runtime || 'N/A'}\n` +
                   `▫️ 🌍 *Country* ➜ ${data.country || 'N/A'}\n` +
                   `▫️ 🎭 *Genres* ➜ ${data.genres || 'N/A'}\n` +
                   `▫️ 🎧 *Language* ➜ Sinhala Subtitles\n\n` +
                   `▫️ ⚖️ *Size* ➜ ${data.size || 'Unknown'}\n\n` +
                   `> *Hey I am Shan Movie assistant 👻🧠*`;

        // පින්තූරය ඇත්නම් පමණක් යැවීම
        if (data.image) {
            await conn.sendMessage(from, { image: { url: data.image }, caption: desc }, { quoted: mek });
        } else {
            await reply(desc);
        }

        // ඩවුන්ලෝඩ් ලින්ක් එක ඇත්නම් පමණක් Document එක යැවීම
        if (data.dl_link) {
            await conn.sendMessage(from, {
                document: { url: data.dl_link },
                mimetype: 'video/mp4',
                fileName: `${data.title || q}.mp4`,
                caption: `🎬 *${data.title || q}*\n⚖️ ${data.size || 'N/A'}\n\n*SHAN-MD MOVIE DOWNLOADER*`
            }, { quoted: mek });
        }

    } catch (e) {
        console.log("Error Log:", e.message);
        await reply("⚠️ සර්වර් එකේ පොඩි දෝෂයක්. කරුණාකර නැවත උත්සාහ කරන්න.");
    }
});
            
