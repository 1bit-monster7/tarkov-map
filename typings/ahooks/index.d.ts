import { Options, SetState } from "ahooks/lib/createUseStorageState";

declare module 'ahooks' {
  // @ts-ignore
  const useLocalStorageState: <T>(key: string, options?: Options<T>) => readonly [T, (value?: SetState<T>) => void];
}
