const js = require('@eslint/js');

module.exports = [
    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'commonjs',
            globals: {
                process: 'readonly',
                require: 'readonly',
                module: 'readonly',
                __dirname: 'readonly',
                console: 'readonly'
            }
        },
        rules: {
            // Importa las reglas recomendadas de @eslint/js como base
            ...js.configs.recommended.rules,

            // Indentación de 4 espacios (mejora consistencia de código)
            indent: ['error', 4],
            // Prohíbe var, usar let/const en su lugar
            'no-var': ['error'],
            // Prefiere const cuando la variable no se reasigna
            'prefer-const': ['error'],

            // Evita dejar console.log en producción (marcado como error)
            'no-console': ['error'],

            // Fuerza camelCase en identificadores (propiedades también)
            'camelcase': ['error', { properties: 'always' }],

            // Detecta variables no usadas; permite parámetros que empiecen por _ (argsIntgnorePattern)
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

            // Forzar comillas simples
            quotes: ['error', 'single'],

            // Forzar punto y coma al final de expresiones
            semi: ['error', 'always'],

            // Limita longitud de funciones para mantener funciones pequeñas y legibles
            'max-lines-per-function': ['error', { max: 20, skipBlankLines: true, skipComments: true }]
        },
    }
];


