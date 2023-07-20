import axios from "axios";
import { useEffect, useState } from "react";
import { Button, IconButton, Card, Tooltip, Typography } from "@mui/material";
import { Form, Modal, Spinner, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addUpdateData } from "../../redux/features/GlobalData";
import {
  addAlertDetails,
  addSessionUser,
  setRefresh,
  updateModalTogal,
  setTableLoader
} from "../../redux/features/StatusVar";
import { Formik } from "formik";
import * as yup from "yup";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Close, Edit } from "@mui/icons-material";
import Table from "../Table";
import UpdatePayment from "../payment-comp/UpdatePayment";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required!"),
  lastName: yup.string().required("Last name is required!"),
  phoneNumber: yup.string().required("Phone Number is required!")
});

const UpdateClient = ({ data, coachList }) => {
  const updateModal = useSelector((state) => state.statusVar.value.updateModal);
  const updateDataInitial = useSelector(
    (state) => state.globalData.value.updateData
  );
  const [tableData, setTableData] = useState([]);
  const refreshData = useSelector((state) => state.statusVar.value.refreshData);
  const dispatch = useDispatch();
  const _id = updateDataInitial._id;
  const [loader, setLoader] = useState(false);
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);
  const [mode, setMode] = useState(0);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    // console.log(updateDataInitial);
    dispatch(setTableLoader(true));
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

        const filterdData = responce.data.filter(
          (payment) => payment.client?._id === updateDataInitial._id
        );
        // console.log(filterdData);
        setTableData(filterdData);
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
    return () => {
      dispatch(updateModalTogal(false));
      controller.abort();
    };
  }, []);

  // handel submit
  const handleFormSubmit = async () => {
    // e.preventDefault();
    setLoader(true);
    const passingData = updateDataInitial;
    // delete updateDataInitial._id;
    // delete updateDataInitial.__v;

    try {
      const responce = await axiosPrivate.put(
        "/api/client" + _id,
        passingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${sessionUser.accessToken}`
          },
          withCredentials: true
          // signal: controller.signal
        }
      );
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

      dispatch(
        addAlertDetails({
          status: true,
          type: "success",
          message: "Item updated successfully!"
        })
      );
      setMode(0);
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
      // dispatch(updateModalTogal(false));
      setLoader(false);
    }
  };

  //handel change
  const handelOnChange = (e) => {
    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;

    const newData = { ...updateDataInitial };
    newData[fieldName] = fieldValue;
    dispatch(addUpdateData(newData));
    console.log(newData);
  };

  const datForPicker = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  //defining columns
  const columns = [
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
    <div>
      <Card
        sx={{
          margin: " 10px 10px 100px 10px",
          textAlign: "left",
          padding: "20px"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px"
          }}
        >
          <h3>Client Details</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {mode === 0 ? (
              <IconButton
                onClick={() => {
                  // dispatch(addModalTogal(false));
                  dispatch(updateModalTogal(false));
                }}
                // variant="contained"
                sx={{ borderRadius: "50%", border: "1px solid gray" }}
                size="small"
              >
                {" "}
                <Close />
              </IconButton>
            ) : (
              <></>
            )}
            <Tooltip title="Add Item">
              <IconButton
                onClick={() => {
                  mode === 0 ? setMode(1) : setMode(0);
                }}
                sx={{ border: "1px solid gray" }}
                size="small"
              >
                {" "}
                {loader ? (
                  <Spinner animation="border" size="sm" />
                ) : mode === 0 ? (
                  <Edit />
                ) : (
                  <Close />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <Formik
          validationSchema={validationSchema}
          initialValues={{
            firstName: updateDataInitial.firstName,
            lastName: updateDataInitial.lastName,
            phoneNumber: updateDataInitial.phoneNumber,
            registeredDate: updateDataInitial.registeredDate,
            type: updateDataInitial.type
          }}
          onSubmit={(values) => {
            handleFormSubmit();
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors
          }) => (
            <Form>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Client No</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Client No"
                    value={updateDataInitial.clientNo}
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="clientNo"
                    isInvalid={!!errors.clientNo}
                    disabled
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="firstName"
                    isInvalid={!!errors.firstName}
                    value={updateDataInitial.firstName}
                    disabled={mode === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="lastName"
                    isInvalid={!!errors.lastName}
                    value={updateDataInitial.lastName}
                    disabled={mode === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="email"
                    isInvalid={!!errors.email}
                    value={updateDataInitial.email}
                    disabled={mode === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone Number"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="phoneNumber"
                    isInvalid={!!errors.phoneNumber}
                    value={updateDataInitial.phoneNumber}
                    disabled={mode === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="address"
                    isInvalid={!!errors.address}
                    value={updateDataInitial.address}
                    disabled={mode === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Registered Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Registered Date"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="registeredDate"
                    isInvalid={!!errors.registeredDate}
                    value={datForPicker(updateDataInitial?.registeredDate)}
                    disabled={mode === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.registeredDate}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                  {/* <Form.Label>Registration Fee</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Registration Fee"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="registrationFee"
                    isInvalid={!!errors.registrationFee}
                    value={updateDataInitial?.registrationFee}
                    disabled={mode === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.registrationFee}
                  </Form.Control.Feedback> */}
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    placeholder="Type"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="type"
                    isInvalid={!!errors.type}
                    disabled={mode === 0}
                  >
                    <option
                      value="1"
                      selected={updateDataInitial?.type === 1 && true}
                    >
                      Member
                    </option>
                    <option
                      value="2"
                      selected={updateDataInitial?.type === 2 && true}
                    >
                      Personal Traning
                    </option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Assigned Coach</Form.Label>
                  <Form.Select
                    placeholder="Assigned Coach"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="assignedCoach"
                    isInvalid={!!errors.assignedCoach}
                    disabled={mode === 0}
                  >
                    <option>- Select Coach -</option>
                    {coachList?.map((coach) => (
                      <option
                        value={coach._id}
                        key={coach._id}
                        selected={
                          updateDataInitial?.assignedCoach._id === coach._id
                            ? true
                            : false
                        }
                      >
                        {coach.firstName + " " + coach.lastName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.assignedCoach}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Next Payment Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Next payment Date"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="nextPaymentDate"
                    isInvalid={!!errors.nextPaymentDate}
                    value={datForPicker(updateDataInitial?.nextPaymentDate)}
                    disabled={mode === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nextPaymentDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              {mode !== 0 && (
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => dispatch(updateModalTogal(false))}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {loader ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Update"
                    )}
                  </Button>
                </Modal.Footer>
              )}
            </Form>
          )}
        </Formik>
      </Card>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "left", marginLeft: "10px" }}
      >
        Payment History
      </Typography>
      <Card
        sx={{
          margin: " 10px 10px 100px 10px",
          textAlign: "left"
          // padding: "20px"
          // height: "100px"
        }}
      >
        <Table
          tableData={tableData}
          columns={columns}
          endPoint="/api/payment"
          fileName="Payment-data"
          isView={true}
          viewOnly={true}
        />
      </Card>
      {/* <UpdatePayment clientList={undefined} /> */}
    </div>
  );
};

export default UpdateClient;
