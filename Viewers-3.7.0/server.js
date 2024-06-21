const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');


app.use(cors());
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'platform/app/dist')));
// Set security headers for COOP and COEP
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});
// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'platform/app/dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);

console.log('App is listening on port ' + port);
