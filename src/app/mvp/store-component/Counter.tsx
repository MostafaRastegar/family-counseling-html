import { Button } from 'antd';
import { store } from '../store';

// Counter component
export function SingleCounter() {
  const count = store.getState('count');
  return (
    <div>
      <h2>SingleCounter getState: {count}</h2>
    </div>
  );
}

export function Counter() {
  const count = store.getState('count');
  const logCurrentCount = () => {
    console.log('Current count:', store.getState('count')); // ✅ درست
  };
  return (
    <div>
      <h2>Count useStoreKey: {count}</h2>
      <Button
        onClick={() => store.setState((prev) => ({ count: prev.count + 1 }))}
      >
        +
      </Button>
      <Button
        onClick={() => store.setState((prev) => ({ count: prev.count - 1 }))}
      >
        -
      </Button>
      <Button onClick={() => store.setState({ count: 0 })}>Reset</Button>
      <Button onClick={() => logCurrentCount()}>show</Button>
    </div>
  );
}
