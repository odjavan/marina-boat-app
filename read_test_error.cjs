
const fs = require('fs');
try {
    const content = fs.readFileSync('test_output.json', 'utf8');
    const json = JSON.parse(content);
    // Navigate to errors: usually suites[0].specs[0].tests[0].results[0].errors
    // But let's just search recursively or print first error found.

    function findErrors(obj) {
        if (obj.errors && obj.errors.length > 0) {
            console.log('Error found:', JSON.stringify(obj.errors, null, 2));
            return;
        }
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                findErrors(obj[key]);
            }
        }
    }

    findErrors(json);
} catch (e) {
    console.error('Failed to parse or read:', e.message);
}
