import type { AttributifyAttributes } from '@unocss/preset-attributify';

declare global {
	namespace svelte.JSX {
		interface HTMLAttributes extends AttributifyAttributes {}
	}
}
