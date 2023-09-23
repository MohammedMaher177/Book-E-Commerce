

const cors = (req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'https://book-store-front.onrender.com', 'https://bookstore-front.codecraftsportfolio.online'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTION');
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization,');
    // res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie, Set-Cookie2');

    next();
}

export default cors;