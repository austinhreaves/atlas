import ConceptPrincipleSection from '../sections/ConceptPrincipleSection'
import ConceptFormulaSection from '../sections/ConceptFormulaSection'
import ConceptVariablesSection from '../sections/ConceptVariablesSection'
import ConceptApplicabilitySection from '../sections/ConceptApplicabilitySection'
import ConceptLimitingCasesSection from '../sections/ConceptLimitingCasesSection'
import ConceptAssumptionsSection from '../sections/ConceptAssumptionsSection'
import ConceptDescriptionSection from '../sections/ConceptDescriptionSection'
import ConceptMisconceptionsSection from '../sections/ConceptMisconceptionsSection'
import ConceptHistorySection from '../sections/ConceptHistorySection'
import ConceptLinksSection from '../sections/ConceptLinksSection'
import ConceptVisualSceneSection from '../sections/ConceptVisualSceneSection'

export default function ConceptPanel({
  selectedNode,
  prerequisiteLinks,
  enablesLinks,
  showIdealizedAssumptions,
  setShowIdealizedAssumptions,
  onSelectEntity,
}) {
  const variableRows = selectedNode?.variables ?? []
  const applicabilityConditions = Array.isArray(selectedNode?.applicability_conditions)
    ? selectedNode.applicability_conditions
    : []
  const limitingCases = Array.isArray(selectedNode?.limiting_cases) ? selectedNode.limiting_cases : []
  const misconceptions = Array.isArray(selectedNode?.misconceptions) ? selectedNode.misconceptions : []
  const idealizations = selectedNode?.idealizations ?? []
  const visibleIdealizations = idealizations.filter((idealization) => idealization.scope !== 'idealized')
  const idealizedAssumptions = idealizations.filter((idealization) => idealization.scope === 'idealized')

  return (
    <>
      <ConceptPrincipleSection principle={selectedNode.principle} />
      <ConceptFormulaSection formula={selectedNode.formula} />
      <ConceptVariablesSection
        selectedNode={selectedNode}
        variableRows={variableRows}
        onSelectEntity={onSelectEntity}
      />
      <ConceptApplicabilitySection
        selectedNodeId={selectedNode.id}
        applicabilityConditions={applicabilityConditions}
      />
      <ConceptLimitingCasesSection selectedNodeId={selectedNode.id} limitingCases={limitingCases} />
      <ConceptAssumptionsSection
        selectedNodeId={selectedNode.id}
        visibleIdealizations={visibleIdealizations}
        idealizedAssumptions={idealizedAssumptions}
        showIdealizedAssumptions={showIdealizedAssumptions}
        setShowIdealizedAssumptions={setShowIdealizedAssumptions}
      />
      <ConceptDescriptionSection description={selectedNode.description} />
      <ConceptMisconceptionsSection selectedNodeId={selectedNode.id} misconceptions={misconceptions} />
      <ConceptHistorySection historicalContext={selectedNode.historical_context} />
      <ConceptLinksSection
        selectedNodeId={selectedNode.id}
        prerequisiteLinks={prerequisiteLinks}
        enablesLinks={enablesLinks}
        onSelectEntity={onSelectEntity}
      />
      <ConceptVisualSceneSection selectedNode={selectedNode} />
    </>
  )
}
