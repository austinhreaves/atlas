import concepts from './concepts.json'
import variables from './variables.json'

export function getAllEntities() {
  return [...concepts, ...variables]
}

export function getEntitiesByLayer(layerName) {
  return getAllEntities().filter((entity) => entity.layer === layerName)
}

export function computeAppearsIn(variableEntities = variables, conceptEntities = concepts) {
  const appearsIn = Object.fromEntries(variableEntities.map((variable) => [variable.id, []]))

  for (const concept of conceptEntities) {
    for (const variableRef of concept.variables ?? []) {
      if (!(variableRef.id in appearsIn)) {
        continue
      }
      appearsIn[variableRef.id].push(concept.id)
    }
  }

  for (const key of Object.keys(appearsIn)) {
    appearsIn[key] = [...new Set(appearsIn[key])].sort()
  }

  return appearsIn
}

export { concepts, variables }
