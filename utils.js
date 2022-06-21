const fs = require('fs').promises;

const readContentFile = async () => JSON.parse(await fs.readFile('./talker.json', 'utf-8'));

const writeContentFile = async (data) => {
  const talker = await readContentFile();
  talker.push(data);

  const talkerJSONToStr = JSON.stringify(talker);
  await fs.writeFile('./talker.json', talkerJSONToStr);
};

const updateContentFile = async (data) => {
  const talker = await readContentFile();
  const talkersFilter = talker.filter((el) => el.id !== data.id);
  talkersFilter.push(data);
  const talkerJSONToStr = JSON.stringify(talkersFilter);
  console.log(talkerJSONToStr);
  await fs.writeFile('./talker.json', talkerJSONToStr);
};

module.exports = {
  readContentFile,
  writeContentFile,
  updateContentFile,
};
