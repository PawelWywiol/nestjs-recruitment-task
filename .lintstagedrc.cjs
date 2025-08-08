module.exports = {
    '**/*': () => [
        'npm run lint',
        'npm run type-check',
        'npm run test',
    ],
};
