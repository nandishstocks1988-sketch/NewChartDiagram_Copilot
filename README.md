# NewChartDiagram_Copilot

## Advanced Diagram Builder (Cytoscape.js powered)

**Features:**
- Custom shapes for systems, groups, nodes
- Drag-and-drop, double-click editing, context menu
- Resize nodes/groups/systems (node-editing plugin)
- Connectors (edges) between elements
- User-defined legend (font, color, highlight)
- Export: PNG, SVG, JSON, PDF
- Theme switcher (Light, Dark, High Contrast)
- Undo/redo, zoom/pan, modular UI

**How to run:**
1. Download all required JS files to `libs/` (see below).
2. Serve via local HTTP server (Python: `python -m http.server`, Node: `npx http-server`).
3. Open `index.html` in your browser.

**Required JS files:**
- `cytoscape.min.js`
- `cytoscape-node-editing.js`
- `cxtmenu.js`
- `html2canvas.min.js`
- `jspdf-min.js`

See [docs/user-guide.md](docs/user-guide.md) for full instructions.