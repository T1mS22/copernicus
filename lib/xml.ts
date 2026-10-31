type XmlToken =
  | { kind: "open"; text: string; name: string }
  | { kind: "close"; text: string; name: string }
  | { kind: "self"; text: string }
  | { kind: "other"; text: string } // comments, CDATA, <?…?>, <!DOCTYPE …>
  | { kind: "text"; text: string };

function readUntil(xml: string, start: number, end: string): number {
  const index = xml.indexOf(end, start);
  if (index === -1) throw new Error(`Missing “${end}”.`);
  return index + end.length;
}

// Splits XML into tags and text. Quotes inside tags are respected, so an
// attribute value may contain ">".
export function tokenizeXml(xml: string): XmlToken[] {
  const tokens: XmlToken[] = [];
  let i = 0;
  while (i < xml.length) {
    if (xml[i] !== "<") {
      const next = xml.indexOf("<", i);
      const end = next === -1 ? xml.length : next;
      tokens.push({ kind: "text", text: xml.slice(i, end) });
      i = end;
      continue;
    }

    let end: number;
    if (xml.startsWith("<!--", i)) end = readUntil(xml, i + 4, "-->");
    else if (xml.startsWith("<![CDATA[", i)) end = readUntil(xml, i + 9, "]]>");
    else if (xml.startsWith("<?", i)) end = readUntil(xml, i + 2, "?>");
    else if (xml.startsWith("<!", i)) {
      // DOCTYPE, possibly with an internal subset in [ … ].
      let depth = 0;
      end = i + 2;
      while (end < xml.length && (xml[end] !== ">" || depth > 0)) {
        if (xml[end] === "[") depth++;
        if (xml[end] === "]") depth--;
        end++;
      }
      end++;
    } else {
      let quote: string | null = null;
      end = i + 1;
      while (end < xml.length && (quote || xml[end] !== ">")) {
        if (quote && xml[end] === quote) quote = null;
        else if (!quote && (xml[end] === '"' || xml[end] === "'")) {
          quote = xml[end];
        }
        end++;
      }
      if (end >= xml.length) throw new Error("A tag isn't closed with “>”.");
      end++;
    }

    const text = xml.slice(i, end);
    if (/^<[!?]/.test(text)) tokens.push({ kind: "other", text });
    else if (text.startsWith("</")) {
      tokens.push({ kind: "close", text, name: text.slice(2, -1).trim() });
    } else if (text.endsWith("/>")) tokens.push({ kind: "self", text });
    else {
      tokens.push({ kind: "open", text, name: /^<([^\s/>]+)/.exec(text)![1] });
    }
    i = end;
  }
  return tokens;
}

export function formatXml(xml: string, indent = "  "): string {
  const tokens = tokenizeXml(xml.trim()).filter(
    (token) => token.kind !== "text" || token.text.trim() !== "",
  );
  const lines: string[] = [];
  let depth = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const pad = indent.repeat(depth);
    const next = tokens[i + 1];
    const afterNext = tokens[i + 2];

    // Keep elements with only text on one line: <name>text</name>.
    if (
      token.kind === "open" &&
      next?.kind === "text" &&
      afterNext?.kind === "close" &&
      afterNext.name === token.name
    ) {
      lines.push(pad + token.text + next.text.trim() + afterNext.text);
      i += 2;
      continue;
    }
    if (
      token.kind === "open" &&
      next?.kind === "close" &&
      next.name === token.name
    ) {
      lines.push(pad + token.text + next.text);
      i += 1;
      continue;
    }

    if (token.kind === "close") {
      depth = Math.max(0, depth - 1);
      lines.push(indent.repeat(depth) + token.text);
    } else if (token.kind === "text") {
      lines.push(pad + token.text.trim());
    } else {
      lines.push(pad + token.text);
      if (token.kind === "open") depth++;
    }
  }
  return lines.join("\n");
}

export function minifyXml(xml: string, keepComments = true): string {
  return tokenizeXml(xml.trim())
    .filter(
      (token) =>
        !(token.kind === "text" && token.text.trim() === "") &&
        (keepComments || !token.text.startsWith("<!--")),
    )
    .map((token) => (token.kind === "text" ? token.text.trim() : token.text))
    .join("");
}
