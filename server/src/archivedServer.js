// Get the app.js file from server/src/app.js:
const app = require('./app');
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}
);

module.exports = server;
