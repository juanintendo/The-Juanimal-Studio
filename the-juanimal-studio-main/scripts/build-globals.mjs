import fs from "fs";
import path from "path";

const root = process.cwd();
const home = fs.readFileSync(path.join(root, "app/_home.css"), "utf8");
const merch = fs.readFileSync(path.join(root, "app/_merch.css"), "utf8");

function stripBase(css) {
  return css
    .replace(/:root\{[\s\S]*?\}\s*/, "")
    .replace(/\*\{margin:0;padding:0;box-sizing:border-box\}\s*/, "")
    .replace(/html\{scroll-behavior:smooth\}\s*/, "")
    .replace(/body\{[\s\S]*?\}\s*/, "")
    .replace(/::selection\{[\s\S]*?\}\s*/, "")
    .replace(/\.sr-only\{[\s\S]*?\}\s*/, "")
    .replace(
      /\/\* ---------- paper grain overlay ---------- \*\/\s*body::after\{[\s\S]*?\}\s*/,
      ""
    );
}

const homeRest = stripBase(home);
const merchSections = merch.slice(
  merch.indexOf("/* ---------- MERCH HEADER ---------- */")
);

const globals = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root{
  --red:#E04E1F;
  --red-deep:#B93A12;
  --cream:#F3E9CE;
  --cream-dim:#E6D8B4;
  --ink:#171009;
  --tan:#C9A96B;
  --rust:#6E3410;
  --disp:var(--font-disp),sans-serif;
  --logo:var(--font-logo),sans-serif;
  --script:var(--font-script),cursive;
  --body:var(--font-body),sans-serif;
}

*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  font-family:var(--body);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
body.page-home{
  background:var(--red);
  color:var(--cream);
}
body.page-merch{
  background:var(--cream);
  color:var(--ink);
}
::selection{background:var(--ink);color:var(--cream)}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

/* ---------- paper grain overlay ---------- */
body::after{
  content:"";position:fixed;inset:0;pointer-events:none;z-index:9999;
  mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.55 0 0 0 0 0.45 0 0 0 0 0.3 0 0 0 0.14 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
body.page-home::after{opacity:.55}
body.page-merch::after{opacity:.4}

/* ===== SHARED + HOME ===== */
${homeRest}

/* ===== MERCH NAV (cream page) ===== */
body.page-merch .nav-links a::before{
  background:rgba(23,16,9,.14);
}
body.page-merch .nav-links a.active{
  color:var(--red);text-shadow:2px 2px 0 var(--ink);
}
body.page-merch .nav-links a.active::before{
  opacity:1;transform:scale(1);background:rgba(23,16,9,.1);
}
body.page-merch nav:not(.scrolled) .nav-links a{
  color:var(--ink);text-shadow:2px 2px 0 rgba(243,233,206,.5);
}
body.page-merch nav:not(.scrolled) .nav-links a.active{color:var(--red)}

/* ===== MERCH SECTIONS ===== */
${merchSections}
`;

fs.writeFileSync(path.join(root, "app/globals.css"), globals);
console.log("Wrote globals.css", globals.length);
