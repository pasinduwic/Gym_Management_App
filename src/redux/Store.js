import { configureStore } from "@reduxjs/toolkit";
import statusVarReducer from "./features/StatusVar";
import globalDataReducer from "./features/GlobalData";
const Store = configureStore({
  reducer: {
    statusVar: statusVarReducer,
    globalData: globalDataReducer
  }
});

export default Store;
