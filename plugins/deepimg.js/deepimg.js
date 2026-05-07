const axios = require('axios');

async function deepImg(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර ඔබට අවශ්‍ය පින්තූරය ගැන විස්තරයක් ලබා දෙන්න. (උදා: .deepimg a cat in space)");

        // පින්තූරය හදන්න වෙලාවක් යන නිසා මැසේජ් එකක් දාමු
        await reply("ඔබේ පින්තූරය නිර්මාණය වෙමින් පවතී, කරුණාකර රැඳී සිටින්න... 🎨");

        // API එකට Request එක යවනවා
        const apiUrl = `https://api-dark-shan-yt.koyeb.app/ai/deepimg?text=${encodeURIComponent(q)}`;
        
        // පින්තූරය කෙළින්ම එවන්න
        await conn.sendMessage(from, { 
            image: { url: apiUrl }, 
            caption: `*Deep Image AI Generation Success* ✅\n\n*Prompt:* ${q}\n\nHey I am Shan DeepImg AI assistant 👻🧠` 
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, පින්තූරය නිර්මාණය කිරීමේදී දෝෂයක් සිදු වුණා.");
    }
}

module.exports = {
    name: "deepimg",
    alias: ["imagine", "aiimg", "gen"],
    category: "ai",
    desc: "AI මගින් පින්තූර නිර්මාණය කරන්න",
    use: ".deepimg [text]",
    filename: __filename,
    execute: deepImg
};
