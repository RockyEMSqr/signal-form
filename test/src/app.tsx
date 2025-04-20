import { LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso'
import { Example1 } from './examples/1'
import { Example2 } from './examples/2'
import { FormStateTinker } from './examples/formState'
export function App() {
  return <LocationProvider>
    <ErrorBoundary>
      <Router>
        {/* <Home path="/" /> */}
        {/* Alternative dedicated route component for better TS support */}
        {/* <Route path="/*" component={Example1} /> */}
        <Route path="/" component={Example2} />
        <Route path="/ex1/*" component={Example1} />
        <Route path="/ex3" component={FormStateTinker} />
        {/* <Route path="/profile/:id" component={Profile} /> */}
        {/* `default` prop indicates a fallback route. Useful for 404 pages */}
        {/* <NotFound default /> */}
      </Router>
    </ErrorBoundary>
  </LocationProvider>

}

