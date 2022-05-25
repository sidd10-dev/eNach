const sha256 = require('js-sha256').sha256

const sha256Encrypt = (obj) => {
    const keys = Object.keys(obj)
    let str = ""
    let i=0
    keys.forEach(key => {
        if(i != keys.length - 1) {
            str += obj[key]
            str += "|"
            i++
        } else {
            str += obj[key]
        }
    })
    // console.log(str)
    str = sha256(str)
    // console.log(str)
    return str
}

module.exports = sha256Encrypt