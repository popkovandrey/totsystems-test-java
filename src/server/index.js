import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { parseSecurities2, parseHistory2 } from './parsers';
import {
  getSecurities,
  deleteSecurities,
  postSecurities,
  putSecurities,
} from './crud';

/* const express = require('express');
const path = require('path');
const fs = require('fs');
const parseSecurities2 = require('./parsers');
const parseHistory2 = require('./parsers');
const getSecurities = require('./crud');
const deleteSecurities = require('./crud');
const postSecurities = require('./crud');
const putSecurities = require('./crud');

const fsPromises = fs.promises;
*/

const readFileSecurities = (filePath) => fs.readFile(filePath, 'utf-8')
  .then((text) => parseSecurities2(text));

const readFileHistory = (filePath) => fs.readFile(filePath, 'utf-8')
  .then((text) => parseHistory2(text));

let securities = [];
let history = [];

const port = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.resolve(__dirname, '../../dist')));

app.get('/api', (request, reply) => {
  reply.send('API is running');
});

app.get('/api/securities/:text', (request, reply) => {
  reply.status(200);
  reply.send(getSecurities(securities, request.params.text));
});

app.get('/api/securities', (request, reply) => {
  reply.status(200);
  reply.send(getSecurities(securities));
});

app.delete('/api/securities/:secId', (request, reply) => {
  const del = deleteSecurities(securities, request.params.secId);

  reply.status(del.status);
  reply.send(del.send);
});

app.put('/api/securities/:secId', (request, reply) => {
  const { secId } = request.params;
  const put = putSecurities(securities, secId, request.query);

  reply.status(put.status);
  reply.send(put.send);
});

app.post('/api/securities/', (request, reply) => {
  const post = postSecurities(securities, request.query);

  reply.status(post.status);
  reply.send(post.send);
});

app.get('/api/raw/securities', (request, reply) => {
  reply.send(securities.reduce((acc, item) => ({ ...acc, [item.secId]: item }), {}));
});

app.get('/api/raw/history', (request, reply) => {
  reply.send(history);
});

app.listen(port, () => {
  console.log('listen port 5000');

  readFileSecurities('./xml/securities_1.xml')
    .then((arrSecurities) => {
      securities = [...securities, ...arrSecurities];
    });

  readFileSecurities('./xml/securities_2.xml', false)
    .then((arrSecurities) => {
      securities = [...securities, ...arrSecurities];
    });

  readFileHistory('./xml/history_1.xml')
    .then((arrHistory) => {
      history = [...history, ...arrHistory];
    });

  readFileHistory('./xml/history_2.xml')
    .then((arrHistory) => {
      history = [...history, ...arrHistory];
    });

  readFileHistory('./xml/history_3.xml')
    .then((arrHistory) => {
      history = [...history, ...arrHistory];
    });

  readFileHistory('./xml/history_4.xml')
    .then((arrHistory) => {
      history = [...history, ...arrHistory];
      // console.log(history);
    });
});

app.use((request, reply) => {
  reply.status(404);
  console.log(`Not found URL: ${request.url}`);
  reply.send({ error: 'Not found' });
});

app.use((err, request, reply) => {
  reply.status(err.status || 500);
  console.log(`Internal error(${reply.statusCode}): ${err.message}`);
  reply.send({ error: err.message });
});
