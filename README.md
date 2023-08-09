# `Redux-toolkit` 그렇게 편해? 도대체 뭐길래 ?

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/react-2emesc)

## Redux

: `createStore`, `subscribe`, `getState`, `dispatch`

> 상태관리 : 프로그램이 동작하는데 필요한 데이터를 체계적으로 관리

- Redux자체는 React와 **무관** 하다.
- `Javascript`로 된 프로젝트라면 **어디서든** 쓸 수 있다.
- Redux를 React에서 사용하려면 어려운 점이 많다.
- 그 어려운 점을 해결해 주는 것이 **`React-Redux`**

## React Redux

: `connect`, `useDispatch`, `useSelector`

> 이 도구를 사용하면 React와 Redux를 통합할 수 있다.

그럼에도 불구하고 Redux를 이용하는데 많은 문제점들이 있다.

- 설정할 것이 많다.
- 미들웨어를 사용하려면 설치, 설정해야한다.
- 반복적인 코드들이 많다.
- 불변성 유지하기에 어렵다.

이 문제점을 해결하는데에 사용하는 도구가 **`Redux toolkit`** 이다.

### 먼저, 예제를 통해 `redux`, `react-redux`에서 `redux-toolkit`을 사용하면 어떻게 간편해 지는지 알아보자.

> “ + ” 버튼을 클릭하면 숫자가 증가하는 counter App을 만든다는 가정.

- `Redux`, `React-Redux`를 사용했을 경우.

```javascript
/* App.js */

import React from “react”;
import { createStore } from “redux”;
import { Provider, useSelector, useDispatch } from “react-redux”;

function reducer(state, action) {
  if(action.type === ‘up’) {
    return { …state, value: state.value + action.step }
  }
  return state;
}

const initialState = { value: 0 }
const store = createStore(reducer, initialState);

function Counter () {
  const dispatch = useDispatch();
  const count = useSelector( state => state.value );
  return (
    <div>
      <button onClick={()=> {
        dispatch({ type: ‘up’, step: 2 })
      }}> + </button> 0
    </div>
  )
}

export default function App(){
  return (
    <Provider store={store}>
      <div>
        <Counter />
      </div>
    </Provider>
  )
}
```

# Redux toolkit

`configureStore`, `createSlice`, `createAsyncThunk`

### 설치

- 새로 프로젝트를 시작할 때, `Redux toolkit`이 셋팅된 개발환경이 만들어진다.

```
npx create-react-app 프로젝트명 —template redux

// typescript를 사용할 경우
npx create-react-app 프로젝트명 —template redux-typescript
```

- 이미 만들고 있는 프로젝트에 `Redux toolkit`을 추가하는 경우

```
npm install @reduxjs/toolkit
yarn add @reduxjs/toolkit
```

## 다른 점 : store
<img width="784" alt="Pasted Graphic" src="https://github.com/yangareum1818/redux-toolkit/assets/81684775/b7e2170c-0d0f-450d-9199-f9783a914e17">

`Redux`를 사용한 경우 : 하나의 store안에 모든 store를 넣어 거대한 store를 만들었다.

`Redux-toolkit`을 사용한 경우 :

- 프로젝트가 커지면 기능별로 작은 store를 만든다.
- 그것을 `slice`라고 한다.
- 그 작은 `store`들을 합쳐서 `Redux`가 요구하는 큰 `store`로 `Redux-toolkit`이 만들어준다.

### 위의 코드와 비교해보고 흐름을 파악하고 이해하자.

> “ + ” 버튼을 클릭하면 숫자가 증가하는 counter App을 만든다는 가정.

- `Redux-toolkit`을 사용했을 경우.

```javascript
/* App.js */

import React from “react”;
import { createStore } from “redux”;
import { Provider, useSelector, useDispatch } from “react-redux”;
Import { createSlice, configureStore } from “@reduxjs/toolkit”;

const counterSlice = createSlice({
    name: ‘counter’,
    initialState: { value: 0 },
    reducers: {
	up: (state, action)=> {
	    // state.value = state.value + action.step;
	    state.value = state.value + action.payload;
	}
    }
});

const store = configureStore({
    reducer: {
	counter: counterSlice.reducer	// counter에 대한 reducer
    }
});

function Counter () {
    const dispatch = useDispatch();
    const count = useSelector( state => state.counter.value );
    return (
	<div>
	    <button onClick={()=> {
		// dispatch({ type: ‘counter/up’, step: 2 })
		dispatch(counterSlice.actions.up(2))
	    }}> + </button> 0
	</div>
    )
}

export default function App(){
    return (
	<Provider store={store}>
            <div>
	        <Counter />
	    </div>
	</Provider>
    )
}
```

- `slice` : `createSlice({})`

  - `slice`를 `import`한다.
  - `slice`를 만든다. ( `createSlice({})` )
  - 이 `slice`는 `counterSlice`라고 변수명을 지어줬다.
    ( `const counterSlice = createSlice({})` )
  - **`slice`는 필요한 객체**들이 있다.
    - `slice`의 이름 : `“counter”`,
    - `slice`의 초기값 : `initialState`,
    - `slice`의 `reducers` ( **s : 복수형** ⭐️ )
      - `type`별로 함수를 정해준다.
      - Redux reducer는 action.type에 따라 switch 또는 if문으로 해줬지만, `Redux-toolkit`의 `reducer`는 `type`만 적어준다.
        `up: (state, action) => { // .. 함수 실행 } `
      - `Redux reducer`의 내부함수에선 불변성을 지키기 위해 복제를 해서 …기존값을 가져왔지만, `Redux-toolkit`의 **내부함수는 바꿔주고 싶은 값을 간결** 하게 바꿔줄 수 있다.
  - 그럼 ’up’ Type일 때 처리해야되는 reducer를 만들었다.
  - 이렇게 만든 **`slice`는 하나의 작은 store** 가 된다.
  - **이런 slice들을 여러개 만들어 파일을 만들어 관리하면된다.**

- `store` : `configureStore({})`

  - 작은 slice들을 모아 store를 만들 때 `configureStore`를 사용한다.
  - **필수 적으로 들어가는 것은 reducer이다. ( 복수형 ❌ )**
  - **각 각의 `slice`들의 `reducer`가 들어간다.**
    ex) counterSlice의 reducers의 type(up, down, set 등..)들을 하나로 합쳐 하나의 reducer를 자동으로 만들어주는 것이다.
  - 그렇게 만들어진것이 **하나의 거대한 store** 이다. ( `const store = configureStore({});` )

- `<Provider></Provider>` : `store`를 전달 해주기 위한 태그

- `useSelector(() => {})` : 전달받은 `store`에서 정보들을 사용하기 위한 `hook`
  - state를 `console.log()`로 출력했을 시,
  
  ￼<img width="147" alt="Pasted Graphic 1" src="https://github.com/yangareum1818/redux-toolkit/assets/81684775/fda46280-ab4c-48a0-9377-7d4f7f3f1b96">

  - 이 `counter`는 `store`의 `reducer`의 이름이다.
  - `state => state.value` 👉🏻 `state => state.counter.value`
  - 화면에 초기값인 “0”이 표시되는 것을 확인할 수 있다.

- `dispatch()`
  - 이벤트(클릭)을 발생했을 때, 숫자가 증가한다.
  - `type`은 `slice`에 해당하는 `name`을 적고, `“/“`한 후? 원하는 `reducers`를 적어준다.{ type: slice의 name/원하는 reducers, step: 2 ( 2씩 증가 ) } \* But, 이 방법 보다 좀 더 **간단하고 “step”이라는 명칭을 사용하지 않는 방법** 이 있다.

      * __`reducers`함수들을 참고해서 자동으로 `action`을 만들어내는 `actionCreate`를 만들어준다.__ `dispatch(counterSlice.actions.up(2))`  ( `actions` 복수형⭐️ )
      * 그럼 `Slice`에 `“up”`의 `action`이 어떻게 찍힐까 ?
  
  ￼	<img width="230" alt="Pasted Graphic 2" src="https://github.com/yangareum1818/redux-toolkit/assets/81684775/55fc917d-0ad8-47b1-b290-53e41e9089ec">
  
  - `actions`를 하고 `.up(2)`을 하게 되면 **`payload`라는 이름의 약속된 값이 생긴다.**
  - Slice의 up함수를 그럼 수정해줘야된다.
  `state.value = state.value + action.payload;`

## 파일 분리

- 한 파일안에 모두 다 때려박지 않고, 분리를 한다.

### App.js

```javascript
import react from “react”;
import { Provider, useSelector, useDispatch } from ‘react-redux’;
import store from ‘./store’;
import { up } from ‘./slice/counterSlice’;

function Counte() {
    const dispatch = useDispatch();
    const count = useSelector(state => {
	return state.counter.value
    });

    return (
	<div>
	    <button onClick={() => {
	        dispatch(up(2))
	    }}>+</button> { count }
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
};
```

### store/store

```javascript
/* store.js */

import { configureStore } from ‘@reduxjs/toolkit’;
import counterSlice from ‘./counterSlice’;

const store = configureStore({
    reducer: {
	counter: couterSlice.reducer
    }
});

export default store;
```

### slice/counterSlice

```javascript
/* slice/counterSlice.js */

import { createSlice } from ‘@reduxjs/toolkit’;

const counterSlice = createSlice({
    name: ‘counter’,
    initialState: { value: 0 },
    reducers : {
	up: (state, action) => {
	    state.value = state.value + action.payload;

	}
    }
});

export default counterSlice;
// 간결하게 사용하기 위해서 구조분해할당으로 내보낸다.
export const { up } = counterSlice.actions;
```
