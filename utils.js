const fs = require('fs').promises;

const readContentFile = async () => JSON.parse(await fs.readFile('./talker.json', 'utf-8'));

const writeContentFile = async (data) => {
  const talker = await readContentFile();
  talker.push(data);

  const talkerJSONToStr = JSON.stringify(talker);
  await fs.writeFile('./talker.json', talkerJSONToStr);
};

module.exports = {
  readContentFile,
  writeContentFile,
};
