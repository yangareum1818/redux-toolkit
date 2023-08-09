import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
    name: 'counter',
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