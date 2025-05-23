import { useRef, useState, useCallback, useEffect } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import { SignalForm } from '../../src/form';
import { Input, TextInput, DateInput, DateTimeInput, SelectInput, TextareaInput, NumberInput } from '../../src/index';
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
  sub: { a: number, b: number, c: number },
  xxxx?: any,
  datetime?: Date | string,
  name: { first: string, last: string }
  testModel: TestModel
}
type DeepKeys<T> = T extends object
  ? {
    [K in keyof T]-?: K extends string
    ? | K
    | `${K}.${DeepKeys<T[K]>}`
    : never;
  }[keyof T]
  : never;
export const Example = (p: { name: DeepKeys<TestModel> }) => {
  return <div>{p.name}</div>
}
export const PrintJSON = ({ what }: any) => {
  return <details open>
    <summary>JSON</summary>
    <pre>{JSON.stringify(what, null, '  ')}</pre>
  </details>
}
export function App() {
  let submittedData = useSignal<any>('Not submitted Yet');

  const [count, setCount] = useState(0)
  const initformData: TestModel = {
    a: 1, b: 'b', c: 'hello',
    sub: { a: 1, b: 2, c: 3 },
    people: [{ name: 'rocky' }, { name: 'YEEEEE' }],
    select3: [1, 2, 3],
    datetime: new Date(),
  };
  const arr = [{x:5}, {x:10}]
  // let formData = useNestedSignal(initformData);
  // let deepSignal = useDeepSignal(initformData);
  let formData = useDeepSignal(initformData);
  let tick = useCallback(() => {
    console.log(new Date(), 'tick')
    formData.a++;
    formData.sub.a++;
    // console.log(formData.sub);
    // deepSignal.a++;
    // console.log(deepSignal.sub)
    formData.people[0].name = 'rocky' + ' ' + Date.now()
    arr[0].x++;
    console.log(arr)
  }, [])

  const noFormData = useDeepSignal<any>({});
  useEffect(() => {
    setInterval(() => {
      tick();
    }, 1000);
  }, [])

  
  return (
    <>
    <div>
      <h1>Possible Bug #3</h1>
      <SignalForm initData={arr}>
      {arr.map((x, i)=><TextInput name={`${i}.x`} value="XXXXX" />)}
      </SignalForm>
    </div>
      <div>
        <SignalForm initData={({ text: ' as;dkflj asd;l kjasd;flk jasd;falksjdf ;asldkjfas;jeisef sefjawoeijfaweij faowiej fo' })} onSubmit={(e, data) => {
          console.log(JSON.stringify(data, null, ' '));
        }}>
          <TextareaInput />
          <TextareaInput name="text" />
          <TextareaInput label="Write in me" name="textThatYouPutInMe" />
          <DateInput label="just date" name="date" />
          <NumberInput label="number" name="aNumber" />
          <button>Submit</button>
        </SignalForm>
      </div>
      <div>
        <h1>Bug #1</h1>
        <SignalForm onSubmit={(e, data) => {
          console.log(data)
        }}>
          <TextInput name="name.first" />
          <TextInput name="name.first" />
          <TextInput name="name.first" />

        </SignalForm>

      </div>
      <button onClick={e => {
        let s = getSignal(formData, 'xxxx');
        formData.xxxx = 'XXXX';
      }}>Put value in formData deepSignal</button>
      <button onClick={e => {
        console.log(submittedData.value);
        debugger;
        console.log(formData)
      }}>Console log state</button>

      <div>
        <h1 id="noform">No Form</h1>
        <DateTimeInput label="no Name" value={formData.datetime} onChange={(e, v) => {
          noFormData.a = v;
        }} />
        <PrintJSON what={noFormData} />
      </div>

      <h1>Form</h1>
      <SignalForm signal={formData} onSubmit={(_e, data, fieldMap) => {
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



        <TextInput<TestModel> label="testModel.testModel.testModel.sub.b" name="testModel.testModel.testModel.sub.b" />

        <label>Sub a<input type="text" onChange={e => formData.sub.a = e.currentTarget.value} value={formData.sub.a} /></label>





        <SelectInput label="Pick a couple #" validate={v => v.length > 2} multiple placeholder='PlaceHolder' name='select3' items={[1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => ({ label: x, value: x }))} />
        <SelectInput label="Pick a #" placeholder='PlaceHolder' name='select2' items={[1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => ({ label: x, value: x }))} />
        inline<SelectInput placeholder='PlaceHolder' name='no' items={[1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => ({ label: x, value: x }))} />




        <Input<TestModel> name="testModel.name.first" class="a" />


        {/* <Input name="b" /> */}
        {/* <Input name="c" /> */}
        <Input class="lgt5" label="L > 5" name="lengthMustBeOver5" validate={v => v?.length > 5} />
        <Input label="Doesn't have initial data" name="asdf" />
        {/* <TextInput label="AAAAAA" name="a" /> */}
        <TextInput<TestModel> label="B" name="sub" />
        <TextInput<TestModel> label="C" name="testModel" />


        <Example name="sub.a" />
        {formData.$people?.value.map(ps => <PersonForm signal={ps} />)}
        <DateTimeInput />
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
    <Input label='name' signal={p.signal} name="name" />
    <Input label='age' signal={p.signal} name="age" />
  </>
}
