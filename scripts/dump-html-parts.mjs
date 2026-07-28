import fs from "fs";
import path from "path";

const root = process.cwd();
const out = path.join(root, "scripts", "_parts");
fs.mkdirSync(out, { recursive: true });

for (const file of ["index.html", "merch.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const style = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
  let body = html.match(/<body>([\s\S]*)<\/body>/)?.[1] ?? "";
  // strip scripts for structure dump; keep markup with placeholders for images
  body = body.replace(/<script>[\s\S]*?<\/script>/g, "");
  body = body.replace(
    /src="data:image\/[^"]+"/g,
    'src="__IMG__"'
  );
  const base = path.basename(file, ".html");
  fs.writeFileSync(path.join(out, `${base}.css`), style);
  fs.writeFileSync(path.join(out, `${base}.body.html`), body.trim());
  console.log(base, "css", style.length, "body", body.length);
}
