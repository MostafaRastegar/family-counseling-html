import { store } from '../store';

// User component
export function Todo() {
  const todos = store.getState('todos');

  return <div>{todos.map((item) => item.name)}</div>;
}
