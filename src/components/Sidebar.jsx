import { useDispatch, useSelector } from "react-redux";
import { addSidebarOpen } from "../redux/features/StatusVar";
import ManuItem from "./ManuItem";
import logoImg from "../images/logo.png";
import TreeView from "@mui/lab/TreeView";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import SettingsInputCompositeIcon from "@mui/icons-material/SettingsInputComposite";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useState } from "react";

const Sidebar = () => {
  const screenSize = useSelector((state) => state.statusVar.value.screenSize);

  return (
    <div className="sidebar">
      <div
        className="user-info"
        style={{
          padding: "10px 10px 20px 10px",
          display: "flex",
          margin: screenSize > 852 ? "10px 20px 20px 10px" : "",
          // gap: "40px",
          justifyContent: screenSize > 852 ? "space-between" : "center",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,.25)"
          // boxShadow: "0 .5rem 1rem rgba(0,0,0,.25)"
        }}
      >
        <img
          src={logoImg}
          alt=""
          style={{ width: "40px", borderRadius: "50%", height: "40px" }}
        />
        {screenSize > 852 ? (
          <p style={{ fontSize: "0.6rem", margin: "0" }}>
            | C O M P A N Y |{/* {screenSize} */}
            {/* {sessionUser?.displayName} */}
          </p>
        ) : (
          <></>
        )}
      </div>

      <div
        className="manus"
        style={{
          padding:
            screenSize > 852 ? "28px 4px 10px 10px" : "28px 10px 10px 10px",
          height: "88%"
        }}
      >
        <TreeView
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultSelected="1"
          defaultEndIcon={<div style={{ width: 24 }} />}
          sx={{ display: screenSize < 852 ? "block" : "" }}
        >
          {screenSize > 852 ? (
            <>
              <ManuItem
                nodeId="1"
                labelText="Dashboard"
                labelIcon={DashboardIcon}
                toLink="/home/dashboard"
              />

              <ManuItem
                nodeId="2"
                labelText="Coaches"
                labelIcon={FitnessCenterIcon}
                toLink="/home/coach"
              />
              <ManuItem
                nodeId="3"
                labelText="Clients"
                labelIcon={SupervisorAccountIcon}
                toLink="/home/client"
              />
              <ManuItem
                nodeId="4"
                labelText="Payments"
                labelIcon={AttachMoneyIcon}
                toLink="/home/payment"
              />
            </>
          ) : (
            <>
              <ManuItem
                nodeId="1"
                labelText="Dashboard"
                labelIcon={DashboardIcon}
                toLink="/home/dashboard"
              />
              <ManuItem
                nodeId="2"
                labelText="Coaches"
                labelIcon={FitnessCenterIcon}
                toLink="/home/coach"
              />
              <ManuItem
                nodeId="3"
                labelText="Clients"
                labelIcon={SupervisorAccountIcon}
                toLink="/home/client"
              />
              <ManuItem
                nodeId="4"
                labelText="Payments"
                labelIcon={AttachMoneyIcon}
                toLink="/home/payment"
              />
            </>
          )}
        </TreeView>
      </div>
      {/* <div className="collaps-btn">
        <Tooltip title="collapse" placement="right">
          <button
            onClick={() => dispatch(addSidebarOpen(!isSidebarOpen))}
            style={{
              background: "none",
              border: "none",
              color: "#rgba(0, 0, 0, 0.2)"
            }}
          >
            <TbLayoutSidebarLeftCollapse />
          </button>
        </Tooltip>
      </div> */}
    </div>
  );
};

export default Sidebar;
