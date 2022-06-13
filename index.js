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

// função baseada no artigo https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
const tokenGenerator = () => {
  let token = '';
  const tokenLength = 16;
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < tokenLength; i += 1) {
      token += char.charAt(Math.random() * char.length);
  }
  return token;
};

// Req 01
app.get('/talker', getTalkers);

// Req 02
app.get('/talker/:id', getTalkerId);

// Req 03
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email && password) return res.status(HTTP_OK_STATUS).json({ token: tokenGenerator() });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
