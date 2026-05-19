const config = require('../config'),
  { cmd, commands } = require('../command'),
  axios = require('axios'),
  sharp = require('sharp'),
  fg = require('api-dylux'),
  fetch = (..._0x528df7) =>
    import('node-fetch').then(({ default: _0x1863f6 }) =>
      _0x1863f6(..._0x528df7)
    ),
  { Buffer } = require('buffer');

// රූපවල ප්‍රමාණය වෙනස් කරන function එක
async function resizeImage(buffer, width, height) {
  try {
    return await sharp(buffer).resize(width, height).toBuffer();
  } catch (e) {
    return buffer;
  }
}

//---------------------------------------------
// CINEMAX SEARCH
//---------------------------------------------
cmd({
  pattern: "cinemax",
  react: '🎬',
  category: "movie",
  desc: "Search Movies from Cinemax",
  use: ".cinemax 2025",
  filename: __filename
},
async (conn, m, mek, { from, q, prefix, isPre, isMe, isSudo, isOwner, reply }) => {
    try {
        const isAuthorized = isMe || isOwner || isSudo || isPre;
        if (!isAuthorized) {
            const { data } = await axios.get('https://nadeen-botzdatabse.vercel.app/data.json');
            return await conn.sendMessage(from, { text: data.freemsg }, { quoted: mek });
        }

        if (!q) return reply("*❗ කරුණාකර Movie නමක් ලබා දෙන්න.*");

        const res = await axios.get('https://cinemaxlk.vercel.app/data/tvshows.json');
        const allData = res.data;

        // සෙවුමට ගැලපෙන Movies සහ ඒවායේ Index එක ලබාගැනීම
        let results = [];
        allData.forEach((item, index) => {
            if (item.title.toLowerCase().includes(q.toLowerCase())) {
                results.push({ ...item, arrayIndex: index });
            }
        });

        if (results.length === 0) {
            return reply("*❌ කිසිදු ප්‍රතිඵලයක් හමු නොවීය!*");
        }

        let msg = `_*CINEMAX MOVIE SEARCH 🎬*_\n\n*Input:* ${q}`;

        if (config.BUTTON === "true" || config.BUTTON === true) {
            const rows = results.map(v => ({
                title: v.title,
                // Title එක වෙනුවට Array Index එක යවයි
                id: `${prefix}cmaxinfo ${v.arrayIndex}` 
            }));

            const listButtons = {
                title: "🎬 Select Movie",
                sections: [{ title: "Results", rows }]
            };

            await conn.sendMessage(from, {
                image: { url: results[0].image || config.LOGO },
                caption: msg,
                footer: config.FOOTER,
                buttons: [{
                    buttonId: "cmax_list",
                    buttonText: { displayText: "🎥 Select Movie" },
                    type: 4,
                    nativeFlowInfo: {
                        name: "single_select",
                        paramsJson: JSON.stringify(listButtons)
                    }
                }],
                headerType: 1,
                viewOnce: true
            }, { quoted: mek });

        } else {
            let rows = results.map(v => ({
                title: v.title,
                rowId: `${prefix}cmaxinfo ${v.arrayIndex}`
            }));

            await conn.listMessage(from, {
                text: msg,
                footer: config.FOOTER,
                title: "Cinemax Results",
                buttonText: "Select Movie 🔢",
                sections: [{ title: "Results", rows }]
            }, mek);
        }
    } catch (e) {
        console.error(e);
        reply("*Error ❗*");
    }
});

//---------------------------------------------
// CINEMAX INFO (Using Index for Accuracy)
//---------------------------------------------
cmd({
  pattern: "cmaxinfo",
  react: 'ℹ️',
  category: "movie",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
    try {
        if (!q) return;

        const res = await axios.get('https://cinemaxlk.vercel.app/data/tvshows.json');
        
        // Index එක මගින් නිවැරදි Movie එක ලබාගැනීම
        const index = parseInt(q);
        const movie = res.data[index];

        if (!movie) return reply("*❌ විස්තර සොයාගත නොහැකි විය!*");

        let infoMsg = `*🎬 Movie Title:* ${movie.title}\n\n*බාගත කිරීමට අවශ්‍ය ලින්ක් එක තෝරන්න:*`;

        if (config.BUTTON === "true" || config.BUTTON === true) {
            const rows = movie.episodes.map((ep, epIndex) => ({
                title: `Download Link ${ep.episode || epIndex + 1}`,
                id: `${prefix}cmaxdl ${ep.link}±${movie.title}±${ep.episode}±${movie.image}`
            }));

            const listButtons = {
                title: "📥 Select Link",
                sections: [{ title: "Download Links", rows }]
            };

            await conn.sendMessage(from, {
                image: { url: movie.image },
                caption: infoMsg,
                footer: config.FOOTER,
                buttons: [{
                    buttonId: "movie_dl",
                    buttonText: { displayText: "📥 Download Options" },
                    type: 4,
                    nativeFlowInfo: {
                        name: "single_select",
                        paramsJson: JSON.stringify(listButtons)
                    }
                }],
                headerType: 1,
                viewOnce: true
            }, { quoted: mek });

        } else {
            let rows = movie.episodes.map((ep, epIndex) => ({
                title: `Download Link ${ep.episode || epIndex + 1}`,
                rowId: `${prefix}cmaxdl ${ep.link}±${movie.title}±${ep.episode}±${movie.image}`
            }));

            await conn.listMessage(from, {
                text: infoMsg,
                footer: config.FOOTER,
                title: "Cinemax Download",
                buttonText: "Choose Option 🔢",
                sections: [{ title: "Links", rows }]
            }, mek);
        }
    } catch (e) {
        console.error(e);
        reply("*❌ දෝෂයක් සිදු විය!*");
    }
});

//---------------------------------------------
// CINEMAX DOWNLOADER
//---------------------------------------------
cmd({
    pattern: "cmaxdl",
    react: '📥',
    category: "movie",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return;
        let [url, title, epNum, img] = q.split("±");

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        let finalLink = url;

        // Google Drive ලින්ක් පරීක්ෂාව
        if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
            try {
                let driveUrl = url.replace('https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/file/d/').split('&')[0] + '/view';
                let res = await fg.GDriveDl(driveUrl);
                if (res && res.downloadUrl) finalLink = res.downloadUrl;
            } catch (err) { console.log(err); }
        }

        let thumbBuffer = null;
        try {
            const imgRes = await axios.get(img, { responseType: 'arraybuffer' });
            thumbBuffer = await resizeImage(Buffer.from(imgRes.data), 200, 200);
        } catch (e) { thumbBuffer = null; }

        await conn.sendMessage(config.JID || from, {
            document: { url: finalLink },
            mimetype: "video/mp4",
            fileName: `${title}.mp4`,
            jpegThumbnail: thumbBuffer,
            caption: `*🎬 Movie: ${title}*\n\n> *Nadeen-MD Movie Downloader*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("*❌ බාගත කිරීමේ දෝෂයක් සිදු විය!*");
    }
});
