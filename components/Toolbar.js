import { Canvas } from './Canvas.js';
import { exportDiagram } from '../utils/export.js';
import { importDiagram } from '../utils/import.js';
import { setTheme } from '../utils/theme.js';

export const Toolbar = {
  init: function () {
    const toolbar = document.getElementById('toolbar');
    toolbar.innerHTML = `
      <button id="add-system-btn">Add System</button>
      <button id="add-group-btn">Add Group</button>
      <button id="add-node-btn">Add Node</button>
      <button id="connect-btn">Connect</button>
      <button id="legend-btn">Legend</button>
      <button id="undo-btn">Undo</button>
      <button id="redo-btn">Redo</button>
      <button id="zoom-in-btn">Zoom In</button>
      <button id="zoom-out-btn">Zoom Out</button>
      <div class="dropdown">
        <button id="export-btn">Export ▼</button>
        <div class="dropdown-content" id="export-options" style="display:none;position:absolute;z-index:100;">
          <a href="#" id="export-json">🗄 JSON</a>
          <a href="#" id="export-png">🖼 PNG</a>
          <a href="#" id="export-svg">📐 SVG</a>
          <a href="#" id="export-pdf">📄 PDF</a>
        </div>
      </div>
      <input type="file" id="import-file" style="display:none" />
      <button id="import-btn">Import</button>
      <select id="theme-select">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="contrast">High Contrast</option>
      </select>
    `;
    document.getElementById('add-system-btn').onclick = () => window.showSystemWizard();
    document.getElementById('add-group-btn').onclick = () => window.showGroupWizard();
    document.getElementById('add-node-btn').onclick = () => window.showNodeWizard();
    document.getElementById('connect-btn').onclick = () => Canvas.startConnectMode();
    document.getElementById('legend-btn').onclick = () => window.showLegendWizard();
    document.getElementById('undo-btn').onclick = () => Canvas.undo();
    document.getElementById('redo-btn').onclick = () => Canvas.redo();
    document.getElementById('zoom-in-btn').onclick = () => Canvas.zoom(0.1);
    document.getElementById('zoom-out-btn').onclick = () => Canvas.zoom(-0.1);

    document.getElementById('export-btn').onclick = (e) => {
      document.getElementById('export-options').style.display =
        document.getElementById('export-options').style.display === 'none' ? 'block' : 'none';
    };
    document.getElementById('export-json').onclick = (e) => { e.preventDefault(); exportDiagram('json'); };
    document.getElementById('export-png').onclick = (e) => { e.preventDefault(); exportDiagram('png'); };
    document.getElementById('export-svg').onclick = (e) => { e.preventDefault(); exportDiagram('svg'); };
    document.getElementById('export-pdf').onclick = (e) => { e.preventDefault(); exportDiagram('pdf'); };

    document.getElementById('import-btn').onclick = () => document.getElementById('import-file').click();
    document.getElementById('import-file').onchange = (e) => importDiagram(e.target.files[0]);

    document.getElementById('theme-select').onchange = (e) => setTheme(e.target.value);
  }
}