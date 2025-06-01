import { Button } from 'antd';
import { store } from '../store';

// User component
export function User() {
  const [user, setUser] = store.useStoreKey('user');

  return (
    <div>
      <h2>
        User: {user.name} ({user.age})
      </h2>
      <Button onClick={() => setUser({ ...user, name: 'Ali' })}>
        Change Name
      </Button>
      <Button onClick={() => setUser({ ...user, age: user.age + 1 })}>
        Increase Age
      </Button>
    </div>
  );
}
