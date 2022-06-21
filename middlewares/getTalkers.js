const fs = require('fs').promises;

const HTTP_OK_STATUS = 200;

const getTalkers = async (_req, res) => {
  const talkersJSON = JSON.parse(await fs.readFile('./talker.json'));
  if (talkersJSON.length === 0) return res.status(HTTP_OK_STATUS).send([]);
  return res.status(HTTP_OK_STATUS).json(talkersJSON);
};

module.exports = getTalkers;
