const { cmd, commands } = require('../command');
const axios = require('axios');

// 1. Search Command (.cinesubz)
cmd({
    pattern: "cinesubz",
    alias: ["csz", "cz"],
    use: '.cinesubz <movie_name>',
    react: "🔍",
    desc: "Search movies from Cinesubz.lk",
    category: "download",
    filename: __filename
},
async (conn, m, mek, { from, q, reply, config }) => {
    try {
        if (!q) return await reply("❌ කරුණාකර සෙවිය යුතු චිත්‍රපටයේ නම ඇතුළත් කරන්න.");

        await reply("🔎 Cinesubz පද්ධතිය තුළ සොයමින් පවතී...");

        const searchURL = `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-search?q=${encodeURIComponent(q)}`;
        const searchRes = await axios.get(searchURL);
        const searchData = searchRes.data;

        if (!searchData.status || !searchData.result || searchData.result.length === 0) {
            return await reply("❌ එවැනි චිත්‍රපටයක් සොයා ගැනීමට නොහැකි විය.");
        }

        let msg = "🎬 *CINESUBZ MOVIE SEARCH* 🎬\n\n";
        searchData.result.map((movie, index) => {
            msg += `*${index + 1}.* ${movie.title}\n`;
        });

        msg += "\nℹ️ *විස්තර සහ Download ලබා ගැනීමට අදාළ URL එක සමඟ මෙසේ එවන්න:* \n.cszinfo [movie_url]";
        await reply(msg);

    } catch (e) {
        console.log("Error:", e.message);
        await reply("⚠️ සර්වර් දෝෂයක්. පසුව උත්සාහ කරන්න.");
    }
});

// 2. Info & Fancy Download Command (.cszinfo)
cmd({
    pattern: "cszinfo",
    desc: "Get movie details and download from Cinesubz",
    category: "download",
    filename: __filename
},
async (conn, m, mek, { from, q, reply, config }) => {
    try {
        if (!q) return await reply("❌ කරුණාකර Movie URL එක ලබා දෙන්න.");

        await reply("📑 විස්තර සහ Download Link සකස් කරමින් පවතී...");

        const infoURL = `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${q}`;
        const infoRes = await axios.get(infoURL);
        const infoData = infoRes.data;

        if (!infoData.status || !infoData.result) {
            return await reply("❌ විස්තර සොයා ගැනීමට නොහැකි විය.");
        }

        const movie = infoData.result;

        // අලංකාරව සකස් කළ විස්තර (Captions)
        let caption = `🎬 *Title ➜ ${movie.title}* \n\n`;
        caption += `🗓️ *Year* ➜ ${movie.date || 'N/A'}\n`;
        caption += `🌟 *IMDB* ➜ ${movie.rating || 'N/A'}\n`;
        caption += `⏳ *Runtime* ➜ ${movie.runtime || 'N/A'}\n`;
        caption += `🌍 *Country* ➜ ${movie.country || 'N/A'}\n`;
        caption += `💎 *Quality* ➜ WEB-DL\n`;
        caption += `🎬 *Director* ➜ ${movie.director || 'N/A'}\n`;
        caption += `🎧 *Language* ➜ ${movie.language || 'Sinhala Subtitles'}\n\n`;
        caption += `📦 *Size* ➜ ${movie.size || 'Unknown'}\n\n`;
        caption += `> *SHAN-MD Cinesubz Downloader* 🚀`;

        // පින්තූරය ඇත්නම් එය සමඟ විස්තර යැවීම
        if (movie.image || movie.thumbnail) {
            await conn.sendMessage(from, { 
                image: { url: movie.image || movie.thumbnail }, 
                caption: caption 
            }, { quoted: mek });
        } else {
            await reply(caption);
        }

        // Document එකක් ලෙස වීඩියෝව යැවීම
        return await conn.sendMessage(from, {
            document: { url: movie.dl_link },
            mimetype: 'video/mp4',
            fileName: `${movie.title}.mp4`,
            caption: `🎬 *Movie:* ${movie.title}\n📦 *Size:* ${movie.size}\n\n*SHAN-MD*`
        }, { quoted: mek });

    } catch (e) {
        console.log("Error:", e.message);
        await reply("⚠️ දත්ත ලබා ගැනීමේදී ගැටලුවක් මතු විය.");
    }
});
