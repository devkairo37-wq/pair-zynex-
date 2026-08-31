const {
    proto,
    getContentType,
    jidNormalizedUser,
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');

const sms = (conn, m) => {
    if (!m) return m;
    let M = proto.WebMessageInfo;
    
    if (m.key) {
        m.id = m.key.id;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = jidNormalizedUser(m.fromMe ? conn.user.id : (m.participant ? m.participant : m.key.participant ? m.key.participant : m.chat));
    }
    
    if (m.message) {
        m.mtype = getContentType(m.message);
        
        // Gestion ViewOnce / Ephemeral
        if (m.mtype === 'viewOnceMessageV2' || m.mtype === 'viewOnceMessage') {
             m.message = m.message[m.mtype].message;
             m.mtype = getContentType(m.message);
        }
        
        m.msg = m.message[m.mtype];

        // QUOTED MESSAGE — objet complet avec mtype, text, sender, download(), etc.
        const quotedMessage = m.msg?.contextInfo?.quotedMessage;

        if (quotedMessage) {
            const quotedMtype = getContentType(quotedMessage);
            const quotedMsg = quotedMessage[quotedMtype];
            const quotedParticipant = m.msg.contextInfo.participant;

            m.quoted = {
                message: quotedMessage,
                stanzaId: m.msg.contextInfo.stanzaId,
                participant: quotedParticipant,
                sender: quotedParticipant ? jidNormalizedUser(quotedParticipant) : null,
                mtype: quotedMtype,
                msg: quotedMsg,
                mimetype: quotedMsg?.mimetype || null,
                fileName: quotedMsg?.fileName || null,
                ptt: quotedMsg?.ptt || false,
                text: (quotedMtype === 'conversation') ? quotedMessage.conversation :
                      (quotedMtype === 'imageMessage') ? (quotedMessage.imageMessage.caption || '') :
                      (quotedMtype === 'videoMessage') ? (quotedMessage.videoMessage.caption || '') :
                      (quotedMtype === 'extendedTextMessage') ? quotedMessage.extendedTextMessage.text :
                      '',
                download: () => downloadContentFromMessage(
                    quotedMsg,
                    quotedMtype.replace('Message', '')
                )
            };
        } else {
            m.quoted = null;
        }
        
        // Récupération du texte (body)
        m.body = (m.mtype === 'conversation') ? m.message.conversation : 
                 (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : 
                 (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : 
                 (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                 (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : 
                 (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : 
                 (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : 
                 (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : '';
                 
        // Alias pour répondre facilement
        m.reply = (text, chatId = m.chat, options = {}) => {
            return conn.sendMessage(chatId, { text: text }, { quoted: m, ...options });
        };
    }
    return m;
};

module.exports = { sms };

// Powered by KAIRO ZYNEX
