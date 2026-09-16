import type { Path, PathOf } from "../src/types";
type Assert<T extends true> = T;
type Includes<Paths, Value> = Value extends Paths ? true : false;
type Excludes<Paths, Value> = Value extends Paths ? false : true;
type Address = {
    street: string;
    location: {
        city: string;
    };
};
type Data = {
    addresses: Address[];
    optionalAddresses?: readonly Address[] | null;
    tags: string[];
    matrix: number[][];
    dates: Date[];
};
export type PathAssertions = [
    Assert<Includes<Path<Data>, "addresses">>,
    Assert<Includes<Path<Data>, `addresses.${number}`>>,
    Assert<Includes<Path<Data>, `addresses.${number}.street`>>,
    Assert<Includes<Path<Data>, "addresses.0.location.city">>,
    Assert<Includes<Path<Data>, "optionalAddresses.12.street">>,
    Assert<Includes<Path<Data>, `tags.${number}`>>,
    Assert<Includes<Path<Data>, "matrix.0.1">>,
    Assert<Includes<Path<Data>, "dates.0">>,
    Assert<Excludes<Path<Data>, "addresses.street">>,
    Assert<Excludes<Path<Data>, "addresses.foo.street">>,
    Assert<Excludes<Path<Data>, "addresses.0.missing">>,
    Assert<Excludes<Path<Data>, "addresses.length">>,
    Assert<Excludes<Path<Data>, "addresses.push">>,
    Assert<Excludes<Path<Data>, "tags.0.length">>,
    Assert<Excludes<Path<Data>, "dates.0.getTime">>,
    Assert<Includes<Path<readonly Address[]>, `${number}.street`>>,
    Assert<Excludes<Path<Address[]>, "length">>,
    Assert<Includes<PathOf<Data>, "addresses.1.street">>,
    Assert<Includes<Path<{
        nested: {
            value: string;
        };
    }>, "nested.value">>,
    Assert<Includes<Path, "any.custom.path">>,
    Assert<Includes<Path<unknown>, "any.custom.path">>
];
type Recursive = {
    children: Recursive[];
    value: string;
};
export type RecursivePathAssertions = [
    Assert<Includes<Path<Recursive>, "children.0.children.1.value">>,
    Assert<Excludes<Path<Recursive>, "children.0.children.1.children.0.value">>
];
type Mixed = {
    entries: readonly ({
        street: string;
    } | {
        zip: number;
    } | null)[];
    metadata: any;
    unknownValue: unknown;
};
export type MixedPathAssertions = [
    Assert<Includes<Path<Mixed>, "entries.0.street">>,
    Assert<Includes<Path<Mixed>, "entries.1.zip">>,
    Assert<Excludes<Path<Mixed>, "entries.0.missing">>,
    Assert<Includes<Path<Mixed>, "metadata.arbitrary.nested.path">>,
    Assert<Includes<Path<Mixed>, "unknownValue.arbitrary.path">>,
    Assert<Includes<Path<any>, "arbitrary.path">>,
    Assert<Includes<Path<never>, "arbitrary.path">>
];
export {};
