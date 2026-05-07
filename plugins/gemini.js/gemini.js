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
        if (!q) return await reply("කරුණාකර ප්‍රශ්නයක් ලබා දෙන්න. (උදා: .gemini සූර්යයා යනු කුමක්ද?)");

        await reply("Gemini AI සිතමින් පවතියි... 🤔");

        const apiURL = `https://api-dark-shan-yt.koyeb.app/ai/gemini?text=${encodeURIComponent(q)}`;
        
        // API Request එක
        const res = await axios.get(apiURL);
        
        // පරීක්ෂා කිරීම සඳහා Console එකට දත්ත යවමු (Koyeb Logs බලන්න)
        console.log("API Response Status:", res.status);
        console.log("API Data:", res.data);

        // දත්ත තිබේදැයි බලමු
        let result = res.data.result || res.data.data;

        if (!result) {
            return await reply("සමාවන්න, API එකෙන් පිළිතුරක් ලැබුණේ නැහැ. පසුව උත්සාහ කරන්න.");
        }

        let responseMsg = `✨ *GEMINI AI ASSISTANT* ✨\n\n` +
                          `${result}\n\n` +
                          `> *Hey I am Shan Gemini AI assistant 👻🧠*`;

        await reply(responseMsg);

    } catch (e) {
        // Error එක හරියටම මොකක්ද කියලා Reply එකේම පෙන්වමු
        console.log("Detailed Error:", e);
        await reply(`⚠️ තාක්ෂණික දෝෂයක්: ${e.message}`);
    }
});
        
