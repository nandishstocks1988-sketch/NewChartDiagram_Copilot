// Entry point: advanced diagram builder initialization and UI wiring

import { Toolbar } from './components/Toolbar.js';
import { SystemWizard } from './components/SystemWizard.js';
import { GroupWizard } from './components/GroupWizard.js';
import { NodeWizard } from './components/NodeWizard.js';
import { LegendPanel } from './components/LegendPanel.js';
import { Canvas } from './components/Canvas.js';
import { Minimap } from './components/Minimap.js';
import { ContextMenu } from './components/ContextMenu.js';
import { Tooltip } from './components/Tooltip.js';

document.addEventListener('DOMContentLoaded', () => {
  Toolbar.init();
  SystemWizard.init();
  GroupWizard.init();
  NodeWizard.init();
  LegendPanel.init();
  Canvas.init();
  Minimap.init();
  ContextMenu.init();
  Tooltip.init();
});