import { InputProps } from '../types';
import type { JSX } from 'preact/jsx-runtime';
export declare function RichTextAreaInput<ContainingType>(p: InputProps<string, ContainingType> & {
    toolbarAdditions?: JSX.Element[];
    silent?: boolean;
}): JSX.Element;
export declare const WYSIWYGInput: typeof RichTextAreaInput;
