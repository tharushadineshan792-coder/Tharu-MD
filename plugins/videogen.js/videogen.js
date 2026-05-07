const axios = require('axios');

async function videoGen(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර ඔබට අවශ්‍ය වීඩියෝව ගැන විස්තරයක් ලබා දෙන්න. (උදා: .videogen a beautiful sunset over the ocean)");

        // වීඩියෝ එකක් හදන්න සෑහෙන වෙලාවක් යන නිසා මේ මැසේජ් එක වැදගත්
        await reply("ඔබේ වීඩියෝව නිර්මාණය වෙමින් පවතී. මේ සඳහා විනාඩියක් පමණ ගත විය හැක, කරුණාකර රැඳී සිටින්න... 🎬");

        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/ai/video-gen?text=${encodeURIComponent(q)}`);
        
        // API එකෙන් ලැබෙන වීඩියෝ ලින්ක් එක ලබා ගැනීම
        const videoUrl = response.data.result || response.data.data;

        if (!videoUrl) return reply("සමාවන්න, වීඩියෝව නිර්මාණය කිරීමට නොහැකි විය.");

        // වීඩියෝව WhatsApp හරහා යැවීම
        await conn.sendMessage(from, { 
            video: { url: videoUrl }, 
            caption: `*AI Video Generation Success* ✅\n\n*Prompt:* ${q}\n\nHey I am Shan VideoGen AI assistant 👻🧠`,
            mimetype: 'video/mp4'
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, වීඩියෝව නිර්මාණය කිරීමේදී දෝෂයක් සිදු වුණා. API සර්වර් එක කාර්යබහුල විය හැක.");
    }
}

module.exports = {
    name: "videogen",
    alias: ["vgen", "makevideo"],
    category: "ai",
    desc: "AI මගින් වීඩියෝ නිර්මාණය කරන්න",
    use: ".videogen [text]",
    filename: __filename,
    execute: videoGen
};
  
