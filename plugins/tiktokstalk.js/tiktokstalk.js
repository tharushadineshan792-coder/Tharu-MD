const axios = require('axios');

async function tiktokStalk(conn, mek, m, { from, q, reply }) {
    try {
        if (!q) return reply("කරුණාකර TikTok Username එකක් ඇතුළත් කරන්න. (උදා: .ttstalk khaby.lame)");

        await reply("විස්තර සොයමින් පවතී... 🔍");

        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/stalk/tiktok?username=${q}`);
        
        const data = response.data.result;

        if (!data) return reply("සමාවන්න, ඒ Username එකට අදාළ විස්තර සොයාගත නොහැකි විය.");

        let message = `*📱 TIKTOK PROFILE INFO 📱*\n\n`;
        message += `*👤 Name:* ${data.nickname}\n`;
        message += `*🆔 Username:* @${data.username}\n`;
        message += `*👥 Followers:* ${data.followers}\n`;
        message += `*❤️ Following:* ${data.following}\n`;
        message += `*👍 Total Likes:* ${data.likes}\n`;
        message += `*📝 Bio:* ${data.bio || 'නැත'}\n\n`;
        message += `Shan TikTok Details 👻🧠`;

        // ප්‍රෝෆයිල් පින්තූරයත් එක්කම මැසේජ් එක යවමු
        if (data.profile) {
            await conn.sendMessage(from, { image: { url: data.profile }, caption: message }, { quoted: mek });
        } else {
            await reply(message);
        }

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, විස්තර සෙවීමේදී දෝෂයක් සිදු වුණා. Username එක නිවැරදිදැයි බලන්න.");
    }
}

module.exports = {
    name: "ttstalk",
    alias: ["tiktokstalk", "tiktok"],
    category: "search",
    desc: "TikTok ගිණුමක විස්තර ලබාගැනීම",
    use: ".ttstalk [username]",
    filename: __filename,
    execute: tiktokStalk
};
      
