import { Toolbar } from './components/Toolbar.js';
import { SystemWizard } from './components/SystemWizard.js';
import { GroupWizard } from './components/GroupWizard.js';
import { NodeWizard } from './components/NodeWizard.js';
import { LegendPanel } from './components/LegendPanel.js';
import { Canvas } from './components/Canvas.js';
import { Minimap } from './components/Minimap.js';
import { ContextMenu } from './components/ContextMenu.js';
import { Tooltip } from './components/Tooltip.js';

// Make main objects globally accessible for debugging
window.Toolbar = Toolbar;
window.SystemWizard = SystemWizard;
window.GroupWizard = GroupWizard;
window.NodeWizard = NodeWizard;
window.LegendPanel = LegendPanel;
window.Canvas = Canvas;
window.Minimap = Minimap;
window.ContextMenu = ContextMenu;
window.Tooltip = Tooltip;

window.diagramState = {
  systems: [],
  groups: [],
  nodes: [],
  edges: [],
  legend: [],
  theme: 'light'
};

document.addEventListener('DOMContentLoaded', () => {
  Canvas.init();
  Toolbar.init();
  LegendPanel.init();
  Minimap.init();
  ContextMenu.init();
  Tooltip.init();
  SystemWizard.init();
  GroupWizard.init();
  NodeWizard.init();
});