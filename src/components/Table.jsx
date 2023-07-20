import { useEffect, useState } from "react";

import { Modal, Spinner } from "react-bootstrap";
import MaterialReactTable from "material-react-table";
import { Delete, Edit, Download, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip, Button } from "@mui/material";
import { Box } from "@mui/material";

import Notifications from "../components/Notification";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addSessionUser,
  deleteModalTogal,
  setRefresh,
  updateModalTogal
} from "../redux/features/StatusVar";
import { addUpdateData } from "../redux/features/GlobalData";
import { CSVLink } from "react-csv";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";

const Table = ({
  tableData,
  columns = [],
  endPoint,
  isView = false,
  fileName,
  viewOnly = false
}) => {
  const deleteModal = useSelector((state) => state.statusVar.value.deleteModal);
  const [deleteId, setDeleteId] = useState("");
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [exportHeaders, setExportHeaders] = useState([]);
  const tableLoader = useSelector((state) => state.statusVar.value.tableLoader);
  const refreshData = useSelector((state) => state.statusVar.value.refreshData);
  const axiosPrivate = useAxiosPrivate();
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const downloadData = columns.map((col) => ({
      label: col.header,
      key: col.accessorKey
    }));

    setExportHeaders(downloadData);
    console.log(exportHeaders);
  }, []);

  //edit
  const handeledit = (row) => {
    dispatch(addUpdateData(row.original));
    dispatch(updateModalTogal(true));
  };

  //delete
  const handelDelete = (row) => {
    dispatch(deleteModalTogal(true));
    setDeleteId(row.original._id);
  };

  const deleteItem = async () => {
    setLoader(true);
    try {
      const responce = await axiosPrivate.delete(endPoint + deleteId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${sessionUser.accessToken}`
        },
        withCredentials: true
        // signal: controller.signal
      });

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
      if (responce.data.errorSpecified) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: responce.data.errorSpecified
          })
        );
      }

      dispatch(
        addAlertDetails({
          status: true,
          type: "success",
          message: "Item deleted successfully!"
        })
      );
      dispatch(setRefresh(!refreshData));
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!"
        })
      );
    } finally {
      dispatch(deleteModalTogal(false));
      setLoader(false);
    }
  };

  return (
    <div className="tb">
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center"
            },
            size: 120
          }
        }}
        columns={columns}
        data={tableData ?? []}
        enableColumnFilterModes
        state={{ showSkeletons: tableLoader }}
        enableEditing={!viewOnly}
        // renderTopToolbarCustomActions={({ table }) => (
        //   <Box>
        //     <CSVLink
        //       data={tableData}
        //       headers={exportHeaders}
        //       filename={fileName + ".csv"}
        //       target="_blank"
        //     >
        //       <Tooltip title="Download">
        //         <IconButton>
        //           <Download />
        //         </IconButton>
        //       </Tooltip>
        //     </CSVLink>
        //   </Box>
        // )}
        renderRowActions={
          !viewOnly &&
          (({ row, table }) => (
            <Box
              sx={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <IconButton onClick={() => handeledit(row)}>
                {isView ? <Visibility /> : <Edit />}
              </IconButton>
              <IconButton onClick={() => handelDelete(row)} color="error">
                <Delete />
              </IconButton>
            </Box>
          ))
        }
      />

      {/* Delete modal */}
      <Modal
        show={deleteModal}
        onHide={() => dispatch(deleteModalTogal(false))}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to delete this?</h4>
          <span>Deleteing will remove data permanently...</span>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => dispatch(deleteModalTogal(false))}>
            Close
          </Button>
          <Button type="submit" onClick={deleteItem}>
            {loader ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Notifications />
    </div>
  );
};

export default Table;
