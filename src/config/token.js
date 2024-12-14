module.exports = {
    secret: process.env.TOKEN_SECRET,
    expiresIn: '7d',
    algorithm: 'HS256'
}