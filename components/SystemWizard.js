import { Canvas } from './Canvas.js';

export const SystemWizard = {
  init: function () {
    window.showSystemWizard = (editId = null) => {
      const wizard = document.getElementById('wizard');
      let current = editId ? Canvas.cy.$id(editId).data() : {};
      wizard.innerHTML = `
        <div class="wizard-modal">
        <h3>${editId ? 'Edit' : 'Add'} System</h3>
        <div class="wizard-fields">
          <label>Name: <input id="system-name" value="${current.label || ''}" /></label>
          <label>Shape:
            <select id="system-shape">
              ${['rectangle', 'ellipse', 'hexagon', 'diamond', 'star', 'octagon', 'pentagon', 'triangle', 'rhomboid', 'roundrectangle', 'vee'].map(s => `<option value="${s}" ${current.shape === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </label>
          <label>Reference System:
            <select id="reference-system">
              <option value="">None</option>
              ${window.diagramState.systems.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
            </select>
          </label>
          <label>Position:
            <select id="system-position">
              <option value="right">Right</option>
              <option value="left">Left</option>
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </label>
          <label>Fill Color: <input type="color" id="system-fill" value="${current.fillColor || '#d3eafd'}"/></label>
          <label>Outline Color: <input type="color" id="system-outline" value="${current.outlineColor || '#3949ab'}"/></label>
          <label>Label Color: <input type="color" id="system-label-color" value="${current.labelColor || '#222222'}"/></label>
          <label>Font Size: <input type="number" id="system-font-size" value="${parseInt(current.fontSize) || 16}" min="10" max="48"/> px</label>
          <label>Font Family:
            <select id="system-font-family">
              ${['Arial', 'Roboto', 'Courier', 'Verdana', 'Times New Roman'].map(f => `<option value="${f}" ${current.fontFamily === f ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </label>
          <label>Label Position:
            <select id="system-label-position">
              <option value="center" ${current.labelPosition === 'center' ? 'selected' : ''}>Center</option>
              <option value="top" ${current.labelPosition === 'top' ? 'selected' : ''}>Top</option>
              <option value="bottom" ${current.labelPosition === 'bottom' ? 'selected' : ''}>Bottom</option>
            </select>
          </label>
          <label>Width: <input type="number" id="system-width" value="${current.width || 150}" min="40" max="600"/></label>
          <label>Height: <input type="number" id="system-height" value="${current.height || 80}" min="40" max="600"/></label>
        </div>
        <div class="wizard-actions">
          <button id="system-add">${editId ? 'Update' : 'Add'}</button>
          <button id="system-cancel">Cancel</button>
        </div>
        </div>
      `;
      wizard.style.display = 'block';
      document.getElementById('system-add').onclick = () => {
        const name = document.getElementById('system-name').value.trim();
        const systemId = name.replace(/\s+/g, '_');
        const shape = document.getElementById('system-shape').value;
        const referenceSystem = document.getElementById('reference-system').value;
        const systemPosition = document.getElementById('system-position').value;
        const fillColor = document.getElementById('system-fill').value;
        const outlineColor = document.getElementById('system-outline').value;
        const labelColor = document.getElementById('system-label-color').value;
        const fontSize = document.getElementById('system-font-size').value;
        const fontFamily = document.getElementById('system-font-family').value;
        const labelPosition = document.getElementById('system-label-position').value;
        const width = parseInt(document.getElementById('system-width').value, 10);
        const height = parseInt(document.getElementById('system-height').value, 10);

        const nodeData = {
          id: systemId,
          label: name,
          shape, fillColor, outlineColor, labelColor,
          fontSize, fontFamily, labelPosition,
          group: 'system',
          referenceSystem: referenceSystem || undefined,
          systemPosition: referenceSystem ? systemPosition : undefined,
          width,
          height
        };
        if (editId) {
          Canvas.updateNode(editId, nodeData);
        } else {
          window.diagramState.systems.push(nodeData);
          Canvas.addNode(nodeData); // Will auto-space or reference
        }
        wizard.style.display = 'none';
      };
      document.getElementById('system-cancel').onclick = () => { wizard.style.display = 'none'; };
    }
  }
}