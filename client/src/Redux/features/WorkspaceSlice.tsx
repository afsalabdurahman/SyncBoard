import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface Details{
    workspace:string
}
let initialState:Details={
    workspace:""
}
const workspeceSlice = createSlice({
name:"workspaceSlice",
initialState,
reducers:{
   setWorkspace:(state,action: PayloadAction<string>) =>{
state.workspace=action.payload
   }
}

})
export const {
setWorkspace
} = workspeceSlice.actions;
export default workspeceSlice.reducer;