const crypto = require('crypto')

const getRandomString = () => {
    const buffer = crypto.randomBytes(16);
    const token = buffer.toString('hex');  
    // console.log(token);
    return token;
};

module.exports = getRandomString;