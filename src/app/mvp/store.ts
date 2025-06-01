'use client';

// import React from 'react';
import createStore from 'react-constore';
import {
  applyMiddleware,
  withDevtools,
  withLogger,
} from 'react-constore/middlewares';

const MyStore = createStore({
  count: 0,
  user: { name: 'Guest', age: 25 },
  todos: [
    { id: 1, name: 'Todo 1' },
    { id: 2, name: 'Todo 2' },
  ],
});

export const store = applyMiddleware(
  MyStore,
  (store) => withDevtools(store, 'MyStore'),
  (store) => withLogger(store, 'MyStore'),
);
// store.useStore();
