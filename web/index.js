const http = require('http');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!');
}).listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});