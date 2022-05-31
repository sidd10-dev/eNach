const cryptoJS = require('crypto-js')

const aesKey = 'k2hLr4X0ozNyZByj5DT66edtCEee1x+6'

const aes256Encrypt = (msgs) => {
    const encryptedMsgs = {}
    const keyMsgs = Object.keys(msgs)
    keyMsgs.forEach(key => {
        let encryptMsg = cryptoJS.AES.encrypt(msgs[key].trim(),cryptoJS.enc.Utf8.parse(aesKey),{ mode: cryptoJS.mode.ECB, format: cryptoJS.format.Hex }).toString()
        encryptMsg = '\\x' + encryptMsg
        console.log()
        encryptedMsgs[key] = encryptMsg
    })
    return encryptedMsgs
}

module.exports = aes256Encrypt