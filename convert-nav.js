const fs = require('fs');

function convertTheme(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Colors
    content = content.replaceAll('bg-[#001c10]', 'bg-white');
    content = content.replaceAll('bg-[#00130b]', 'bg-slate-50');
    content = content.replaceAll('text-slate-100', 'text-slate-900');
    content = content.replaceAll('text-slate-200', 'text-slate-800');
    content = content.replaceAll('text-slate-300', 'text-slate-700');
    content = content.replaceAll('text-white', 'text-black');
    content = content.replaceAll('text-slate-400', 'text-slate-600');
    content = content.replaceAll('text-[#001c10]', 'text-white'); // text on emerald buttons

    // Gradients
    content = content.replaceAll('from-[#001c10]', 'from-white');
    content = content.replaceAll('to-[#001c10]', 'to-white');
    content = content.replaceAll('from-[#00130b]', 'from-slate-50');
    content = content.replaceAll('via-[#00130b]/40', 'via-slate-50/40');
    content = content.replaceAll('from-[#003d24]', 'from-emerald-50');

    // Translucencies
    content = content.replaceAll('bg-white/5', 'bg-black/5');
    content = content.replaceAll('bg-white/10', 'bg-black/10');
    content = content.replaceAll('bg-white/20', 'bg-black/20');
    content = content.replaceAll('bg-white/[0.02]', 'bg-black/[0.02]');
    content = content.replaceAll('bg-white/[0.03]', 'bg-black/[0.03]');
    content = content.replaceAll('bg-white/[0.05]', 'bg-black/[0.05]');

    content = content.replaceAll('border-white/5', 'border-black/5');
    content = content.replaceAll('border-white/10', 'border-black/10');
    content = content.replaceAll('border-white/20', 'border-black/20');

    content = content.replaceAll('text-white/80', 'text-black/80');
    content = content.replaceAll('text-white/70', 'text-black/70');

    fs.writeFileSync(filePath, content);
}

['components/Header.tsx', 'components/Footer.tsx'].forEach(convertTheme);
