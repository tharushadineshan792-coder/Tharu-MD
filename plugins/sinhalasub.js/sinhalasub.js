const axios = require('axios');

async function sinhalaSub(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර චිත්‍රපටයේ නම හෝ SinhalaSub ලින්ක් එක ලබා දෙන්න. (උදා: .sinhalasub Avatar)");

        await reply("SinhalaSub.lk වෙතින් විස්තර සොයමින් පවතී... 🎬");

        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/movie/sinhalasub-download?url=${encodeURIComponent(q)}`);
        
        const data = response.data.result;

        if (!data) return reply("සමාවන්න, ඒ නමින් චිත්‍රපටයක් සොයාගත නොහැකි විය.");

        // මැසේජ් එක ලස්සනට Format කරමු
        let message = `🎬 *SINHALASUB MOVIE SEARCH* 🎬\n\n`;
        message += `*📛 Title:* ${data.title || 'N/A'}\n`;
        message += `*📅 Year:* ${data.date || 'N/A'}\n`;
        message += `*⭐ Rating:* ${data.rating || 'N/A'}\n`;
        message += `*🎭 Genres:* ${data.genres || 'N/A'}\n\n`;
        message += `*📥 DOWNLOAD LINKS:* \n${data.links || 'ලින්ක් සොයාගත නොහැකි විය'}\n\n`;
        message += `*Shan movie Downloader 👻🧠*`;

        // චිත්‍රපටයේ Poster එක තියෙනවා නම් ඒකත් එක්කම යවමු
        if (data.image) {
            await conn.sendMessage(from, { image: { url: data.image }, caption: message }, { quoted: mek });
        } else {
            await reply(message);
        }

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, මට එම චිත්‍රපටයේ විස්තර ලබා ගැනීමට නොහැකි වුණා.");
    }
}

module.exports = {
    name: "sinhalasub",
    alias: ["ssub", "slsub"],
    category: "download",
    desc: "SinhalaSub.lk හරහා ෆිල්ම් ලින්ක් ලබාගැනීම",
    use: ".sinhalasub [movie name/link]",
    filename: __filename,
    execute: sinhalaSub
};
                                  
