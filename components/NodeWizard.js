import { Canvas } from './Canvas.js';

export const NodeWizard = {
  init: function () {
    window.showNodeWizard = (editId = null) => {
      const wizard = document.getElementById('wizard');
      let current = editId ? Canvas.cy.$id(editId).data() : {};
      let connectors = current.connectors || [];
      const groupOptions = window.diagramState.groups.map(g => `<option value="${g.id}" ${current.parent === g.id ? 'selected' : ''}>${g.label}</option>`).join('');
      const nodeOptions = window.diagramState.nodes.map(n => `<option value="${n.id}" ${connectors.find(c => c.target === n.id) ? 'selected' : ''}>${n.label}</option>`).join('');
      wizard.innerHTML = `
        <div class="wizard-modal" style="max-height:80vh;overflow-y:auto;">
          <h3>${editId ? 'Edit' : 'Add'} Node</h3>
          <div class="wizard-fields">
            <label>Name: <input id="node-name" value="${current.label || ''}" /></label>
            <label>Group: <select id="node-group">
              ${groupOptions}
            </select></label>
            <label>Reference Node:
              <select id="reference-node">
                <option value="">None</option>
                ${window.diagramState.nodes.map(n => `<option value="${n.id}">${n.label}</option>`).join('')}
              </select>
            </label>
            <label>Position:
              <select id="node-position">
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
            </label>
            <label>Shape:
              <select id="node-shape">
                ${['ellipse', 'rectangle', 'hexagon', 'diamond', 'star', 'octagon', 'pentagon', 'triangle', 'rhomboid', 'roundrectangle', 'vee'].map(s => `<option value="${s}" ${current.shape === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </label>
            <label>Fill Color: <input type="color" id="node-fill" value="${current.fillColor || '#d3efd6'}"/></label>
            <label>Outline Color: <input type="color" id="node-outline" value="${current.outlineColor || '#3ab94a'}"/></label>
            <label>Label Color: <input type="color" id="node-label-color" value="${current.labelColor || '#222222'}"/></label>
            <label>Font Size: <input type="number" id="font-size" value="${parseInt(current.fontSize) || 14}" min="10" max="48"/> px</label>
            <label>Font Family:
              <select id="font-family">
                ${['Arial', 'Roboto', 'Courier', 'Verdana', 'Times New Roman'].map(f => `<option value="${f}" ${current.fontFamily === f ? 'selected' : ''}>${f}</option>`).join('')}
              </select>
            </label>
            <label>Label Position:
              <select id="label-position">
                <option value="center" ${current.labelPosition === 'center' ? 'selected' : ''}>Center</option>
                <option value="top" ${current.labelPosition === 'top' ? 'selected' : ''}>Top</option>
                <option value="bottom" ${current.labelPosition === 'bottom' ? 'selected' : ''}>Bottom</option>
              </select>
            </label>
            <label>Width: <input type="number" id="node-width" value="${current.width || 80}" min="40" max="600"/></label>
            <label>Height: <input type="number" id="node-height" value="${current.height || 80}" min="40" max="600"/></label>
            <button id="add-connector-btn">Connections</button>
            <div id="connector-section" style="display:none;"></div>
          </div>
          <div class="wizard-actions">
            <button id="node-add">${editId ? 'Update' : 'Add'}</button>
            <button id="node-cancel">Cancel</button>
          </div>
        </div>
      `;
      wizard.style.display = 'block';

      document.getElementById('add-connector-btn').onclick = () => {
        const section = document.getElementById('connector-section');
        section.style.display = 'block';
        section.innerHTML = `
          <label>Search: <input type="text" id="connector-search" placeholder="Search..." /></label>
          <label>Select target nodes:
            <select id="connector-targets" multiple style="height:100px;width:180px;">
              ${window.diagramState.nodes.map(n => `<option value="${n.id}" ${connectors.find(c => c.target === n.id) ? 'selected' : ''}>${n.label}</option>`).join('')}
            </select>
          </label>
          <div class="chip-list" id="selected-chips">
            ${(connectors || []).map(c => `<span class="chip">${c.target}</span>`).join('')}
          </div>
          <label>Connector color: <input type="color" id="connector-color" value="#3949ab"/></label>
          <label>Connector label: <input id="connector-label" value=""/></label>
          <label>Connector type:
            <select id="connector-type">
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </label>
          <label>Curve Style:
            <select id="connector-curve">
              <option value="bezier">Bezier</option>
              <option value="unbundled-bezier">Unbundled Bezier</option>
              <option value="straight">Straight</option>
              <option value="taxi">Taxi</option>
            </select>
          </label>
          <label>Arrows:
            <select id="connector-arrows">
              <option value="single">Single Arrow</option>
              <option value="double">Double Arrow</option>
              <option value="none">No Arrow</option>
            </select>
          </label>
          <button id="add-connector-final">Save connection</button>
        `;
        document.getElementById('connector-search').onkeyup = function () {
          const search = this.value.toLowerCase();
          const select = document.getElementById('connector-targets');
          Array.from(select.options).forEach(opt => {
            opt.style.display = opt.text.toLowerCase().includes(search) ? '' : 'none';
          });
        };
        document.getElementById('connector-targets').onchange = function () {
          const targets = Array.from(this.selectedOptions).map(opt => opt.value);
          document.getElementById('selected-chips').innerHTML = targets.map(t => `<span class="chip">${t}</span>`).join('');
        };
        document.getElementById('add-connector-final').onclick = () => {
          const targets = Array.from(document.getElementById('connector-targets').selectedOptions).map(opt => opt.value);
          const color = document.getElementById('connector-color').value;
          const label = document.getElementById('connector-label').value;
          const type = document.getElementById('connector-type').value;
          const curveStyle = document.getElementById('connector-curve').value;
          const arrows = document.getElementById('connector-arrows').value;
          connectors = targets.map(target => ({
            target, color, label, type, curveStyle, arrows
          }));
          section.style.display = 'none';
        };
      };

      document.getElementById('node-add').onclick = () => {
        const name = document.getElementById('node-name').value.trim();
        const nodeId = name.replace(/\s+/g, '_');
        const groupId = document.getElementById('node-group').value;
        const referenceNode = document.getElementById('reference-node').value;
        const nodePosition = document.getElementById('node-position').value;
        const shape = document.getElementById('node-shape').value;
        const fillColor = document.getElementById('node-fill').value;
        const outlineColor = document.getElementById('node-outline').value;
        const labelColor = document.getElementById('node-label-color').value;
        const fontSize = document.getElementById('font-size').value;
        const fontFamily = document.getElementById('font-family').value;
        const labelPosition = document.getElementById('label-position').value;
        const width = parseInt(document.getElementById('node-width').value, 10);
        const height = parseInt(document.getElementById('node-height').value, 10);

        const nodeData = {
          id: nodeId,
          label: name,
          parent: groupId,
          shape, fillColor, outlineColor, labelColor,
          fontSize, fontFamily, labelPosition,
          group: 'node',
          referenceNode: referenceNode || undefined,
          nodePosition: referenceNode ? nodePosition : undefined,
          connectors,
          width,
          height
        };
        if (editId) {
          Canvas.updateNode(editId, nodeData);
        } else {
          window.diagramState.nodes.push(nodeData);
          Canvas.addNode(nodeData);
          connectors.forEach(c => {
            Canvas.addEdge({
              id: `${nodeId}->${c.target}`,
              source: nodeId,
              target: c.target,
              label: c.label,
              color: c.color,
              lineStyle: c.type,
              curveStyle: c.curveStyle,
              arrows: c.arrows
            });
          });
        }
        wizard.style.display = 'none';
      };
      document.getElementById('node-cancel').onclick = () => { wizard.style.display = 'none'; };
    }
  }
}