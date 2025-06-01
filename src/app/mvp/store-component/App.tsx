'use client';

import { DevelopModeWrapper } from 'react-constore/middlewares';
import { store } from '../store';
import { Counter, SingleCounter } from './Counter';
import { MultipleKeys } from './MultipleKeys';
import { Todo } from './Todo';
import { User } from './User';

// Main App
export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Context Store Example</h1>
      <SingleCounter />
      <Counter />
      <User />
      <MultipleKeys />
      <Todo />
      <Todo />
      <Todo />
      <DevelopModeWrapper store={store} />
    </div>
  );
}
