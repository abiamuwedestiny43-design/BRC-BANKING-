const fs = require('fs');
const path = require('path');

function replaceRecursively(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                replaceRecursively(fullPath);
            }
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Replacements
            content = content.replace(/HB BANK/g, 'BRC BANKING');
            content = content.replace(/HB Bank/g, 'BRC BANKING');
            content = content.replace(/HB\s*<span[^>]*> BANK<\/span>/gi, 'BRC<span className="text-emerald-500 italic"> BANKING</span>');
            content = content.replace(/PRIMEHARBOR/g, 'BRC BANKING');
            content = content.replace(/PrimeHarbor Bank/gi, 'BRC BANKING');
            content = content.replace(/PrimeHarbor/gi, 'BRC BANKING');

            // Adjust some specific edge cases like `PRIME<span ...>HARBOR</span>` in login page
            content = content.replace(/PRIME<span[^>]*>HARBOR<\/span>/gi, 'BRC<span className="text-slate-800 font-medium"> BANKING</span>');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

replaceRecursively('app');
replaceRecursively('components');
replaceRecursively('lib');
