import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { addSidebarOpen } from "../redux/features/StatusVar";

const Home = () => {
  const isSidebarOpen = useSelector(
    (state) => state.statusVar.value.sidebarOpen
  );
  const screenSize = useSelector((state) => state.statusVar.value.screenSize);
  const dispatch = useDispatch();
  useEffect(() => {
    // console.log(screenSize)
    if (screenSize < 1200) {
      dispatch(addSidebarOpen(false));
    }
    if (screenSize > 1200) {
      dispatch(addSidebarOpen(true));
    }
  }, [screenSize]);
  return (
    <div
      className="home"
      style={{ display: "flex", height: "100vh", overflow: "hidden" }}
    >
      {isSidebarOpen && (
        <div
          className="sidebar-container"
          style={{
            // flexGrow: "1",
            width: screenSize > 852 ? "18%" : "",
            zIndex: "9999",
            boxShadow: "0 3rem 1rem rgba(0,0,0,.05)"
          }}
        >
          <Sidebar />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          // flexGrow: "5",
          height: "100vh",
          width: "100%",
          overflow: "auto"
        }}
      >
        <Navbar />

        <Outlet />
      </div>
    </div>
  );
};

export default Home;
