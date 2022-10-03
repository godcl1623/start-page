import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import axios from 'axios';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'model');
  const fileContents = await fs.readFile(`${jsonDirectory}/urls.json`, 'utf8');
  if (request.method === 'GET') {
    response.status(200).json(fileContents);
  } else if (request.method === 'POST') {
    if (request.body.mode === 'test') {
      const { data } = await axios.get(request.body.url);
      if (data.includes('xml')) {
        response.status(200).json(true);
      } else {
        response.status(404).json(false);
      }
    } else if (request.body.mode === 'post') {
      const { urls } = JSON.parse(fileContents);
      const { url } = request.body;
      if (urls.includes(url)) {
        response.status(502).json({
          "reason": "Url already exists."
        });
      } else {
        const urlsWithNewUrl = [...urls, url];
        const body = {
          urls: urlsWithNewUrl,
        };
        fs.writeFile(`${jsonDirectory}/urls.json`, JSON.stringify(body));
        response.status(200).json(true);
      }
    }
  }
}