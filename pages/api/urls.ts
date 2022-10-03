import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import axios from 'axios';
import { handlePOSTRequest } from 'controllers/urls';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'model');
  const fileContents = await fs.readFile(`${jsonDirectory}/urls.json`, 'utf8');
  if (request.method === 'GET') {
    response.status(200).json(fileContents);
  } else if (request.method === 'POST') {
    handlePOSTRequest({
      request,
      response,
      stringifiedFile: fileContents,
      fileDirectory: jsonDirectory,
    });
  }
}
