const axios = require('axios');

async function gemini(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර ප්‍රශ්නයක් ඇතුළත් කරන්න. (උදා: .gemini hello)");

        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/ai/gemini?text=${encodeURIComponent(q)}`);
        
        // API එකෙන් ලැබෙන උත්තරය ලබා ගැනීම
        const result = response.data.result || response.data.data || "පිළිතුරක් ලබා ගැනීමට නොහැකි විය.";
        
        // ඔයා අන්තිමට ඉල්ලපු විදිහට "Assistant" කියලා වෙනස් කළා
        const finalMessage = `Hey I am Shan Gemini AI assistant 👻🧠\n\n${result}`;
        
        await reply(finalMessage);

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, API එකේ දෝෂයක් තියෙනවා.");
    }
}

module.exports = {
    name: "gemini",
    alias: ["ai", "bot"],
    category: "ai",
    desc: "Gemini AI සමඟ චැට් කරන්න",
    use: ".gemini [ප්‍රශ්නය]",
    filename: __filename,
    execute: gemini
};
