import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), dts(
		{
			exclude: ['src/pages/**', 'src/assets/**', 'src/images/**', 'public/**'],
		}
	)],
	build: {
		lib: {
			entry: 'src/index.ts',
			name: 'ReactVegas',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
	},
})
