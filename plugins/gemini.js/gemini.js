const axios = require('axios');

async function gemini(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර ප්‍රශ්නයක් ඇතුළත් කරන්න. (උදා: .gemini hello)");

        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/ai/gemini?text=${encodeURIComponent(q)}`);
        
        // API එකෙන් ලැබෙන උත්තරය ගෙන Reply කරනවා
        const result = response.data.result || response.data.data || "පිළිතුරක් ලබා ගැනීමට නොහැකි විය.";
        await reply(result);

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, API එකේ දෝෂයක් තියෙනවා.");
    }
}

// මේක බොට්ගේ command එක විදිහට register කරනවා
module.exports = {
    name: "gemini",
    alias: ["ai", "bot"],
    category: "ai",
    desc: "Gemini AI සමඟ චැට් කරන්න",
    use: ".gemini [ප්‍රශ්නය]",
    filename: __filename,
    execute: gemini
};
