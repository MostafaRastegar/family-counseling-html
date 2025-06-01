import { Button } from 'antd';
import { store } from '../store';

export function MultipleKeys() {
  const [{ count, user }, updateValues] = store.useStoreKeys(['count', 'user']);

  return (
    <div>
      <h2>Multiple Values</h2>
      <p>
        Count: {count}, User: {user.name}
      </p>
      <Button onClick={() => updateValues({ count: count + 10 })}>
        Add 10 to Count
      </Button>
      <Button
        onClick={() => updateValues({ user: { ...user, name: 'Updated' } })}
      >
        Update User Name
      </Button>
    </div>
  );
}
