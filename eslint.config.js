import tseslint from 'typescript-eslint';
export default tseslint.config({ ignores: ['dist/**', 'storybook-static/**', 'demo-dist/**', 'src/generated/**'] }, ...tseslint.configs.recommended);
