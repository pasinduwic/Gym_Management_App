import { useNavigate } from "react-router-dom";
import { Navbar as NavbarBs, Popover } from "react-bootstrap";
import { AiOutlineMenu } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import {
  addSidebarOpen,
  addSessionUser,
  setScreenSize,
  addAlertDetails
} from "../redux/features/StatusVar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import axios from "../API/axios";

const Navbar = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);
  const sidebarOpen = useSelector((state) => state.statusVar.value.sidebarOpen);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout", {
        withCredentials: true
        // signal: controller.signal
      });
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!"
        })
      );
    }
    dispatch(addSessionUser({ type: "remove", payload: undefined }));
    // console.log(sessionUser);
    navigate("/");
  };

  const popover = (
    <Popover>
      <Popover.Header as="h3">Profile</Popover.Header>
      <Popover.Body>
        <div className="popover-profile">
          <img
            src={sessionUser?.imagePath || ""}
            alt=""
            style={{ width: "54px", borderRadius: "50%" }}
          />
          <span> {sessionUser?.displayName}</span>
        </div>
      </Popover.Body>
      <Popover.Header
        as="h2"
        style={{ display: "flex", justifyContent: "center", padding: "0" }}
      >
        <Tooltip title="Logout">
          <button
            className="btn "
            onClick={logout}
            style={{ fontSize: "1.2rem", padding: "0" }}
          >
            <BiLogOut />
          </button>
        </Tooltip>
      </Popover.Header>
    </Popover>
  );

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="navbar-container">
      <NavbarBs
        sticky="top"
        className="bg-light"
        expand="lg"
        style={{
          boxShadow: "0 .5rem 1rem rgba(0,0,0,.05)",
          height: "60px",
          padding: sidebarOpen ? "0" : ""
        }}
      >
        <div className="navbar-left">
          <div>
            <div>
              <button
                onClick={() => dispatch(addSidebarOpen(!sidebarOpen))}
                style={{ background: "none", border: "none" }}
              >
                <AiOutlineMenu />
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {sessionUser && (
            <div className="user-info">
              <div
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <img
                  src={sessionUser?.imagePath || ""}
                  alt=""
                  style={{
                    width: "54px",
                    borderRadius: "50%",
                    marginLeft: "20px"
                  }}
                />
                <span
                  className="user"
                  style={{
                    marginRight: "20px"
                  }}
                >
                  {sessionUser?.displayName}
                </span>
                <Tooltip title="Logout">
                  <IconButton onClick={logout}>
                    <PowerSettingsNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </NavbarBs>
    </div>
  );
};

export default Navbar;
