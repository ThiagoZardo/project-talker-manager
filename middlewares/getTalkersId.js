const fs = require('fs').promises;

const HTTP_OK_STATUS = 200;

const getTalkerId = async (req, res) => {
  const { id } = req.params;
  const talkersJSON = JSON.parse(await fs.readFile('./talker.json'));
  const idTalker = talkersJSON.find((t) => t.id === Number(id));

  if (!idTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(HTTP_OK_STATUS).json(idTalker);
};

module.exports = getTalkerId;