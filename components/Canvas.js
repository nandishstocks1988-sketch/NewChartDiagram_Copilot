export const Canvas = {
  cy: null,
  theme: 'light',
  undoStack: [],
  redoStack: [],
  connectMode: false,
  connectSource: null,

  init: function () {
    this.cy = cytoscape({
      container: document.getElementById('canvas'),
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'width': 'data(width)',
            'height': 'data(height)',
            'background-color': 'data(fillColor)',
            'border-color': 'data(outlineColor)',
            'border-width': 3,
            'label': 'data(label)',
            'color': 'data(labelColor)',
            'shape': 'data(shape)',
            'font-size': 'data(fontSize)',
            'font-family': 'data(fontFamily)',
            'text-wrap': 'wrap',
            'text-max-width': 80,
            'text-valign': 'center',
            'text-halign': 'center',
            'overlay-padding': 6,
          }
        },
        {
          selector: '$node > node',
          style: { 'padding': 20 }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'source-arrow-color': 'data(color)',
            'line-style': 'data(lineStyle)',
            'curve-style': 'data(curveStyle)',
            'target-arrow-shape': 'data(targetArrowShape)',
            'source-arrow-shape': 'data(sourceArrowShape)',
            'label': 'data(label)',
            'font-size': 14,
            'color': '#3949ab',
            'text-background-color': '#fff',
            'text-background-opacity': 1,
            'text-background-padding': 2
          }
        }
      ],
      layout: { name: 'preset' },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      zoom: 1,
      minZoom: 0.3,
      maxZoom: 2
    });

    // Node-editing plugin (resize)
    if (window.cytoscapeNodeEditing) {
      window.cytoscapeNodeEditing(this.cy, {
        enabled: true,
        allowResize: true,
        allowRotation: false,
        resizeToContentCueEnabled: true,
        grapplesSize: 12,
        minWidth: 40,
        minHeight: 40,
        boundingRectangleLineColor: "red",
        boundingRectangleLineWidth: 1.5,
        zIndex: 999,
      });
    }

    // Persist node size and position after resize
    this.cy.on('nodeediting.resized', (evt) => {
      const node = evt.target;
      node.data('width', node.width());
      node.data('height', node.height());
      node.data('position', node.position());
    });

    // Edgehandles plugin (for drag/drop connectors)
    if (window.cytoscapeEdgehandles) {
      window.cytoscapeEdgehandles(this.cy, {
        preview: true,
        hoverDelay: 150,
        handleNodes: 'node',
        handlePosition: 'middle top',
        edgeType: function () { return 'flat'; },
        loopAllowed: function () { return false; },
      });
    }

    // Context menu plugin
    if (window.cxtmenu) {
      window.cxtmenu(this.cy, {
        selector: 'node',
        commands: [
          {
            content: 'Edit', select: (ele) => {
              if (ele.data('group') === 'system') window.showSystemWizard(ele.id());
              else if (ele.data('group') === 'group') window.showGroupWizard(ele.id());
              else window.showNodeWizard(ele.id());
            }
          },
          { content: 'Delete', select: (ele) => { ele.remove(); } },
        ]
      });
    }

    this.cy.on('tap', 'node', (evt) => {
      if (this.connectMode) {
        if (!this.connectSource) {
          this.connectSource = evt.target.id();
        } else {
          const source = this.connectSource;
          const target = evt.target.id();
          this.addEdge({ id: `${source}->${target}`, source, target, label: `${source}→${target}`, color: "#3949ab", lineStyle: "solid", curveStyle: "bezier", arrows: "single" });
          this.connectSource = null;
          this.connectMode = false;
        }
        return;
      }
      const node = evt.target;
      const tooltip = document.getElementById('tooltip');
      tooltip.innerHTML = `<b>${node.data('label')}</b><br>Group: ${node.data('group') || ''}<br>Color: ${node.data('fillColor') || node.data('color')}<br>Font: ${node.data('fontFamily')}<br>Label Position: ${node.data('labelPosition')}`;
      tooltip.style.left = evt.originalEvent.pageX + 'px';
      tooltip.style.top = evt.originalEvent.pageY + 'px';
      tooltip.style.display = 'block';
      setTimeout(() => { tooltip.style.display = 'none'; }, 2000);
    });

    this.cy.on('dbltap', 'node', (evt) => {
      const node = evt.target;
      if (node.data('group') === 'system') window.showSystemWizard(node.id());
      else if (node.data('group') === 'group') window.showGroupWizard(node.id());
      else window.showNodeWizard(node.id());
    });

    this.cy.on('tap', (evt) => {
      if (evt.target === this.cy) {
        document.getElementById('tooltip').style.display = 'none';
      }
    });
  },

  addNode: function (data, position) {
    if (!data.id) data.id = data.label || (Math.random() + "").slice(2, 10);
    if (!data.width) data.width = 120;
    if (!data.height) data.height = 80;
    if (!position && data.position) position = data.position;

    // SYSTEM AUTOGAP & REFERENCE LOGIC
    if (data.group === 'system') {
      if (data.referenceSystem && data.systemPosition) {
        const refNode = this.cy.$id(data.referenceSystem);
        if (refNode) {
          let { x, y } = refNode.position();
          const offset = 250;
          if (data.systemPosition === 'right') x += offset;
          else if (data.systemPosition === 'left') x -= offset;
          else if (data.systemPosition === 'above') y -= offset;
          else if (data.systemPosition === 'below') y += offset;
          position = { x, y };
        }
      } else if (!position) {
        const systems = this.cy.nodes('[group="system"]');
        let lastX = 150;
        systems.forEach((sys, idx) => {
          const sysPos = sys.position();
          if (sysPos.x > lastX) lastX = sysPos.x;
        });
        position = { x: lastX + 250, y: 120 };
      }
    }

    // GROUP AUTOGAP & REFERENCE LOGIC (FIXED!)
    if (data.group === 'group') {
      if (data.referenceGroup && data.groupPosition) {
        const refNode = this.cy.$id(data.referenceGroup);
        if (refNode) {
          let { x, y } = refNode.position();
          const offset = 120;
          if (data.groupPosition === 'right') x += offset;
          else if (data.groupPosition === 'left') x -= offset;
          else if (data.groupPosition === 'above') y -= offset;
          else if (data.groupPosition === 'below') y += offset;
          position = { x, y };
        }
      } else if (!position) {
        // Place relative to parent system (fix!)
        const parentSys = this.cy.$id(data.parent);
        let baseX = 250, baseY = 200;
        if (parentSys) {
          const sysPos = parentSys.position();
          baseX = sysPos.x + 100;
          baseY = sysPos.y + 100;
        }
        const siblingGroups = this.cy.nodes(`[group="group"][parent="${data.parent}"]`);
        let offsetY = baseY + siblingGroups.length * 120;
        position = { x: baseX, y: offsetY };
      }
    }

    // NODE AUTOGAP & REFERENCE LOGIC (FIXED!)
    if (data.group === 'node') {
      if (data.referenceNode && data.nodePosition) {
        const refNode = this.cy.$id(data.referenceNode);
        if (refNode) {
          let { x, y } = refNode.position();
          const offset = 80;
          if (data.nodePosition === 'right') x += offset;
          else if (data.nodePosition === 'left') x -= offset;
          else if (data.nodePosition === 'above') y -= offset;
          else if (data.nodePosition === 'below') y += offset;
          position = { x, y };
        }
      } else if (!position) {
        // Place relative to parent group (fix!)
        const parentGroup = this.cy.$id(data.parent);
        let baseX = 300, baseY = 300;
        if (parentGroup) {
          const grpPos = parentGroup.position();
          baseX = grpPos.x + 50;
          baseY = grpPos.y + 50;
        }
        const siblingNodes = this.cy.nodes(`[group="node"][parent="${data.parent}"]`);
        let offsetY = baseY + siblingNodes.length * 80;
        position = { x: baseX, y: offsetY };
      }
    }

    let ele = this.cy.add({ group: 'nodes', data, position });
    if (data.parent) ele.move({ parent: data.parent });
    this.fitParents(data.parent);
  },

  addEdge: function (data) {
    let targetArrowShape = "triangle", sourceArrowShape = "none";
    if (data.arrows === "double") { targetArrowShape = "triangle"; sourceArrowShape = "triangle"; }
    if (data.arrows === "none") { targetArrowShape = "none"; sourceArrowShape = "none"; }
    if (data.arrows === "single") { targetArrowShape = "triangle"; sourceArrowShape = "none"; }
    data.targetArrowShape = targetArrowShape;
    data.sourceArrowShape = sourceArrowShape;
    if (!data.curveStyle) data.curveStyle = "bezier";
    this.cy.add({ group: 'edges', data });
    this.undoStack.push({ action: 'addEdge', data });
  },

  updateNode: function (id, props) {
    let node = this.cy.$id(id);
    for (let k in props) node.data(k, props[k]);
    if (props.position) node.position(props.position);
    if (props.width) node.data('width', props.width);
    if (props.height) node.data('height', props.height);
    this.fitParents(node.data('parent'));
  },

  fitParents: function (parentId) {
    if (!parentId) return;
    let parent = this.cy.$id(parentId);
    if (parent) parent.style('width', parent.boundingBox().w + 40).style('height', parent.boundingBox().h + 40);
  },

  zoom: function (delta) {
    const z = this.cy.zoom() + delta;
    this.cy.zoom({ level: Math.max(0.3, Math.min(2, z)) });
  },

  undo: function () {
    const last = this.undoStack.pop();
    if (!last) return;
    if (last.action === 'addNode') this.cy.$id(last.data.id).remove();
    if (last.action === 'addEdge') this.cy.$id(last.data.id).remove();
    this.redoStack.push(last);
  },

  redo: function () {
    const last = this.redoStack.pop();
    if (!last) return;
    if (last.action === 'addNode') this.addNode(last.data);
    if (last.action === 'addEdge') this.addEdge(last.data);
  },

  startConnectMode: function () {
    this.connectMode = true;
    this.connectSource = null;
  },

  toggleTheme: function (themeName) {
    this.theme = themeName;
    let nodeColor = '#222', borderColor = '#333', bg = '#f5f7fa';
    let edgeColor = '#7d7d7d', textBg = '#fff';
    if (themeName === 'dark') {
      nodeColor = '#fff'; borderColor = '#eee'; bg = '#222';
      edgeColor = '#fff'; textBg = '#333';
    } else if (themeName === 'contrast') {
      nodeColor = '#000'; borderColor = '#ff0'; bg = '#fff';
      edgeColor = '#d00'; textBg = '#ff0';
    }
    document.getElementById('canvas').style.background = bg;
    this.cy.style().fromJson([
      {
        selector: 'node',
        style: {
          'width': 'data(width)',
          'height': 'data(height)',
          'background-color': 'data(fillColor)',
          'border-color': 'data(outlineColor)',
          'border-width': 3,
          'label': 'data(label)',
          'color': 'data(labelColor)',
          'shape': 'data(shape)',
          'font-size': 'data(fontSize)',
          'font-family': 'data(fontFamily)',
          'text-wrap': 'wrap',
          'text-max-width': 80,
          'text-valign': 'center',
          'text-halign': 'center',
          'overlay-padding': 6,
        }
      },
      {
        selector: '$node > node',
        style: { 'padding': 20 }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': edgeColor,
          'target-arrow-color': edgeColor,
          'source-arrow-color': edgeColor,
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': 14,
          'color': edgeColor,
          'text-background-color': textBg,
          'text-background-opacity': 1,
          'text-background-padding': 2
        }
      }
    ]).update();
  }
}