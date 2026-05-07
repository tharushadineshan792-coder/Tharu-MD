const axios = require('axios');

async function cineSubz(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර සොයන චිත්‍රපටයේ නම හෝ CineSubz ලින්ක් එක ලබා දෙන්න. (උදා: .cinesubz Batman)");

        await reply("චිත්‍රපට විස්තර සොයමින් පවතී... 🎬");

        // API එකට Request එක යවනවා
        // සටහන: API එකේ url එකට q එක හෝ link එක pass කරන්න
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${encodeURIComponent(q)}`);
        
        const data = response.data.result;

        if (!data) return reply("සමාවන්න, ඒ නමින් චිත්‍රපටයක් සොයාගත නොහැකි විය.");

        let message = `*🎬 CINESUBZ MOVIE SEARCH 🎬*\n\n`;
        message += `*📛 Title:* ${data.title || 'N/A'}\n`;
        message += `*📅 Release:* ${data.date || 'N/A'}\n\n`;
        message += `*📥 Download Links:* \n${data.links || 'ලින්ක් සොයාගත නොහැකි විය'}\n\n`;
        message += `Shan Movie Downloader 👻🧠`;

        await reply(message);

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, මට ඒ චිත්‍රපටය සොයාගැනීමට නොහැකි වුණා.");
    }
}

module.exports = {
    name: "cinesubz",
    alias: ["movie", "cine"],
    category: "download",
    desc: "CineSubz හරහා ෆිල්ම් ලින්ක් ලබාගැනීම",
    use: ".cinesubz [movie name/link]",
    filename: __filename,
    execute: cineSubz
};
                                            
