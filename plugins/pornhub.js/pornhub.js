const axios = require('axios');

async function phDownload(conn, mek, m, { from, q, reply }) {
    try {
        // ලින්ක් එකක් දීලා නැත්නම්
        if (!q) return reply("කරුණාකර Pornhub වීඩියෝ ලින්ක් එකක් ලබා දෙන්න.");

        // පොඩි මැසේජ් එකක් දාමු වැඩේ පටන් ගත්තා කියලා
        await reply("වීඩියෝව ලබා ගනිමින් පවතී, කරුණාකර රැඳී සිටින්න... ⏳");

        // API එකට Request එක යවනවා
        const response = await axios.get(`https://api-dark-shan-yt.koyeb.app/download/pornhub?url=${encodeURIComponent(q)}`);
        
        // API එකෙන් ලැබෙන දත්ත (මේවා API එකේ structure එක අනුව වෙනස් විය හැක)
        const data = response.data.result;

        if (!data || !data.dl_link) {
            return reply("සමාවන්න, වීඩියෝව ඩවුන්ලෝඩ් කිරීමට ලින්ක් එකක් සොයාගත නොහැකි විය.");
        }

        // වීඩියෝව WhatsApp හරහා යැවීම
        await conn.sendMessage(from, { 
            video: { url: data.dl_link }, 
            caption: `*Pornhub Downloader Success* ✅\n\n*Title:* ${data.title || 'N/A'}\n\nShan PH Downloader 👻🧠`,
            mimetype: 'video/mp4' 
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await reply("සමාවන්න, වීඩියෝව ලබා ගැනීමේදී දෝෂයක් සිදු වුණා. ලින්ක් එක නිවැරදිදැයි බලන්න.");
    }
}

module.exports = {
    name: "ph",
    alias: ["pornhub", "pdl"],
    category: "download",
    desc: "Pornhub වීඩියෝ ඩවුන්ලෝඩ් කරන්න",
    use: ".ph [link]",
    filename: __filename,
    execute: phDownload
};
                    
