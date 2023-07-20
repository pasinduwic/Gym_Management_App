import { createSlice } from "@reduxjs/toolkit";

const StatusVar = {
  sidebarOpen: true,
  sessionUser: undefined,
  alertShowDetails: {
    status: false,
    type: "",
    message: ""
  },
  addModal: false,
  updateModal: false,
  deleteModal: false,
  tableLoader: true,
  screenSize: 900,
  refreshData: false,
  persist: JSON.parse(localStorage.getItem("persist") || false)
};

export const StatesVarSlice = createSlice({
  name: "statesVar",
  initialState: { value: StatusVar },
  reducers: {
    addSidebarOpen: (state, action) => {
      // console.log("action.payload");
      // console.log(action.payload);

      state.value.sidebarOpen = action.payload;
      // console.log(state.value.cartOpen);
    },

    addSessionUser: (state, action) => {
      // console.log(action);
      if (action.payload.type === "add") {
        // console.log(action.payload);

        state.value.sessionUser = action.payload.payload;
        // console.log(state.value.sessionUser);
      } else {
        state.value.sessionUser = undefined;
      }
    },

    addAlertDetails: (state, action) => {
      // console.log(action.payload);

      state.value.alertShowDetails = action.payload;
    },
    addModalTogal: (state, action) => {
      state.value.addModal = action.payload;
      // console.log("state.value.addModal");
      // console.log(state.value.addModal);
    },
    updateModalTogal: (state, action) => {
      state.value.updateModal = action.payload;
    },
    deleteModalTogal: (state, action) => {
      state.value.deleteModal = action.payload;
    },
    setTableLoader: (state, action) => {
      state.value.tableLoader = action.payload;
    },
    setScreenSize: (state, action) => {
      state.value.screenSize = action.payload;
    },
    setRefresh: (state, action) => {
      state.value.refreshData = action.payload;
    },
    addTogalPersist: (state, action) => {
      // console.log("action.payload");
      // console.log(action.payload);

      state.value.persist = !state.value.persist;
      console.log(state.value.persist);
    }
  }
});

export const {
  addSidebarOpen,
  addSessionUser,
  addAlertDetails,
  addModalTogal,
  updateModalTogal,
  deleteModalTogal,
  setTableLoader,
  setScreenSize,
  setRefresh,
  addTogalPersist
} = StatesVarSlice.actions;
export default StatesVarSlice.reducer;
