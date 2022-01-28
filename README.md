# Icebreaker app
This is a tiny webapp, built in Svelte, to show random icebreaker questions with background images pulled from Unsplash.

## Running locally against Unsplash API
To run this locally, you will need to first get an Unsplash API access key. Then, create a `.env` file with the following content, replacing `YOUR_ACCESS_KEY` with the access key from Unsplash:

```
API_URL=https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY
```

Then, you can run the web application with the following command:

```
npm run dev
```

## Deploying the web app publicly
Unsplash's terms prohibit embedding their access keys in web applications, so while you *could* in theory just bundle the application using `npm run build` and deploy that to a web server, you would violate Unsplash's terms. Instead, you will need to set up a proxy endpoint for Unsplash's `/photos/random` API endpoint that sends your access key.

The repository contains a Netlify serverless lambda function (`netlify/functions/unsplash-search/unsplash-search.ts`) to achieve this. To deploy this web application to Netlify, you will only need to set two environment variables in Netlify:

```
API_URL=https://YOUR_WEBSITE_DOMAIN/.netlify/functions/unsplash-search
UNSPLASH_API_KEY=YOUR_ACCESS_KEY
```

To deploy this web application elsewhere, you will simply need to write your own proxy for the API endpoint – you can look at `netlify/functions/unsplash-search/unsplash-search.ts` for inspiration.

## Testing the Netlify function locally
For local testing of the Netlify function, you can set the environment variable `USE_NETLIFY_FUNCTION` to true, which will start a Netlify function server on `localhost:9999` and proxy requests to `localhost:8080/.netlify` to that function server.

The easiest way to test these functions is to set up a new `.env` file, `.env.local_netlify`, with the following content:

```
API_URL=http://localhost:8080/.netlify/functions/unsplash-search
USE_NETLIFY_FUNCTION=true
```

and then start the development server with the following command:

```
DOTENV_FILE=.env.local_netlify npm run dev
```