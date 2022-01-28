import { Handler } from '@netlify/functions'
import fetch from 'node-fetch';

export const handler: Handler = async (event, context) => {
  const { query = '' } = event.queryStringParameters

  try {
    const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_API_KEY}&query=${query}`);
    if (!res.ok) {
      throw `Non-OK result (${res.status}) from Unsplash`;
    }
    const json = await res.json();
    return {
      statusCode:200,
      body: JSON.stringify(json),
    }
  } catch (e) {
    return {
      statusCode: 500
    }
  }
}
