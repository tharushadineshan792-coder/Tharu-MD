const axios = require('axios');

async function picsartEnhance(conn, mek, m, { from, reply, quoted, mtype }) {
    try {
        // පින්තූරයක් Reply කරලා තියෙනවද කියලා බලනවා
        if (!quoted || (mtype !== 'imageMessage' && !quoted.imageMessage)) {
            return reply("කරුණාකර Quality එක වැඩි කිරීමට අවශ්‍ය පින්තූරයක් Mention (Reply) කර .enhance ලෙස ලබා දෙන්න.");
        }

        await reply("පින්තූරයේ Quality එක වැඩි කරමින් පවතී, කරුණාකර රැඳී සිටින්න... ✨");

        // බොට් පින්තූරය Download කරගන්නවා
        const imgBuffer = await conn.downloadMediaMessage(quoted);
        
        // පින්තූරය API එකට යවන්න පුළුවන් Link එකක් බවට පත් කරන තැනක් මෙතනට අවශ්‍යයි
        // සාමාන්‍යයෙන් ඔයාගේ බොට් එකේ img2url වගේ Function එකක් ඇති.
        // පහත තියෙන්නේ සරලවම API එකට Link එකක් හරහා Request එක යවන විදිහයි.
        
        // සටහන: මේ API එක වැඩ කරන්නේ Image URL එකක් හරහා නම්:
        const imageUrl = "ඔයාගේ_image_url_එක"; // මෙතනට image upload කරලා ලින්ක් එක ගන්න ඕනේ
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/ai/picsart-enhance?url=${encodeURIComponent(imageUrl)}`);
        
        const enhancedImg = response.data.result || response.data.data;

        if (!enhancedImg) return reply("සමාවන්න, පින්තූරය Enhance කිරීමට නොහැකි විය.");

        // පින්තූරය නැවත එවන්න
        await conn.sendMessage(from, { 
            image: { url: enhancedImg }, 
            caption: `*PicsArt AI Enhance Success* ✅\n\nShan Enhance AI  👻🧠` 
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, පින්තූරය සකස් කිරීමේදී දෝෂයක් සිදු වුණා.");
    }
}

module.exports = {
    name: "enhance",
    alias: ["upscale", "hd"],
    category: "ai",
    desc: "පින්තූරවල Quality එක වැඩි කරන්න",
    use: ".enhance [reply image]",
    filename: __filename,
    execute: picsartEnhance
};
                         
