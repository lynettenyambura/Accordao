const fs = require('fs');


function extractRequestURL(text) {
    const pattern = /Request URL:\s*(https?:\/\/\S+)/;
    const match = text.match(pattern);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}


fs.readFile('request_info.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    
    const url = extractRequestURL(data);
    console.log('Request URL:', url);
});
