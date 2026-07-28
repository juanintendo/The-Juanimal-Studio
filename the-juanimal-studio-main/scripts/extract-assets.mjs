import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "public", "images");
fs.mkdirSync(outDir, { recursive: true });

function extract(file, names) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const re = /src="(data:image\/([a-zA-Z0-9+.-]+);base64,([^"]+))"/g;
  let i = 0;
  let m;
  const results = [];
  while ((m = re.exec(html))) {
    const ext = m[2] === "jpeg" ? "jpg" : m[2].split("+")[0];
    const name = names[i] || `${path.basename(file, ".html")}-${i}.${ext}`;
    const buf = Buffer.from(m[3], "base64");
    const dest = path.join(outDir, name);
    fs.writeFileSync(dest, buf);
    results.push({ name, bytes: buf.length, ext });
    i++;
  }
  return results;
}

const indexNames = [
  "brand-logo.png",
  "star-1.png",
  "star-2.png",
  "star-3.png",
  "star-4.png",
  "hero-logo.png",
  "service-ux.png",
  "service-web.png",
  "service-apps.png",
  "service-ai.png",
  "work-1.png",
  "work-2.png",
];

const merchNames = [
  "merch-brand.png",
  "merch-tee-white.jpg",
  "merch-tee-black.jpg",
];

console.log("index:", extract("index.html", indexNames));
console.log("merch:", extract("merch.html", merchNames));
