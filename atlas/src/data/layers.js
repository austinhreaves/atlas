import { validateConceptNode, validateVariableNode } from './schema'

export const LAYERS = {
  concept: {
    shape: 'circle',
    default_visible: true,
    schema_validator: validateConceptNode,
  },
  variable: {
    shape: 'diamond',
    default_visible: false,
    schema_validator: validateVariableNode,
  },
  problem: {
    shape: 'square',
    default_visible: false,
    schema_validator: null,
  },
  lab: {
    shape: 'hexagon',
    default_visible: false,
    schema_validator: null,
  },
  experiment: {
    shape: 'octagon',
    default_visible: false,
    schema_validator: null,
  },
}
