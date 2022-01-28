import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  const { keyword = '' } = event.queryStringParameters

  try {
    const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_API_KEY}&query=${keyword}`);
    if (!res.ok) {
      console.log(await res.text());
      throw `Non-OK result (${res.status}) from Unsplash`;
    }
    const json = await res.json();
    return {
      statusCode:200,
      body: JSON.stringify(json),
    }
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500
    }
  }
}
