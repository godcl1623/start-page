import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'model');
  const fileContents = await fs.readFile(`${jsonDirectory}/database.json`, 'utf8');
  if (request.method === 'GET') {
    response.status(200).json(fileContents);
  } else if (request.method === 'POST') {
    if (Object.keys(request.body).length === 8) {
      const { feeds } = JSON.parse(fileContents);
      const newContents = [...feeds, request.body];
      const result = {
        feeds: newContents
      };
      fs.writeFile(`${jsonDirectory}/database.json`, JSON.stringify(result));
      response.status(200).json('success');
    } else {
      response.status(416).json('Request failed: number of request properties is not satisfied.');
    }
  }
}