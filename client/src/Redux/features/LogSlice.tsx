import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface Logs {
 LogArry: any[];

}
const initialState: Logs = {
 LogArry:[]

};
const LogSlice = createSlice({
  name: 'registerSlice',
  initialState,
  reducers: {
    setLog: (state, action: PayloadAction<string>) => {
      state.LogArry.push ( action.payload)
    },}})

    
    export const {
    setLog
    } = LogSlice.actions;
    export default LogSlice.reducer;