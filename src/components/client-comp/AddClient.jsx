import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, IconButton } from "@mui/material";
import { Form, Modal, Spinner, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  addSessionUser,
  setRefresh,
} from "../../redux/features/StatusVar";
import { Formik } from "formik";
import * as yup from "yup";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import moment from "moment";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required!"),
  lastName: yup.string().required("Last name is required!"),
  phoneNumber: yup.string().required("Phone Number is required!"),
  assignedCoach: yup.string().required("Coach is required!"),
  registeredDate: yup.string().required("Registered is required!"),
});

const AddClient = ({ clientNo, coachList }) => {
  const addModal = useSelector((state) => state.statusVar.value.addModal);
  const refreshData = useSelector((state) => state.statusVar.value.refreshData);
  const dispatch = useDispatch();
  // console.log(clientNo);
  const [addData, setAddData] = useState({
    clientNo: clientNo,
    nextPaymentDate: moment().add(2, "d").format("YYYY-MM-DD"),
  });
  const [addRegistrationData, setAddRegistrationData] = useState({});
  const [loader, setLoader] = useState(false);
  const [addRegistrationFee, setAddRegistrationFee] = useState(false);
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(addModalTogal(false));
      // console.log("hutta")
    };
  }, []);
  //handel submit
  const handleFormSubmit = async () => {
    // e.preventDefault();
    // console.log("submitted");

    setLoader(true);
    try {
      const responce = await axiosPrivate.post("/api/client", addData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${sessionUser.accessToken}`,
        },
        withCredentials: true,
        // signal: controller.signal
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
            message: "Something went wrong!",
          }),
        );
      }

      dispatch(
        addAlertDetails({
          status: true,
          type: "success",
          message: "Client added successfully!",
        }),
      );
      setAddRegistrationFee(true);
      setAddRegistrationData({
        client: responce.data._id,
        type: 6,
        date: moment().format("YYYY-MM-DD"),
      });
      dispatch(setRefresh(!refreshData));
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!",
        }),
      );
    } finally {
      // dispatch(addModalTogal(false));
      setLoader(false);
    }
  };
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    // console.log("submitted");

    setLoader(true);
    try {
      const responce = await axiosPrivate.post(
        "/api/payment",
        addRegistrationData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${sessionUser.accessToken}`,
          },
          withCredentials: true,
          // signal: controller.signal
        },
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
            message: "Something went wrong!",
          }),
        );
      }

      dispatch(
        addAlertDetails({
          status: true,
          type: "success",
          message: "Payment added successfully!",
        }),
      );
      dispatch(addModalTogal(false));
      dispatch(setRefresh(!refreshData));
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!",
        }),
      );
    } finally {
      setLoader(false);
    }
  };

  //handel change
  const handelOnChange = (e) => {
    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;

    const newData = { ...addData };
    newData[fieldName] = fieldValue;

    setAddData(newData);
    // console.log(newData);
  };
  const handelFeeOnChange = (e) => {
    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;

    const newData = { ...addRegistrationData };
    newData[fieldName] = fieldValue;

    setAddRegistrationData(newData);
    // console.log(newData);
  };

  return (
    <Card
      sx={{
        margin: " 10px 10px 100px 10px",
        textAlign: "left",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <h3>Add Client</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <IconButton
            onClick={() => {
              // dispatch(addModalTogal(false));
              dispatch(addModalTogal(false));
            }}
            // variant="contained"
            sx={{ borderRadius: "50%", border: "1px solid gray" }}
            size="small"
          >
            {" "}
            <Close />
          </IconButton>
        </div>
      </div>
      {!addRegistrationFee ? (
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            firstName: "",
            lastName: "",
            phoneNumber: "",
            registeredDate: "",
            type: "",
            asignedCoach: "",
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
            errors,
          }) => (
            <Form noValidate>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Client No</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Client No"
                    value={clientNo}
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="clientNo"
                    isInvalid={!!errors.clientNo}
                    disabled
                  />
                </Form.Group>
                <Form.Group as={Col}></Form.Group>
              </Row>
              <Row>
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
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group>
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
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.registeredDate}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}></Form.Group>
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
                  >
                    <option>- Select Client Type -</option>
                    <option value="1">Member</option>
                    <option value="2">Personal Traning</option>
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
                  >
                    <option>- Select Coach -</option>
                    {coachList.map((coach) => (
                      <option value={coach._id} key={coach._id}>
                        {coach.firstName + " " + coach.lastName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.assignedCoach}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Modal.Footer>
                <Button
                  variant="text"
                  onClick={() => dispatch(addModalTogal(false))}
                >
                  Close
                </Button>
                <Button variant="text" type="submit" onClick={handleSubmit}>
                  {loader ? <Spinner animation="border" size="sm" /> : "Add"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      ) : (
        <Form>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Registration Fee</Form.Label>
              <Form.Control
                type="number"
                placeholder="Registration Fee"
                // value={clientNo}
                onChange={handelFeeOnChange}
                name="amount"
              />
            </Form.Group>
          </Row>
          <Modal.Footer>
            <Button
              variant="text"
              onClick={() => dispatch(addModalTogal(false))}
            >
              Latter
            </Button>
            <Button
              variant="text"
              type="submit"
              onClick={handleRegistrationSubmit}
            >
              {loader ? <Spinner animation="border" size="sm" /> : "Add"}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Card>
  );
};

export default AddClient;
