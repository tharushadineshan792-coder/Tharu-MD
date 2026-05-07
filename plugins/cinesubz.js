const axios = require('axios');

async function cineSubz(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර චිත්‍රපටයේ නම ලබා දෙන්න. (උදා: .cinesubz Avatar)");

        await reply("විස්තර සොයමින් පවතී... 🎬");

        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${encodeURIComponent(q)}`);
        const data = response.data.result;

        if (!data) return reply("සමාවන්න, ඒ නමින් චිත්‍රපටයක් සොයාගත නොහැකි විය.");

        // ලස්සනට විස්තර ටික පෙළගස්වමු
        let message = `🎬 *${data.title}*\n\n`;
        message += `📅 *Year:* ${data.date || 'N/A'}\n`;
        message += `⭐ *IMDb:* ${data.rating || 'N/A'}\n`;
        message += `⌛ *Runtime:* ${data.runtime || 'N/A'}\n`;
        message += `🌍 *Country:* ${data.country || 'N/A'}\n`;
        message += `🎧 *Language:* Sinhala Subtitles\n\n`;
        message += `📥 *DOWNLOAD LINKS:* \n${data.links}\n\n`;
        message += `*Shan Movie Downloader 👻🧠*`;

        // චිත්‍රපටයේ Poster එක තියෙනවා නම් ඒකත් එක්කම යවමු
        if (data.image) {
            await conn.sendMessage(from, { image: { url: data.image }, caption: message }, { quoted: mek });
        } else {
            await reply(message);
        }

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, විස්තර ලබා ගැනීමේදී දෝෂයක් සිදු වුණා.");
    }
}

module.exports = {
    name: "cinesubz",
    alias: ["movie", "cine"],
    category: "download",
    desc: "CineSubz හරහා ෆිල්ම් ලින්ක් ලබාගැනීම",
    use: ".cinesubz [movie name]",
    filename: __filename,
    execute: cineSubz
};
          
