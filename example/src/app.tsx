import { LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso'
import { RoutingExample } from './examples/1'
import { DateTimesEx } from './examples/dateandtimes'
import { FormStateTinker } from './examples/formState'
import { LoadDataLater } from './examples/loadDataLater'
import { WysiwygEx } from './examples/wysiwyg'
import { AddressEx } from './examples/address'
import { ReactiveTest } from './examples/reactiveTest'
import { SignalForm, TextInput, useSignalForm } from '../../src'
import { useEffect } from 'preact/hooks'
export function App() {
  const {formState}= useSignalForm();

  useEffect(()=>{
    (async ()=>{
      setTimeout(()=>{
        // debugger;
        // formState.formDataSignal.value = formState.formDataSignal.value || {};
        // formState.formDataSignal.value.name = formState.formDataSignal.value.name || {};
        formState.formDataSignal.name.first = 'FOOOOOOOO';
        formState.formDataSignal.firstName = 'FOOOOOAGAIN'
      }, 5000)
    })()
  }, [])
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

      <SignalForm formState={formState} onSubmit={(e,d)=>{
        console.log(d)
      }}>
        <button onClick={e=>{
          console.log(formState)
        }} type="button">Console signal</button>
        <TextInput name="name.first" label="First Name"></TextInput>
        <TextInput name="firstName" label="First Name"></TextInput>
        <button>Console</button>
      </SignalForm>
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

