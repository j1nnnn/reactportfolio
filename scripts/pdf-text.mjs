// The text of a PDF, for the deploy guard's résumé checks. Covers what Chromium's print-to-PDF writes
// (FlateDecode streams, Type0 fonts with a ToUnicode map) and plain unencoded ones. It throws on
// anything it can't read: a résumé the guard can't read must fail the guard, not slip past it.

import { inflateSync } from "node:zlib";

export function pdfText(buf) {
  const src = buf.toString("latin1");
  if (!src.startsWith("%PDF-")) throw new Error("not a PDF");
  if (/\/Encrypt\b/.test(src)) throw new Error("encrypted");

  // Objects by number: { dict, data } (data only for streams, still encoded). Streams are skipped by
  // /Length so binary data can't be mistaken for PDF syntax.
  const objects = new Map();
  const objRe = /(\d+)\s+\d+\s+obj\b/g;
  for (let m; (m = objRe.exec(src)); ) {
    const at = objRe.lastIndex;
    const next = /\bstream\r?\n|\bendobj\b/g;
    next.lastIndex = at;
    const k = next.exec(src);
    if (!k) break;
    const dict = src.slice(at, k.index);
    if (k[0].startsWith("endobj")) {
      objects.set(m[1], { dict });
      continue;
    }
    const start = next.lastIndex;
    const len = dict.match(/\/Length\s+(\d+)(\s+\d+\s+R)?/);
    const length = !len ? -1 : len[2] ? Number(src.match(new RegExp(`\\b${len[1]}\\s+\\d+\\s+obj\\s*(\\d+)`))?.[1] ?? -1) : Number(len[1]);
    const end = length >= 0 ? start + length : src.indexOf("endstream", start);
    if (end < start) throw new Error(`stream in object ${m[1]} has no length`);
    objects.set(m[1], { dict, data: buf.subarray(start, end) });
    objRe.lastIndex = end;
  }

  const decoded = (num) => {
    const o = objects.get(num);
    if (!o?.data) throw new Error(`object ${num} is not a stream`);
    const filters = [...(o.dict.match(/\/Filter\s*(\[[^\]]*\]|\/\w+)/)?.[1] ?? "").matchAll(/\/(\w+)/g)].map(([, f]) => f);
    if (filters.some((f) => f !== "FlateDecode") || filters.length > 1) throw new Error(`unsupported filter ${filters.join(", ")}`);
    return (filters.length ? inflateSync(o.data) : o.data).toString("latin1");
  };
  const refs = (s) => [...s.matchAll(/(\d+)\s+\d+\s+R/g)].map(([, n]) => n);

  // Font resource name -> its ToUnicode map, if it has one.
  const fonts = new Map();
  for (const { dict } of objects.values()) {
    for (const [, inline, ref] of dict.matchAll(/\/Font\s*(?:<<([\s\S]*?)>>|(\d+\s+\d+\s+R))/g)) {
      const list = inline ?? objects.get(refs(ref)[0])?.dict ?? "";
      for (const [, name, num] of list.matchAll(/\/([^\s/<>[\]()]+)\s+(\d+)\s+\d+\s+R/g)) {
        const toUnicode = objects.get(num)?.dict.match(/\/ToUnicode\s+(\d+)\s+\d+\s+R/)?.[1];
        fonts.set(name, toUnicode ? parseCMap(decoded(toUnicode)) : null);
      }
    }
  }

  // Page contents, plus form XObjects (which can hold text too).
  const contents = new Set();
  for (const [num, { dict, data }] of objects) {
    const c = dict.match(/\/Contents\s*(\[[^\]]*\]|\d+\s+\d+\s+R)/)?.[1];
    if (c) refs(c).forEach((n) => contents.add(n));
    if (data && /\/Subtype\s*\/Form\b/.test(dict)) contents.add(num);
  }
  const text = [...contents].map((n) => showText(decoded(n), fonts)).join(" ").replace(/\s+/g, " ").trim();
  if (!/\p{L}/u.test(text)) throw new Error("no text found");
  return text;
}

function parseCMap(cmap) {
  const width = (cmap.match(/begincodespacerange\s*<([0-9a-f]+)>/i)?.[1].length ?? 4) / 2;
  const units = (hex) => (hex.match(/[0-9a-f]{4}/gi) ?? []).map((h) => parseInt(h, 16));
  const map = new Map();
  for (const [, block] of cmap.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const [, code, uni] of block.matchAll(/<([0-9a-f]+)>\s*<([0-9a-f]*)>/gi)) {
      map.set(parseInt(code, 16), String.fromCharCode(...units(uni)));
    }
  }
  for (const [, block] of cmap.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const [, lo, hi, dst] of block.matchAll(/<([0-9a-f]+)>\s*<([0-9a-f]+)>\s*(<[0-9a-f]*>|\[[^\]]*\])/gi)) {
      const first = parseInt(lo, 16);
      if (dst.startsWith("[")) {
        [...dst.matchAll(/<([0-9a-f]*)>/gi)].forEach(([, uni], i) => map.set(first + i, String.fromCharCode(...units(uni))));
        continue;
      }
      for (let code = first; code <= parseInt(hi, 16); code++) {
        const u = units(dst);
        u[u.length - 1] += code - first;
        map.set(code, String.fromCharCode(...u));
      }
    }
  }
  return { width, map };
}

// The strings a content stream shows (Tj, TJ, ' and "), decoded with the font in use.
function showText(s, fonts) {
  let out = "";
  let font = null;
  const stack = [];
  const decode = (bytes) => {
    if (!font) return String.fromCharCode(...bytes);
    let t = "";
    for (let i = 0; i + font.width <= bytes.length; i += font.width) {
      let code = 0;
      for (let j = 0; j < font.width; j++) code = code * 256 + bytes[i + j];
      t += font.map.get(code) ?? "";
    }
    return t;
  };
  const delim = /[\s/[\]()<>%]/;
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) i++;
    else if (c === "%") while (i < s.length && s[i] !== "\n" && s[i] !== "\r") i++;
    else if (s.startsWith("<<", i) || s.startsWith(">>", i)) i += 2;
    else if (c === "(") {
      const bytes = [];
      let depth = 1;
      i++;
      while (i < s.length) {
        const ch = s[i++];
        if (ch === "\\") {
          const e = s[i++];
          if (/[0-7]/.test(e)) {
            let oct = e;
            while (oct.length < 3 && /[0-7]/.test(s[i])) oct += s[i++];
            bytes.push(parseInt(oct, 8) & 255);
          } else if (e === "\r") { if (s[i] === "\n") i++; }
          else if (e !== "\n") bytes.push({ n: 10, r: 13, t: 9, b: 8, f: 12 }[e] ?? e.charCodeAt(0));
        } else if (ch === ")" && !--depth) break;
        else {
          if (ch === "(") depth++;
          bytes.push(ch.charCodeAt(0));
        }
      }
      stack.push({ bytes });
    } else if (c === "<") {
      const end = s.indexOf(">", i);
      const hex = s.slice(i + 1, end).replace(/\s/g, "");
      stack.push({ bytes: ((hex.length % 2 ? `${hex}0` : hex).match(/../g) ?? []).map((h) => parseInt(h, 16)) });
      i = end + 1;
    } else if (c === "[") {
      stack.push("[");
      i++;
    } else if (c === "]") {
      const items = stack.splice(stack.lastIndexOf("[")).slice(1);
      stack.push({ items });
      i++;
    } else {
      let j = i + 1;
      while (j < s.length && !delim.test(s[j])) j++;
      const tok = s.slice(i, j);
      i = j;
      if (tok.startsWith("/") || /^[-+.\d]/.test(tok)) {
        stack.push(tok);
        continue;
      }
      const last = stack[stack.length - 1];
      if (tok === "Tf") font = fonts.get(String(stack[stack.length - 2]).slice(1)) ?? null;
      else if (tok === "Tj" || tok === "'" || tok === '"') out += (tok === "Tj" ? "" : "\n") + decode(last?.bytes ?? []);
      else if (tok === "TJ") {
        for (const it of last?.items ?? []) out += typeof it === "string" ? (Number(it) < -250 ? " " : "") : decode(it.bytes ?? []);
        // A move along the same line is kerning or letter-spacing (word gaps are space glyphs): no space.
      } else if (tok === "Td" || tok === "TD") out += Number(stack[stack.length - 1]) ? "\n" : "";
      else if (tok === "Tm") out += " ";
      else if (tok === "T*" || tok === "ET") out += "\n";
      stack.length = 0;
    }
  }
  return out;
}
