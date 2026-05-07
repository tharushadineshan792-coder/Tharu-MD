const axios = require('axios');

// Command එක ඇතුළේ ලියන්න ඕන කොටස
async (chat, text) => {
    if (!text) return chat.reply("කරුණාකර ප්‍රශ්නයක් ඇතුළත් කරන්න.");

    try {
        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/ai/gemini?text=${encodeURIComponent(text)}`);
        
        // API එකෙන් ලැබෙන උත්තරය (මෙම response එක API එකේ structure එක අනුව වෙනස් විය හැක)
        const aiResponse = response.data.result; 
        
        await chat.reply(aiResponse);
    } catch (e) {
        console.log(e);
        await chat.reply("සමාවන්න, AI එක සම්බන්ධ කරගැනීමේ දෝෂයක් තියෙනවා.");
    }
          }
