export const LegendPanel = {
  init: function () {
    window.showLegendWizard = () => {
      const wizard = document.getElementById('wizard');
      let rows = window.diagramState.legend.map((item, i) => `
        <div>
          <input type="color" value="${item.color || '#6dbbfa'}" id="legend-color-${i}" />
          <input type="text" value="${item.label || ''}" id="legend-label-${i}" style="width:100px"/>
          <input type="text" value="${item.font || '12px Arial'}" id="legend-font-${i}" style="width:100px"/>
          <button onclick="document.getElementById('legend-row-${i}').remove()">❌</button>
        </div>
      `).join("");
      wizard.innerHTML = `
        <div style="background:#fff; padding:24px; border-radius:8px; position:fixed; top:140px; left:50%; transform:translateX(-50%); box-shadow:0 2px 12px rgba(0,0,0,0.13); z-index:999;">
          <h3>User Legend</h3>
          <div id="legend-rows">${rows}</div>
          <button id="legend-add-row">Add Row</button>
          <button id="legend-save">Save</button>
          <button id="legend-cancel">Cancel</button>
        </div>
      `;
      wizard.style.display = 'block';
      document.getElementById('legend-add-row').onclick = () => {
        let idx = window.diagramState.legend.length;
        let row = document.createElement('div');
        row.id = `legend-row-${idx}`;
        row.innerHTML = `
          <input type="color" value="#6dbbfa" id="legend-color-${idx}" />
          <input type="text" value="" id="legend-label-${idx}" style="width:100px"/>
          <input type="text" value="12px Arial" id="legend-font-${idx}" style="width:100px"/>
          <button onclick="document.getElementById('legend-row-${idx}').remove()">❌</button>
        `;
        document.getElementById('legend-rows').appendChild(row);
        window.diagramState.legend.push({ color: "#6dbbfa", label: "", font: "12px Arial" });
      };
      document.getElementById('legend-save').onclick = () => {
        let newLegend = [];
        let rows = document.querySelectorAll('#legend-rows > div');
        rows.forEach((row, i) => {
          newLegend.push({
            color: row.querySelector(`#legend-color-${i}`).value,
            label: row.querySelector(`#legend-label-${i}`).value,
            font: row.querySelector(`#legend-font-${i}`).value,
          });
        });
        window.diagramState.legend = newLegend;
        wizard.style.display = 'none';
      };
      document.getElementById('legend-cancel').onclick = () => { wizard.style.display = 'none'; };
    }
    setInterval(() => {
      let html = `<b>Legend</b><br>`;
      for (const item of window.diagramState.legend) {
        html += `<div style="display:flex;align-items:center;">
          <span style="display:inline-block;width:16px;height:16px;background:${item.color};margin-right:6px;border-radius:3px;"></span>
          <span style="font:${item.font};">${item.label}</span>
        </div>`;
      }
      document.getElementById('legend-panel').innerHTML = html;
    }, 1000);
  }
}