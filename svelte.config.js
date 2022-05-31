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
		adapter: vercel(),
		vite: {
			optimizeDeps: {
				exclude: ['@urql/svelte']
			},
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
