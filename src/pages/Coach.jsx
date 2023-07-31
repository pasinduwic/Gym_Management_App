import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import { Add } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import UpdateCoach from "../components/coach-comp/updateCoach";
import AddCoach from "../components/coach-comp/addCoach";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  addSessionUser,
  setTableLoader,
} from "../redux/features/StatusVar";
import { useLocation, useNavigate } from "react-router-dom";

const Coach = () => {
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const refreshData = useSelector((state) => state.statusVar.value.refreshData);
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  //fetching table data
  useEffect(() => {
    dispatch(setTableLoader(true));
    const controller = new AbortController();
    const getData = async () => {
      try {
        const responce = await axiosPrivate.get("/api/coach", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${sessionUser.accessToken}`,
          },
          withCredentials: true,
          signal: controller.signal,
        });
        // console.log(responce);
        if (responce.data.error === "Invalid!") {
          dispatch(addSessionUser({ type: "remove", payload: sessionUser }));
          return navigate("/", { state: { from: location }, replace: true });
        }
        // console.log(responce.data);
        if (
          responce.data.error &&
          responce.data.error !== "No coaches available!"
        ) {
          return dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "Something went wrong!",
            })
          );
        }
        setTableData(responce.data);
      } catch (e) {
        dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "failed to load data!",
          })
        );
      } finally {
        dispatch(setTableLoader(false));
      }
    };
    getData();
    return () => controller.abort();
  }, [refreshData]);

  //defining columns
  const columns = [
    {
      header: "No",
      accessorKey: "coachNo",
    },
    {
      header: "Name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      id: "name",
    },
    {
      header: "Phone",
      accessorKey: "phoneNumber",
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Coaches</h3>
        <div style={{ display: "flex" }}>
          <div className="add">
            <Tooltip title="Add Coach">
              <IconButton
                onClick={() => dispatch(addModalTogal(true))}
                // variant="contained"
                sx={{ border: "1px solid gray" }}
                size="medium"
              >
                {" "}
                <Add />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="page-content">
        <Table
          tableData={tableData}
          columns={columns}
          endPoint="/api/coach"
          fileName="Coach-data"
        />
      </div>

      <UpdateCoach />
      <AddCoach coachNoNew={tableData[tableData.length - 1]?.coachNo + 1} />
    </div>
  );
};

export default Coach;
