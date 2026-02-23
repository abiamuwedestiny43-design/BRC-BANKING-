const fs = require('fs');

function removeGreen(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Text colors
    content = content.replace(/text-emerald-[3-6]00/g, 'text-black');
    content = content.replace(/text-green-[3-6]00/g, 'text-black');

    // Backgrounds
    content = content.replace(/bg-emerald-[5-6]00(?![/])/g, 'bg-black');
    content = content.replace(/bg-emerald-900\/50/g, 'bg-black/10');
    content = content.replace(/bg-emerald-900\/10/g, 'bg-black/5');
    content = content.replace(/hover:bg-emerald-400/g, 'hover:bg-slate-800');
    content = content.replace(/hover:bg-emerald-600\/30/g, 'hover:bg-black/20');
    content = content.replace(/hover:bg-emerald-50/g, 'hover:bg-black/5');
    content = content.replace(/bg-emerald-600\/20/g, 'bg-black/10');
    content = content.replace(/bg-emerald-500\/10/g, 'bg-black/5');
    content = content.replace(/bg-emerald-500\/20/g, 'bg-black/10');
    content = content.replace(/bg-emerald-500\/30/g, 'bg-black/15');
    content = content.replace(/bg-emerald-500\/5/g, 'bg-black/5');

    // Gradients
    content = content.replace(/from-emerald-[4-5]00/g, 'from-slate-800');
    content = content.replace(/to-green-[5-6]00/g, 'to-black');
    content = content.replace(/from-emerald-[0-5]0/g, 'from-slate-100');
    content = content.replace(/bg-emerald-900\/40/g, 'bg-slate-300');
    content = content.replace(/bg-green-900\/30/g, 'bg-slate-200');

    // Borders & Decorations
    content = content.replace(/border-emerald-[5-6]00\/30/g, 'border-black/20');
    content = content.replace(/hover:border-emerald-500\/30/g, 'hover:border-black/20');
    content = content.replace(/decoration-emerald-500/g, 'decoration-black');

    // Shadows
    content = content.replace(/shadow-\[0_0_30px_rgba\(16,185,129,0\.4\)\]/g, 'shadow-[0_0_30px_rgba(0,0,0,0.15)]');
    content = content.replace(/shadow-emerald-500\/20/g, 'shadow-black/10');
    content = content.replace(/shadow-emerald-900\/40/g, 'shadow-black/5');

    // Special exceptions
    content = content.replace(/bg-black text-[#001c10]/g, 'bg-white text-black'); // fix previous inversion if it happened

    fs.writeFileSync(filePath, content);
}

removeGreen('components/home/Home.tsx');
