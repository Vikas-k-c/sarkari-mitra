import { NormalizedScheme } from '../types';

export interface ISourceAdapter {
  sourceName: string;
  fetchSchemes(): Promise<NormalizedScheme[]>;
}
