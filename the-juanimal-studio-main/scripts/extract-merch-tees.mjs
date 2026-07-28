import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "public", "images");
const html = fs.readFileSync(path.join(root, "merch.html"), "utf8");

// Find JS object keys with data URLs: white: "data:...", black: "data:..."
const re = /(white|black)\s*:\s*"(data:image\/([a-zA-Z0-9+.-]+);base64,([^"]+))"/g;
let m;
while ((m = re.exec(html))) {
  const key = m[1];
  const ext = m[3] === "jpeg" ? "jpg" : m[3].split("+")[0];
  const name = `merch-tee-${key}.${ext}`;
  const buf = Buffer.from(m[4], "base64");
  fs.writeFileSync(path.join(outDir, name), buf);
  console.log("wrote", name, buf.length);
}

// Also any remaining data URLs in merch
const all = [...html.matchAll(/data:image\/([a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)/g)];
console.log("total data urls in merch:", all.length);
