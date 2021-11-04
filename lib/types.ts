import type { OmittedResponse } from '.';

export type TinyResolveFunction = 
(response: OmittedResponse) => void;

export type TinyRejectFunction =
(reason?: unknown) => void;
