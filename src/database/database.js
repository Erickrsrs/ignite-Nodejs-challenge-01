import fs from 'node:fs/promises';

const databasePath = new URL('../../db.json', import.meta.url);

export class Database {
  database = {};

  persist() {
    fs.writeFile(databasePath, JSON.stringify(this.database));
  }
}
