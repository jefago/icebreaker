import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

import dotenv from "dotenv"
dotenv.config(process.env.DOTENV_FILE ? {path: process.env.DOTENV_FILE} : {})

const production = !process.env.ROLLUP_WATCH;
const netlifyFunction = process.env.USE_NETLIFY_FUNCTION;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

function serveWithNetlifyFunction() {
	let netlifyFunctionServer;

	function toExit() {
		if (netlifyFunctionServer) netlifyFunctionServer.kill(0);
	}

	return {
		writeBundle() {
			if (netlifyFunctionServer) return;

			netlifyFunctionServer = require('child_process').spawn('npx', ['netlify', 'functions:serve'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			const polka = require('polka')
			const sirv = require('sirv');
			const httpProxyMiddleware = require('http-proxy-middleware')

			polka()
				.use('/.netlify', httpProxyMiddleware.createProxyMiddleware({ target: 'http://localhost:9999', changeOrigin: true}))
				.use(sirv('public', {dev: true}))
				.listen(8080, err => {
					if (err) throw err;
					console.log(`Listening on localhost:8080`);
				});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}

	}
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		typescript(),
		svelte({
			preprocess: sveltePreprocess({ 
				sourceMap: !production,
				replace: [["process.env.API_URL", `"${process.env.API_URL}"`]]
			}),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && (netlifyFunction ? serveWithNetlifyFunction() : serve()),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
