const fs = require("fs");
const path = require("path");
const parse5 = require("parse5");
const typescript = require("typescript");

const Node = {
  map: (transform) => (node) => {
    const transformed = transform(node);
    const { childNodes } = transformed;
    return {
      ...transformed,
      childNodes: childNodes && childNodes.map(Node.map(transform)),
    };
  },
};

const ENTRY = process.argv[2];

const entryPath = require.resolve(ENTRY);
const entryContent = fs.readFileSync(entryPath, "utf-8");

const parsed = parse5.parse(entryContent);
const transformed = Node.map((node) => {
  if (node.nodeName === "script") {
    const src = node.attrs.find((attr) => attr.name === "src");
    if (src.value) {
      const scriptPath = path.resolve(path.dirname(entryPath), src.value);
      const scriptRawContent = fs.readFileSync(scriptPath, "utf-8");
      const transpileOutput = typescript.transpileModule(scriptRawContent, {
        compilerOptions: {
          allowJs: true,
          checkJs: false,
          removeComments: true,
        },
      });
      const scriptContent = transpileOutput.outputText;
      const [newScript] = parse5.parseFragment(
        `<script>${scriptContent}</script>`,
        node.parent,
      ).childNodes;
      return newScript;
    }
  }
  return node;
})(parsed);
const newContent = parse5.serialize(transformed);

fs.writeFileSync(`${entryPath}.js`, `export default \`${newContent}\``);
