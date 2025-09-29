import { Canvas } from '../components/Canvas.js';

export function autoLayout() {
  Canvas.cy.layout({ name: 'cose', animate: true }).run();
}