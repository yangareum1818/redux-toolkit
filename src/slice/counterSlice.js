import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const asyncUpFetch = createAsyncThunk('counterSlice/asyncUpFetch', async () => {
  const resp = await fetch(
    'https://api.countapi.xyz/hit/opesaljkdfslkjfsadf.com/visitss'
  );
  const data = await resp.json();
  return data.value;
});

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0, status: 'Welcome' },
  // 동기
  reducers: {
    up: (state, action) => {
      state.value = state.value + action.payload;
    },
  },
  // 비동기
  extraReducers: (build) => {
    build.addCase(asyncUpFetch.pending, (state, action) => {
      state.status = 'Loading';
    });
    build.addCase(asyncUpFetch.fulfilled, (state, action) => {
      state.value = action.payload;
      state.status = 'Complete';
    });
    build.addCase(asyncUpFetch.rejected, (state, action) => {
      state.status = 'fail';
    });
  },
});

export default counterSlice;
// 간결하게 사용하기 위해서 구조분해할당으로 내보낸다.
export const { up, set } = counterSlice.actions;
export { asyncUp, asyncUpFetch };
