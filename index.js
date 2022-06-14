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
  let tokenUser = '';
  const tokenLength = 16;
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < tokenLength; i += 1) {
    tokenUser += char.charAt(Math.random() * char.length);
  }
  return tokenUser;
};

// Req 01
app.get('/talker', getTalkers);

// Req 02
app.get('/talker/:id', getTalkerId);

// Req 03
const validateEmail = (email, res) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
};

const validatePassword = (password, res) => {
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' }); 
  }
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  validateEmail(email, res);
  validatePassword(password, res);
  return res.status(HTTP_OK_STATUS).json({ token: tokenGenerator() });
});

// Req 04
const validateToken = (token, res) => {
  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
    if (token !== tokenGenerator) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Req 05
const validateName = (name, res) => {
  const minChar = 3;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < minChar) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
};

const validateAge = (age, res) => {
  const majority = 18;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < majority) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
};

const validateTalk = (talk, res) => {
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
};

const validateWatchedAt = (watchedAt, res) => {
  const formateWatchedAt = /^(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/]\d{4}$/;
  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!formateWatchedAt.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
};

const validateRate = (rate, res) => {
  if (!rate) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if ((rate % 1 !== 0) || (rate > 5) || (rate < 1)) {
    return res.statys(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
};

app.post('/talker', (req, res) => {
  try {
    // const fileContent = await fs.readFile('./talker.json', 'utf-8');
    // const talkersJSON = JSON.parse(fileContent);
    const { name, age, talk } = req.body;
    const token = req.headers.authorization;
    validateAge(age, res);
    validateName(name, res);
    validateToken(token, res);
    validateTalk(talk, res);
    validateWatchedAt(talk, res);
    validateRate(talk, res);
    // talkersJSON.push({ name, age, talk });
    // await fs.writeFile('./talker.json', JSON.stringify(talkersJSON));
    // return res.status(201).json(talkersJSON);
  } catch (error) {
    console.log(error);
  }
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
