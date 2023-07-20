import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import { Add } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import AddClient from "../components/client-comp/AddClient";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  addSessionUser,
  setTableLoader
} from "../redux/features/StatusVar";
import { useLocation, useNavigate } from "react-router-dom";
import UpdateClient from "../components/client-comp/UpdateClient";
import Notifications from "../components/Notification";

const Client = () => {
  const [tableData, setTableData] = useState([]);
  const [coachList, setCoachList] = useState([]);
  const dispatch = useDispatch();
  const refreshData = useSelector((state) => state.statusVar.value.refreshData);
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);
  const updateModal = useSelector((state) => state.statusVar.value.updateModal);
  const addModal = useSelector((state) => state.statusVar.value.addModal);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  //fetching table data
  useEffect(() => {
    dispatch(setTableLoader(true));
    const controller = new AbortController();
    const getData = async () => {
      try {
        const responce = await axiosPrivate.get("/api/client", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${sessionUser.accessToken}`
          },
          withCredentials: true,
          signal: controller.signal
        });
        // console.log(responce.data);
        if (responce.data.error === "Invalid!") {
          dispatch(addSessionUser({ type: "remove", payload: sessionUser }));
          return navigate("/", { state: { from: location }, replace: true });
        }
        if (responce.data.error) {
          return dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "Something went wrong!"
            })
          );
        }
        setTableData(responce.data);
      } catch (e) {
        dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "failed to load data!"
          })
        );
      } finally {
        dispatch(setTableLoader(false));
      }
    };
    getData();
    console.log("CLient");
    return () => controller.abort();
  }, [refreshData]);

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        const responce = await axiosPrivate.get("/api/coach", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${sessionUser.accessToken}`
          },
          withCredentials: true,
          signal: controller.signal
        });
        // console.log("coaches");
        // console.log(responce.data);
        if (responce.data.error === "Invalid!") {
          dispatch(addSessionUser({ type: "remove", payload: sessionUser }));
          return navigate("/", { state: { from: location }, replace: true });
        }
        if (responce.data.error) {
          return dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "Something went wrong!"
            })
          );
        }
        setCoachList(responce.data);
      } catch (e) {
        dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "failed to load data!"
          })
        );
      }
    };
    getData();
    return () => controller.abort();
  }, []);

  //defining columns
  const columns = [
    {
      header: "No",
      accessorKey: "clientNo"
    },
    {
      header: "Name",
      accessorFn: (row) => `${row?.firstName} ${row?.lastName}`,
      id: "name"
    },
    {
      header: "Phone",
      accessorKey: "phoneNumber"
    },
    {
      header: "Client Type",
      accessorKey: "type",
      Cell: ({ cell }) =>
        cell.getValue() === 1 ? "Member" : "Personal Traning"
    },
    {
      header: "Assigned Coach",
      accessorFn: (row) =>
        `${row?.assignedCoach?.firstName} ${row?.assignedCoach?.lastName}`,
      id: "assignedCoach"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Clients</h3>
        <div style={{ display: "flex" }}>
          {!updateModal && (
            <div className="add">
              <Tooltip title="Add Client">
                <IconButton
                  onClick={() =>
                    coachList.length !== 0
                      ? dispatch(addModalTogal(true))
                      : dispatch(
                          addAlertDetails({
                            status: true,
                            type: "error",
                            message:
                              "Please Add atleast one Coach before add a Client!"
                          })
                        )
                  }
                  // variant="contained"
                  sx={{ border: "1px solid gray" }}
                  size="medium"
                >
                  {" "}
                  <Add />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <div className="page-content">
        {addModal ? (
          <AddClient
            clientNo={tableData[tableData.length - 1].clientNo + 1}
            coachList={coachList}
          />
        ) : updateModal ? (
          <UpdateClient coachList={coachList} />
        ) : (
          <Table
            tableData={tableData}
            columns={columns}
            endPoint="/api/client"
            fileName="Client-data"
            isView={true}
          />
        )}
      </div>

      <Notifications />
    </div>
  );
};

export default Client;
