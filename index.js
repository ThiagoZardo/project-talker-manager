const express = require('express');
const bodyParser = require('body-parser');
const {
  readContentFile,
  writeContentFile,
  updateContentFile,
  deleteContentFile,
} = require('./utils');
const tokenGenerator = require('./middlewares/tokenGenerator');
const getTalkers = require('./middlewares/getTalkers');
const getTalkerId = require('./middlewares/getTalkersId');
const { validateEmail, validatePassword } = require('./middlewares/validateLogin');
const generateId = require('./middlewares/generateId');
const errorMiddleware = require('./middlewares/errorMiddleware');
const {
  validateTalk,
  validateWatchedAt,
  validateRate,
  validateName,
  validateAge,
  validateToken,
} = require('./middlewares/validateTalkers');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// Req 01
app.get('/talker', getTalkers);

// Req 08
app.get('/talker/search', validateToken, async (req, res) => {
  const { q } = req.query;
  const readFile = await readContentFile();
  const filtererTalkers = readFile.filter((r) => r.name.includes(q));
  return res.status(HTTP_OK_STATUS).json(filtererTalkers);
});

// Req 02
app.get('/talker/:id', getTalkerId);

// Req 03 e 04
app.post('/login', validateEmail, validatePassword, (req, res) => (
  res.status(HTTP_OK_STATUS).json({ token: tokenGenerator() })
));

// Req 05
app.post('/talker',
validateToken,
validateTalk,
validateWatchedAt,
validateRate,
validateName,
validateAge,
async (req, res) => {
  const { name, age, talk } = req.body;
  const id = await generateId();
  const talkersJSON = { id, name, age, talk };
  await writeContentFile(talkersJSON);
  return res.status(201).json(talkersJSON);
});

// Req 06
app.put('/talker/:id',
validateToken,
validateName,
validateAge,
validateTalk,
validateRate,
validateWatchedAt,
async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talkersJSON = { id: Number(id), name, age, talk };
  await updateContentFile(talkersJSON);
  return res.status(HTTP_OK_STATUS).json(talkersJSON);
});

// Req 07
app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talkersJSON = { id: Number(id) };
  await deleteContentFile(talkersJSON);
  return res.status(204).json(talkersJSON).end();
});

app.use(errorMiddleware);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
