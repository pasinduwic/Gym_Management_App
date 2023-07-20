import { createSlice } from "@reduxjs/toolkit";

const initialData = {
  updateData: ""
};

export const GlobalDataSlice = createSlice({
  name: "GlobalData",
  initialState: { value: initialData },
  reducers: {
    addUpdateData: (state, action) => {
      state.value.updateData = action.payload;
    }
  }
});

export const { addUpdateData } = GlobalDataSlice.actions;
export default GlobalDataSlice.reducer;
