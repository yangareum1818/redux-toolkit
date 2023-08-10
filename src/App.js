import React from 'react';
import { legacy_createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store/store';
import { up } from './slice/counterSlice';
import { asyncUpFetch } from './slice/counterSlice';

// 기존 Redux 코드
/*
function reducer(state, action) {
  if (action.type === 'up') {
    return { ...state, value: state.value + action.step };
  }
  return state;
}
const initialState = { value: 0 };

const store = legacy_createStore(reducer, initialState);
*/

function Counter() {
  const dispatch = useDispatch();
  const count = useSelector((state) => {
    return state.counter.value;
  });
  const status = useSelector((state) => {
    return state.counter.status;
  });

  return (
    <div>
      {/* 동기 */}
      <button
        onClick={() => {
          // dispatch({ type: 'up', step: 2 });
          dispatch(up(2));
        }}
      >
        +
      </button>

      {/* 비동기 */}
      <button
        onClick={() => {
          dispatch(asyncUpFetch());
        }}
      >
        + async fetch
      </button>

      {/* 결과 값 */}
      <div>
        {count} | {status}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <div>
        <Counter />
      </div>
    </Provider>
  );
}
