const axios = require('axios');

async function chatgpt(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර ප්‍රශ්නයක් ඇතුළත් කරන්න. (උදා: .gpt hello)");

        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/ai/chatgpt?text=${encodeURIComponent(q)}`);
        
        // API එකෙන් ලැබෙන උත්තරය ලබා ගැනීම
        const result = response.data.result || response.data.data || "පිළිතුරක් ලබා ගැනීමට නොහැකි විය.";
        
        // ඔයා ඉල්ලපු විදිහට Assistant මැසේජ් එක සැකසීම
        const finalMessage = `Hey I am Shan ChatGPT AI assistant 👻🧠\n\n${result}`;
        
        await reply(finalMessage);

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, ChatGPT API එකේ දෝෂයක් තියෙනවා.");
    }
}

module.exports = {
    name: "chatgpt",
    alias: ["gpt", "ai2"],
    category: "ai",
    desc: "ChatGPT සමඟ චැට් කරන්න",
    use: ".chatgpt [ප්‍රශ්නය]",
    filename: __filename,
    execute: chatgpt
};
