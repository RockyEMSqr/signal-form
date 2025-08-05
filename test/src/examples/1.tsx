import { LocationProvider, Router } from "preact-iso";

export function RoutingExample() {
    return <>
        <h1>Hi - This a routing with preact iso example</h1>
        <a href="/ex1/ex2">ex 2</a>
        <a href="/ex1/ex3">ex 3</a>
        <LocationProvider scope="/ex1/">
            <Router>
                <EX2 path="ex2" />
                <EX3 path="ex3" />
            </Router>
        </LocationProvider >
    </>
}
function EX2({ }: { path: string }) {
    return <h1>Ex2</h1>
}
function EX3({ }: { path: string }) {
    return <h1>Ex3</h1>
}