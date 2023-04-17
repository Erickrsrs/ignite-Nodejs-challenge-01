import { Database } from './database/database.js';

const database = new Database();
database.persist();

export const routes = [
  {
    method: 'GET',
    path: '/tasks',
    handler: (req, res) => {
      res.end('get');
    },
  },
  {
    method: 'POST',
    path: '/tasks',
    handler: (req, res) => {
      res.end('post');
    },
  },
  {
    method: 'PUT',
    path: '/tasks',
    handler: (req, res) => {
      res.end('put');
    },
  },
  {
    method: 'DELETE',
    path: '/tasks',
    handler: (req, res) => {
      res.end('delete');
    },
  },
  {
    method: 'PATCH',
    path: '/tasks',
    handler: (req, res) => {
      res.end('vpatch');
    },
  },
];
