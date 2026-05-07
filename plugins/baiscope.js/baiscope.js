const axios = require('axios');

async function baiscopeDownload(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර චිත්‍රපටයේ නම හෝ Baiscope ලින්ක් එක ලබා දෙන්න. (උදා: .baiscope Avatar)");

        await reply("Baiscope.lk වෙතින් විස්තර සොයමින් පවතී... 🎬");

        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/movie/baiscopes-download?url=${encodeURIComponent(q)}`);
        
        const data = response.data.result;

        if (!data) return reply("සමාවන්න, ඒ නමින් චිත්‍රපටයක් හෝ උපසිරැසියක් සොයාගත නොහැකි විය.");

        // මැසේජ් එක ලස්සනට Format කරමු
        let message = `🎬 *BAISCOPE MOVIE SEARCH* 🎬\n\n`;
        message += `*📛 Title:* ${data.title || 'N/A'}\n`;
        message += `*📅 Date:* ${data.date || 'N/A'}\n`;
        message += `*⭐ Rating:* ${data.rating || 'N/A'}\n\n`;
        message += `*📥 DOWNLOAD LINKS:* \n${data.links || 'ලින්ක් සොයාගත නොහැකි විය'}\n\n`;
        message += `*Shan movie Downloader 👻🧠*`;

        // Poster එක තියෙනවා නම් ඒකත් එක්කම යවමු
        if (data.image) {
            await conn.sendMessage(from, { image: { url: data.image }, caption: message }, { quoted: mek });
        } else {
            await reply(message);
        }

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, Baiscope විස්තර ලබා ගැනීමේදී දෝෂයක් සිදු වුණා.");
    }
}

module.exports = {
    name: "baiscope",
    alias: ["bs", "sub"],
    category: "download",
    desc: "Baiscope.lk හරහා උපසිරැසි සහ ෆිල්ම් ලින්ක් ලබාගැනීම",
    use: ".baiscope [name/link]",
    filename: __filename,
    execute: baiscopeDownload
};
          
