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
        // චිත්‍රපටයේ නම ලබා දී නැතිනම් මෙම පණිවිඩය පෙන්වයි
        if (!q) return await reply("කරුණාකර චිත්‍රපටයේ නම ලබා දෙන්න. (උදා: .sinhalasub Avatar)");

        await reply(`⌛ "${q}" සොයමින් පවතියි...`);

        const apiURL = `https://api-dark-shan-yt.koyeb.app/movie/sinhalasub-download?q=${encodeURIComponent(q)}`;
        const res = await axios.get(apiURL);
        
        if (!res.data || !res.data.result) {
            return await reply("❌ චිත්‍රපටය සොයා ගැනීමට නොහැකි විය.");
        }

        const data = res.data.result;

        let desc = `✨ *${data.title}* ✨\n\n` +
                   `▫️ 📅 *Year* ➜ ${data.date || 'N/A'}\n` +
                   `▫️ ⭐ *IMDb* ➜ ${data.rating || 'N/A'}\n` +
                   `▫️ ⏳ *Runtime* ➜ ${data.runtime || 'N/A'}\n` +
                   `▫️ 🌍 *Country* ➜ ${data.country || 'N/A'}\n` +
                   `▫️ 🎭 *Genres* ➜ ${data.genres || 'N/A'}\n` +
                   `▫️ 🎧 *Language* ➜ Sinhala Subtitles\n\n` +
                   `▫️ ⚖️ *Size* ➜ ${data.size || 'Unknown'}\n\n` +
                   `> *Hey I am Shan Movie assistant 👻🧠*`;

        // චිත්‍රපටයේ Poster එක සහ විස්තර යැවීම
        if (data.image) {
            await conn.sendMessage(from, { 
                image: { url: data.image }, 
                caption: desc 
            }, { quoted: mek });
        } else {
            await reply(desc);
        }

        // චිත්‍රපටය Document එකක් ලෙස යැවීම
        if (data.dl_link) {
            return await conn.sendMessage(from, {
                document: { url: data.dl_link },
                mimetype: 'video/mp4',
                fileName: `${data.title}.mp4`,
                caption: `🎬 *${data.title}*\n⚖️ ${data.size}\n\n*SHAN-MD MOVIE DOWNLOADER*`
            }, { quoted: mek });
        } else {
            await reply("⚠️ චිත්‍රපටය ඩවුන්ලෝඩ් කිරීමට ලින්ක් එකක් හමු වුණේ නැත.");
        }

    } catch (e) {
        console.log("Error Details: ", e);
        await reply("⚠️ තාක්ෂණික දෝෂයක් සිදු විය. පසුව උත්සාහ කරන්න.");
    }
});
          
