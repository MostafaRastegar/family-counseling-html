import { useRef } from "react";

export default function usePrevious(value: any) {
  const currentRef = useRef(value);
  // @ts-ignore
  const previousRef = useRef();
  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }
  return previousRef.current;
}
