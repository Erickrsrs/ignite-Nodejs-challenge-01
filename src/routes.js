import { randomUUID } from 'node:crypto';
import { Database } from './database/database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;
      const now = new Date();

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      database.insert('tasks', task);
      return res.writeHead(201).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      database.update('tasks', id, {
        title,
        description,
      });

      return res.writeHead(200).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete('tasks', id);

      return res.writeHead(200).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      res.end('vpatch');
    },
  },
];
