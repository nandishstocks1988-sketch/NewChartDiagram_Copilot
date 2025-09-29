import { Canvas } from '../components/Canvas.js';

export function exportDiagram(format) {
  if (format === 'png') {
    window.html2canvas(document.getElementById('canvas')).then(canvasEl => {
      let imgData = canvasEl.toDataURL('image/png');
      let a = document.createElement('a');
      a.href = imgData;
      a.download = 'diagram.png';
      a.click();
    });
  } else if (format === 'svg') {
    if (Canvas.cy.svg) {
      const url = 'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(Canvas.cy.svg({ full: true, bg: "#f5f7fa" }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.svg';
      a.click();
    } else {
      alert('SVG export requires the cytoscape-svg plugin!');
    }
  } else if (format === 'json') {
    // Export connectors and all edge properties
    const diagram = Canvas.cy.json();
    diagram.legend = window.diagramState.legend || [];
    // Add connectors to nodes
    diagram.elements.nodes.forEach(node => {
      const n = Canvas.cy.$id(node.data.id);
      node.data.connectors = n.data('connectors') || [];
    });
    // Add all edge custom props
    diagram.elements.edges.forEach(edge => {
      const e = Canvas.cy.$id(edge.data.id);
      edge.data.lineStyle = e.data('lineStyle');
      edge.data.curveStyle = e.data('curveStyle');
      edge.data.color = e.data('color');
      edge.data.arrows = e.data('arrows');
    });
    const data = JSON.stringify(diagram, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'diagram.json';
    a.click();
  } else if (format === 'pdf') {
    window.html2canvas(document.getElementById('canvas')).then(canvasEl => {
      let imgData = canvasEl.toDataURL('image/png');
      let pdf = new window.jspdf.jsPDF({ orientation: 'landscape' });
      pdf.addImage(imgData, 'PNG', 10, 10,
        pdf.internal.pageSize.getWidth() - 20,
        pdf.internal.pageSize.getHeight() - 20
      );
      pdf.save('diagram.pdf');
    });
  }
}