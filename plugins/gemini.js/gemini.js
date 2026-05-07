const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "gemini",
    alias: ["ai", "shanai"],
    use: '.gemini <your question>',
    react: "🧠",
    desc: "Chat with Gemini AI assistant",
    category: "ai",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        // ප්‍රශ්නයක් ලබා දී නැතිනම් මෙම පණිවිඩය පෙන්වයි
        if (!q) return await reply("කරුණාකර ප්‍රශ්නයක් ලබා දෙන්න. (උදා: .gemini සූර්යයා යනු කුමක්ද?)");

        await reply("Gemini AI සිතමින් පවතියි... 🤔");

        // API එකට Request එක යවනවා
        const apiURL = `https://api-dark-shan-yt.koyeb.app/ai/gemini?text=${encodeURIComponent(q)}`;
        const res = await axios.get(apiURL);
        
        // API එකෙන් ලැබෙන දත්ත පරීක්ෂා කිරීම
        const result = res.data.result || res.data.data;

        if (!result) {
            return await reply("සමාවන්න, පිළිතුරක් ලබා ගැනීමට නොහැකි විය. පසුව උත්සාහ කරන්න.");
        }

        // ලස්සනට Layout එක සකස් කිරීම
        let responseMsg = `✨ *GEMINI AI ASSISTANT* ✨\n\n` +
                          `${result}\n\n` +
                          `> *Hey I am Shan Gemini AI assistant 👻🧠*`;

        await reply(responseMsg);

    } catch (e) {
        console.log("Error Details: ", e);
        await reply("⚠️ තාක්ෂණික දෝෂයක් සිදු විය. API සර්වර් එකේ ගැටළුවක් විය හැක.");
    }
});
          
