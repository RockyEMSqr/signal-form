import { useRef, useState, useCallback, useEffect } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import { SignalForm, toNestedSignal } from '../../src/form';
import { Input, LabeledInput, LabeledTextInput } from '../../src/input';
import { useMappedSignal, useNestedSignal } from '../../src/hooks';
import { useSignal } from '@preact/signals';
type TestModel = {
  a: any,
  b: any,
  c: any,
  sub: { a: number, b: number, c: number }
}
export function App() {
  let submittedData = useSignal('Not submitted Yet');

  const [count, setCount] = useState(0)
  const initformData: TestModel = {
    a: 1, b: 'b', c: 'hello',
    sub: { a: 1, b: 2, c: 3 }
  };
  let formData = useNestedSignal(initformData)
  let tick = useCallback(() => {
    formData.a.value++;
  }, [])
  useEffect(() => {
    setInterval(() => {
      tick();
    }, 1000);
  }, [])

  submittedData.subscribe((a) => {
    console.log(a);
  })
  return (
    <>
      <button onClick={e => {
        console.log(submittedData.value);
        console.log(formData)
      }}>Console log state</button>
      <SignalForm signal={formData} onSubmit={(e, signal) => {
        console.log(signal, formData, formData === signal, JSON.stringify(signal));
        let doubled = (signal.a.value * 2);
        console.log('doubled ', doubled);
        submittedData.value = {
          x: ';akldfs;ajdffal;akdlsf;akldsfj ' + doubled.toString(),
          ...JSON.parse(JSON.stringify(signal))

        };
        //equal when passed the signal but doesn't rerender

        // set it to render?
        // formData.value = {...signal.value};
      }}>
        <Input name="a" />
        {/* <Input name="b" /> */}
        {/* <Input name="c" /> */}
        {/* <LabeledInput label="Doesn't have initial data" name="x" /> */}
        {/* <LabeledTextInput label="AAAAAA" name="a" /> */}
        <LabeledTextInput label="B" name="b" />
        <LabeledTextInput label="B" name="c" />

        <LabeledTextInput label="sub.a" name="sub.a" />
        <button>Submit</button>
      </SignalForm >
      <pre>{JSON.stringify(formData, undefined, '  ')}</pre>
      <h2>Submitted:</h2>
      <pre>{JSON.stringify(submittedData, undefined, '  ')}</pre>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div >
      <h1>Vite + Preact</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
      <p>
        Check out{' '}
        <a
          href="https://preactjs.com/guide/v10/getting-started#create-a-vite-powered-preact-app"
          target="_blank"
        >
          create-preact
        </a>
        , the official Preact + Vite starter
      </p>
      <p class="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
    </>
  )
}
