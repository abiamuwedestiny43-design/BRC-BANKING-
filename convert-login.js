const fs = require('fs');
const path = 'app/login/page.tsx';

if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');

    // Background and base colors
    content = content.replaceAll('bg-[#000d07]', 'bg-slate-50');
    content = content.replaceAll('bg-[#001c10]', 'bg-white');
    content = content.replaceAll('from-[#000d07]', 'from-slate-50');
    content = content.replaceAll('to-[#000d07]', 'to-slate-50');

    // Text colors
    content = content.replaceAll('text-white', 'text-black');
    content = content.replaceAll('text-slate-500', 'text-slate-600');
    content = content.replaceAll('text-slate-600', 'text-slate-500'); // Some lighter slate for icons
    content = content.replaceAll('text-slate-700', 'text-slate-400'); // Placeholder
    content = content.replaceAll('text-[#001c10]', 'text-white');

    // Emerald accents to Slate/Black combos for a clean pear white look
    // Or we can keep emerald but adapt it to be more elegant on light bg
    content = content.replaceAll('bg-emerald-500', 'bg-black');
    content = content.replaceAll('hover:bg-emerald-400', 'hover:bg-slate-800');
    content = content.replaceAll('text-emerald-500', 'text-slate-800');
    content = content.replaceAll('bg-emerald-500/10', 'bg-black/5');
    content = content.replaceAll('bg-emerald-500/30', 'bg-black/10');
    content = content.replaceAll('bg-emerald-500/50', 'bg-black/20');
    content = content.replaceAll('border-emerald-500/20', 'border-black/10');
    content = content.replaceAll('border-emerald-500/50', 'border-black/20');
    content = content.replaceAll('ring-emerald-500/20', 'ring-black/10');
    content = content.replaceAll('shadow-emerald-500/10', 'shadow-black/5');
    content = content.replaceAll('shadow-emerald-500/20', 'shadow-black/10');

    // Translucencies & inputs
    content = content.replaceAll('bg-white/[0.02]', 'bg-white/60');
    content = content.replaceAll('bg-white/5', 'bg-black/5');
    content = content.replaceAll('border-white/5', 'border-black/5');
    content = content.replaceAll('border-white/10', 'border-black/10');
    content = content.replaceAll('placeholder:text-white/5', 'placeholder:text-black/20');

    fs.writeFileSync(path, content);
    console.log('Login theme converted.');
}
