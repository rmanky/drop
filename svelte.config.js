// svelte.config.js
import preprocess from 'svelte-preprocess';
import UnoCss from 'unocss/vite';
import { presetAttributify, presetIcons, presetUno } from 'unocss';
import { extractorSvelte } from '@unocss/core';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: vercel(),
		target: '#svelte',
		vite: {
			plugins: [
				UnoCss({
					extractors: [extractorSvelte],
					presets: [presetAttributify(), presetUno(), presetIcons()]
				})
			]
		}
	}
};

export default config;
