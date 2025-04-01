import { useRef, useState, useCallback, useEffect } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import { SignalForm } from '../../src/form';
import { Input, LabeledInput, LabeledTextInput } from '../../src/input';
// import { useMappedSignal, useNestedSignal } from '../../src/hooks';
import { Signal, useSignal } from '@preact/signals';
import { useDeepSignal } from '../../src/deepSignal';
import { getSignal } from '../../src/utils';
type Person = {
  name: string
}
type TestModel = {
  a: any,
  b: any,
  c: any,
  people: Person[]
  sub: { a: number, b: number, c: number }
}
export const Example = (p: { name: keyof TestModel }) => {
  return <div></div>
}
export function App() {
  let submittedData = useSignal<any>('Not submitted Yet');

  const [count, setCount] = useState(0)
  const initformData: TestModel = {
    a: 1, b: 'b', c: 'hello',
    sub: { a: 1, b: 2, c: 3 },
    people: [{ name: 'rocky' }, { name: 'YEEEEE' }]
  };
  // let formData = useNestedSignal(initformData);
  // let deepSignal = useDeepSignal(initformData);
  let formData = useDeepSignal(initformData);
  let tick = useCallback(() => {
    formData.a++;
    formData.sub.a++;
    // console.log(formData.sub);
    // deepSignal.a++;
    // console.log(deepSignal.sub)
    formData.people[0].name = 'rocky' + ' ' + Date.now()
  }, [])
  useEffect(() => {
    setInterval(() => {
      tick();
    }, 1000);
  }, [])
  return (
    <>
      <button onClick={e => {
        let s = getSignal(formData, 'xxxx');
        formData.xxxx = 'XXXX';
      }}>Put value in formData deepSignal</button>
      <button onClick={e => {
        console.log(submittedData.value);
        debugger;
        console.log(formData)
      }}>Console log state</button>
      <SignalForm signal={formData} onSubmit={(e, data, fieldMap) => {
        console.log(fieldMap)
        console.log(data, formData, formData === data, JSON.stringify(data));
        let doubled = (data.a * 2);
        console.log('doubled ', doubled);
        submittedData.value = {
          x: ';akldfs;ajdffal;akdlsf;akldsfj ' + doubled.toString(),
          ...JSON.parse(JSON.stringify(data))

        };
        //equal when passed the signal but doesn't rerender

        // set it to render?
        // formData.value = {...signal.value};
      }}>
        <Input name="a" class="a" />
        {/* <Input name="b" /> */}
        {/* <Input name="c" /> */}
        <LabeledInput class="lgt5" label="L > 5" name="lengthMustBeOver5" validate={v => v?.length > 5} />
        <LabeledInput label="Doesn't have initial data" name="xxxx" />
        {/* <LabeledTextInput label="AAAAAA" name="a" /> */}
        <LabeledTextInput label="B" name="b" />
        <LabeledTextInput label="C" name="c" />
        <LabeledTextInput label="sub.a" name="sub.a" />

        <Example name="sub.a" />
        {formData.$people?.value.map(ps => <PersonForm signal={ps} />)}

        <label><input value={formData.$a} /></label>
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

const PersonForm = (p: { signal: any }) => {
  return <>
    <LabeledInput label='name' signal={p.signal} name="name" />
    <LabeledInput label='age' signal={p.signal} name="age" />
  </>
}
