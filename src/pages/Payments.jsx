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
import AddPayment from "../components/payment-comp/AddPayment";
import UpdatePayment from "../components/payment-comp/UpdatePayment";

const Payment = () => {
  const [tableData, setTableData] = useState([]);
  const [clientList, setClientList] = useState([]);
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
        const responce = await axiosPrivate.get("/api/payment", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${sessionUser.accessToken}`
          },
          withCredentials: true,
          signal: controller.signal
        });
        console.log(responce.data);
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
    return () => controller.abort();
  }, [refreshData]);

  useEffect(() => {
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
        setClientList(responce.data);
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
      header: "Client",
      accessorFn: (row) =>
        row.client
          ? `${row.client?.firstName} ${row.client?.lastName}`
          : "Deleted Client",
      id: "client"
    },
    {
      header: "Payment Type",
      accessorKey: "type",
      Cell: ({ cell }) =>
        cell.getValue() === 1
          ? "Monthly"
          : cell.getValue() === 2
          ? "3 Months"
          : cell.getValue() === 3
          ? "6 months"
          : cell.getValue() === 4
          ? "Anual"
          : cell.getValue() === 4
          ? "Personal Training"
          : "Other"
    },
    {
      header: "Amount",
      accessorKey: "amount"
    },
    {
      header: "Date",
      accessorKey: "date",
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString()
    },
    {
      header: "Next Payment Date",
      accessorKey: "nextPaymentDate",
      Cell: ({ cell }) =>
        cell.getValue()
          ? new Date(cell.getValue()).toLocaleDateString()
          : "One time payment"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Payments</h3>
        <div style={{ display: "flex" }}>
          <div className="add">
            <Tooltip title="Add Payment">
              <IconButton
                onClick={() =>
                  clientList.length !== 0
                    ? dispatch(addModalTogal(true))
                    : dispatch(
                        addAlertDetails({
                          status: true,
                          type: "error",
                          message:
                            "Please Add atleast one Client before add a Payment!"
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
        </div>
      </div>
      <div className="page-content">
        <Table
          tableData={tableData}
          columns={columns}
          endPoint="/api/payment"
          fileName="Payment-data"
        />
      </div>

      <UpdatePayment clientList={clientList} />
      <AddPayment clientList={clientList} />
    </div>
  );
};

export default Payment;
