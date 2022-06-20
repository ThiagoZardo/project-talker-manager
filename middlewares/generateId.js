const { readContentFile } = require('../utils');

const generateId = async () => {
  const readFile = await readContentFile();
  return readFile[readFile.length - 1].id + 1 || 1;
};

module.exports = generateId;
