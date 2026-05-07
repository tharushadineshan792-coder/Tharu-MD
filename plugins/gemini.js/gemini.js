const axios = require('axios');

async function geminiAI(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර ප්‍රශ්නයක් ඇතුළත් කරන්න. (උදා: .gemini hello)");

        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/ai/gemini?text=${encodeURIComponent(q)}`);
        
        // API එකෙන් ලැබෙන දත්ත පරීක්ෂා කිරීම
        const result = response.data.result || response.data.data;

        if (!result) {
            return reply("සමාවන්න, AI එකෙන් පිළිතුරක් ලැබුණේ නැහැ. API සර්වර් එකේ ප්‍රශ්නයක් විය හැක.");
        }

        const finalMessage = `Hey I am Shan Gemini AI assistant 👻🧠\n\n${result}`;
        await reply(finalMessage);

    } catch (e) {
        console.log(e);
        // මොකක් හරි අවුලක් නම් ඒක මෙතනින් දැනගන්න පුළුවන්
        await reply("දෝෂයක් සිදු වුණා: " + e.message);
    }
}

module.exports = {
    name: "gemini",
    alias: ["ai", "shan-ai"],
    category: "ai",
    desc: "Gemini AI සමඟ චැට් කරන්න",
    use: ".gemini [text]",
    filename: __filename,
    execute: geminiAI
};
