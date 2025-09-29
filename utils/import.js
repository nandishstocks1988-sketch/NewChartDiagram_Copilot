import { Canvas } from '../components/Canvas.js';

export function importDiagram(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const json = JSON.parse(e.target.result);
    if (json.legend) window.diagramState.legend = json.legend;
    if (json.elements || json.data) {
      Canvas.cy.json(json);
      // Restore connectors
      (json.elements.nodes || []).forEach(node => {
        if (node.data.connectors) Canvas.cy.$id(node.data.id).data('connectors', node.data.connectors);
      });
      // Restore edge styles
      (json.elements.edges || []).forEach(edge => {
        const e = Canvas.cy.$id(edge.data.id);
        if (edge.data.lineStyle) e.data('lineStyle', edge.data.lineStyle);
        if (edge.data.curveStyle) e.data('curveStyle', edge.data.curveStyle);
        if (edge.data.color) e.data('color', edge.data.color);
        if (edge.data.arrows) e.data('arrows', edge.data.arrows);
      });
    } else {
      alert('Imported JSON does not contain diagram data!');
    }
  };
  reader.readAsText(file);
}