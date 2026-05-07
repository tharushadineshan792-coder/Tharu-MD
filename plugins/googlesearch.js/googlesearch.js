const axios = require('axios');

async function googleSearchAI(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර ඔබට දැනගැනීමට අවශ්‍ය දේ ඇතුළත් කරන්න. (උදා: .google ලංකාවේ ලස්සනම තැන්)");

        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/ai/googlesearch?text=${encodeURIComponent(q)}`);
        
        // API එකෙන් ලැබෙන උත්තරය ලබා ගැනීම
        const result = response.data.result || response.data.data || "පිළිතුරක් ලබා ගැනීමට නොහැකි විය.";
        
        // ඔයා ඉල්ලපු විදිහට Assistant මැසේජ් එක සැකසීම
        const finalMessage = `Hey I am Shan GoogleSearch AI assistant 👻🧠\n\n${result}`;
        
        await reply(finalMessage);

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, Google Search AI එකේ දෝෂයක් තියෙනවා.");
    }
}

module.exports = {
    name: "google",
    alias: ["gs", "searchai"],
    category: "ai",
    desc: "Google ඇසුරෙන් AI පිළිතුරු ලබාගැනීම",
    use: ".google [ප්‍රශ්නය]",
    filename: __filename,
    execute: googleSearchAI
};
          
