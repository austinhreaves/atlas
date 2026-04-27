import ConstructionApp from './construction/ConstructionApp.jsx'
import ReferenceApp from './reference/ReferenceApp.jsx'

export default function App() {
  const isConstructMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mode') === 'construct'

  return isConstructMode ? <ConstructionApp /> : <ReferenceApp />
}
