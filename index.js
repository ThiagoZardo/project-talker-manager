const express = require('express');
const bodyParser = require('body-parser');
const { writeContentFile } = require('./utils');
const tokenGenerator = require('./middlewares/tokenGenerator');
const getTalkers = require('./middlewares/getTalkers');
const getTalkerId = require('./middlewares/getTalkersId');
const { validateEmail, validatePassword } = require('./middlewares/validateLogin');
const generateId = require('./middlewares/generateId');
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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
