import { Canvas } from './Canvas.js';

export const GroupWizard = {
  init: function () {
    window.showGroupWizard = (editId = null) => {
      const wizard = document.getElementById('wizard');
      let current = editId ? Canvas.cy.$id(editId).data() : {};
      // Use system IDs for value, display labels as option text
      const systemOptions = window.diagramState.systems.map(s => `<option value="${s.id}" ${current.parent === s.id ? 'selected' : ''}>${s.label}</option>`).join('');
      const groupOptions = window.diagramState.groups.map(g => `<option value="${g.id}" ${current.parent === g.id ? 'selected' : ''}>${g.label}</option>`).join('');
      wizard.innerHTML = `
        <div class="wizard-modal">
        <h3>${editId ? 'Edit' : 'Add'} Group</h3>
        <div class="wizard-fields">
          <label>Name: <input id="group-name" value="${current.label || ''}" /></label>
          <label>System:
            <select id="group-system">
              ${systemOptions}
            </select>
          </label>
          <label>Reference Group:
            <select id="reference-group">
              <option value="">None</option>
              ${window.diagramState.groups.map(g => `<option value="${g.id}">${g.label}</option>`).join('')}
            </select>
          </label>
          <label>Position:
            <select id="group-position">
              <option value="right">Right</option>
              <option value="left">Left</option>
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </label>
          <label>Shape:
            <select id="group-shape">
              ${['rectangle', 'ellipse', 'hexagon', 'diamond', 'star', 'octagon', 'pentagon', 'triangle', 'rhomboid', 'roundrectangle', 'vee'].map(s => `<option value="${s}" ${current.shape === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </label>
          <label>Fill Color: <input type="color" id="group-fill" value="${current.fillColor || '#fbeed3'}"/></label>
          <label>Outline Color: <input type="color" id="group-outline" value="${current.outlineColor || '#b58f2f'}"/></label>
          <label>Label Color: <input type="color" id="group-label-color" value="${current.labelColor || '#222222'}"/></label>
          <label>Font Size: <input type="number" id="group-font-size" value="${parseInt(current.fontSize) || 14}" min="10" max="48"/> px</label>
          <label>Font Family:
            <select id="group-font-family">
              ${['Arial', 'Roboto', 'Courier', 'Verdana', 'Times New Roman'].map(f => `<option value="${f}" ${current.fontFamily === f ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </label>
          <label>Label Position:
            <select id="group-label-position">
              <option value="center" ${current.labelPosition === 'center' ? 'selected' : ''}>Center</option>
              <option value="top" ${current.labelPosition === 'top' ? 'selected' : ''}>Top</option>
              <option value="bottom" ${current.labelPosition === 'bottom' ? 'selected' : ''}>Bottom</option>
            </select>
          </label>
          <label>Width: <input type="number" id="group-width" value="${current.width || 120}" min="40" max="600"/></label>
          <label>Height: <input type="number" id="group-height" value="${current.height || 70}" min="40" max="600"/></label>
        </div>
        <div class="wizard-actions">
          <button id="group-add">${editId ? 'Update' : 'Add'}</button>
          <button id="group-cancel">Cancel</button>
        </div>
        </div>
      `;
      wizard.style.display = 'block';
      document.getElementById('group-add').onclick = () => {
        const name = document.getElementById('group-name').value.trim();
        const groupId = name.replace(/\s+/g, '_');
        const systemId = document.getElementById('group-system').value;
        const referenceGroup = document.getElementById('reference-group').value;
        const groupPosition = document.getElementById('group-position').value;
        const shape = document.getElementById('group-shape').value;
        const fillColor = document.getElementById('group-fill').value;
        const outlineColor = document.getElementById('group-outline').value;
        const labelColor = document.getElementById('group-label-color').value;
        const fontSize = document.getElementById('group-font-size').value;
        const fontFamily = document.getElementById('group-font-family').value;
        const labelPosition = document.getElementById('group-label-position').value;
        const width = parseInt(document.getElementById('group-width').value, 10);
        const height = parseInt(document.getElementById('group-height').value, 10);

        const nodeData = {
          id: groupId,
          label: name,
          parent: systemId,
          shape, fillColor, outlineColor, labelColor,
          fontSize, fontFamily, labelPosition,
          group: 'group',
          referenceGroup: referenceGroup || undefined,
          groupPosition: referenceGroup ? groupPosition : undefined,
          width,
          height
        };
        if (editId) {
          Canvas.updateNode(editId, nodeData);
        } else {
          window.diagramState.groups.push(nodeData);
          Canvas.addNode(nodeData);
        }
        wizard.style.display = 'none';
      };
      document.getElementById('group-cancel').onclick = () => { wizard.style.display = 'none'; };
    }
  }
}