const fs = require('fs/promises');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const getTalkers = async (_req, res) => {
  try {
    const talkersJSON = JSON.parse(await fs.readFile('./talker.json'));
    if (talkersJSON.length === 0) return res.status(HTTP_OK_STATUS).send([]);
    return res.status(HTTP_OK_STATUS).json(talkersJSON);
  } catch (error) {
    console.log(error);
  }
};

const getTalkerId = async (req, res) => {
  const { id } = req.params;
  const talkersJSON = JSON.parse(await fs.readFile('./talker.json'));
  const idTalker = talkersJSON.find((t) => t.id === Number(id));

  if (!idTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(HTTP_OK_STATUS).json(idTalker);
};

app.get('/talker', getTalkers);

app.get('/talker/:id', getTalkerId);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
