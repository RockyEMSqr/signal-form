import { LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso'
import { RoutingExample } from './examples/1'
import { DateTimesEx } from './examples/dateandtimes'
import { FormStateTinker } from './examples/formState'
import { LoadDataLater } from './examples/loadDataLater'
import { WysiwygEx } from './examples/wysiwyg'
import { AddressEx } from './examples/address'
import { ReactiveTest } from './examples/reactiveTest'
export function App() {
  return <LocationProvider>
    <ul>
      <li><a href="/loadDataLater/">Load Data Later</a></li>
      <li><a href="/dates">Dates</a></li>
      <li><a href="/formstate/">Form State</a></li>
      <li><a href="/ex1/">Routing</a></li>
      <li><a href="/wysiwyg/">wysiwyg</a></li>
      <li><a href="/address">address</a></li>
      <li><a href="/reactivetest">Reactive Test</a></li>
    </ul>
    <ErrorBoundary>
      <Router>
        {/* <Home path="/" /> */}
        {/* Alternative dedicated route component for better TS support */}
        {/* <Route path="/*" component={Example1} /> */}
        <Route path="/dates" component={DateTimesEx} />
        <Route path="/ex1/:section*" component={RoutingExample} />
        <Route path="/formstate" component={FormStateTinker} />
        <Route path="/ex3" component={FormStateTinker} />
        <Route path="/loadDataLater" component={LoadDataLater} />
        <Route index path="/wysiwyg" component={WysiwygEx} />
        <Route index path="/address" component={AddressEx} />
        <Route index path="/reactivetest" component={ReactiveTest} />
        {/* <Route path="/profile/:id" component={Profile} /> */}
        {/* `default` prop indicates a fallback route. Useful for 404 pages */}
        {/* <NotFound default /> */}

        <Route default component={() => <>404</>} />
      </Router>
    </ErrorBoundary>
  </LocationProvider>

}

