import tseslint from 'typescript-eslint';
export default tseslint.config({ ignores: ['dist/**', 'demo-dist/**', 'src/generated/**', 'packages/mobile/dist/**', 'packages/mobile/docs-dist/**', 'packages/mobile/test-results/**', 'packages/mobile/playwright-report/**'] }, ...tseslint.configs.recommended);
