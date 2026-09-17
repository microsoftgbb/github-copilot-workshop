const path = require('path');

const PORT = process.env.PORT || 3000;
const MODULES_DIR = process.env.MODULES_DIR || path.resolve(__dirname, '../../../modules');

module.exports = { PORT, MODULES_DIR };
