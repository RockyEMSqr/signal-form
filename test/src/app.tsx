import { useRef, useState, useCallback } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import { SignalForm } from '../../src/form';
import { Input, LabeledInput, LabeledTextInput } from '../../src/input';
import { signal, useSignal } from '@preact/signals';
import { deepSignal, useDeepSignal } from 'deepsignal'
export function App() {
  const [count, setCount] = useState(0)
  const formData = useDeepSignal<{
    a: any,
    b: any,
    c: any
  }>({ a: 1, b: 'b', c: 'c' });
  let tick = useCallback(() => {
    console.log('making tick', formData.a)
    formData.a++;
    return formData.a;
  }, [formData.$a])
  let ref = useRef(setTimeout(() => {

    console.log('Tick', tick());
  }, 1000))
  return (
    <>
      <SignalForm initData={({ b: 2 })} onSubmit={(e, signal) => {
        console.log(signal, formData === signal)
        //equal when passed the signal but doesn't rerender

        // set it to render?
        // formData.value = { ...signal.value };
      }}>
        <Input name="a" value={formData.$a} />
        <Input name="b" />
        <Input name="c" />
        <LabeledInput label="Doesn't have initial data" name="x" />
        <LabeledTextInput label="AAAAAA" name="a" />
        <LabeledTextInput label="BBBB" name="b" />
        <button>Submit</button>
      </SignalForm>
      <pre>{JSON.stringify(formData, undefined, '  ')}</pre>
      <p>{formData.$a}</p>
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
