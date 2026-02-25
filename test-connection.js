const https = require('https');

const url = 'https://www.google.com';

https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    res.resume();
}).on('error', (e) => {
    console.error('Error:', e);
});
