import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addUpdateData } from "../../redux/features/GlobalData";
import {
  addAlertDetails,
  addSessionUser,
  setRefresh,
  updateModalTogal,
} from "../../redux/features/StatusVar";
import { Formik } from "formik";
import * as yup from "yup";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const validationSchema = yup.object().shape({
  client: yup.string().required("Client is required!"),
  type: yup.number().required("Payment Type is required!"),
  amount: yup.number().required("Amount is required!"),
  date: yup.string().required("Date is required!"),
});

const UpdatePayment = ({ data, clientList }) => {
  const updateModal = useSelector((state) => state.statusVar.value.updateModal);
  const updateDataInitial = useSelector(
    (state) => state.globalData.value.updateData
  );
  const refreshData = useSelector((state) => state.statusVar.value.refreshData);
  const dispatch = useDispatch();
  const _id = updateDataInitial._id;
  const [loader, setLoader] = useState(false);
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(updateDataInitial);
    return () => {
      dispatch(updateModalTogal(false));
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
        "/api/payment" + _id,
        passingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${sessionUser.accessToken}`,
          },
          withCredentials: true,
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
            message: "Something went wrong!",
          })
        );
      }

      dispatch(
        addAlertDetails({
          status: true,
          type: "success",
          message: "Item updated successfully!",
        })
      );
      dispatch(setRefresh(!refreshData));
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!",
        })
      );
    } finally {
      dispatch(updateModalTogal(false));
      setLoader(false);
    }
  };

  //handel change
  const handelOnChange = (e) => {
    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;

    const newData = { ...updateDataInitial };
    newData[fieldName] = fieldValue;
    if (newData.date && newData.type && newData.type !== "6") {
      newData.type === "1" || newData.type === "5"
        ? (newData.nextPaymentDate = moment(newData.date)
            .add(1, "months")
            .format("YYYY-MM-DD"))
        : newData.type === "2"
        ? (newData.nextPaymentDate = moment(newData.date)
            .add(3, "months")
            .format("YYYY-MM-DD"))
        : newData.type === "3"
        ? (newData.nextPaymentDate = moment(newData.date)
            .add(6, "months")
            .format("YYYY-MM-DD"))
        : (newData.nextPaymentDate = moment(newData.date)
            .add(12, "months")
            .format("YYYY-MM-DD"));
    }
    dispatch(addUpdateData(newData));
    // console.log(newData);
  };

  const datForPicker = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  return (
    <Modal
      show={updateModal}
      onHide={() => dispatch(updateModalTogal(false))}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            amount: updateDataInitial.amount,
            client: updateDataInitial?.client?._id,
            date: updateDataInitial.date,
            type: updateDataInitial?.type,
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
            <Form>
              <Form.Group>
                <Form.Label>Client</Form.Label>
                <Form.Select
                  placeholder="Client"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="client"
                  isInvalid={!!errors.client}
                  disabled={!clientList}
                >
                  {clientList?.map((client) => (
                    <option
                      value={client._id}
                      key={client._id}
                      selected={
                        updateDataInitial?.client._id === client._id
                          ? true
                          : false
                      }
                    >
                      {client.firstName + " " + client.lastName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.client}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Payment Type</Form.Label>
                <Form.Select
                  placeholder="Payment type"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="type"
                  isInvalid={!!errors.type}
                >
                  <option
                    value="1"
                    selected={updateDataInitial.type === 1 && true}
                  >
                    Monthly
                  </option>
                  <option
                    value="2"
                    selected={updateDataInitial.type === 2 && true}
                  >
                    3 Months
                  </option>
                  <option
                    value="3"
                    selected={updateDataInitial.type === 3 && true}
                  >
                    6 Months
                  </option>
                  <option
                    value="4"
                    selected={updateDataInitial.type === 4 && true}
                  >
                    Anual
                  </option>
                  <option
                    value="5"
                    selected={updateDataInitial.type === 5 && true}
                  >
                    Personal Traning
                  </option>
                  <option
                    value="6"
                    selected={updateDataInitial.type === 6 && true}
                  >
                    Other
                  </option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Amount"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="amount"
                  isInvalid={!!errors.amount}
                  value={updateDataInitial?.amount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Date"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="date"
                  isInvalid={!!errors.date}
                  value={datForPicker(updateDataInitial?.date || null)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
              </Form.Group>
              {updateDataInitial?.type !== "6" && (
                <Form.Group>
                  <Form.Label>Next Payment Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Date"
                    onChange={(e) => {
                      handelOnChange(e);
                      handleChange(e);
                    }}
                    name="nextPaymentDate"
                    isInvalid={!!errors.nextPaymentDate}
                    value={datForPicker(
                      updateDataInitial?.nextPaymentDate || null
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nextPaymentDate}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => dispatch(updateModalTogal(false))}
                >
                  Close
                </Button>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                  {loader ? <Spinner animation="border" size="sm" /> : "Update"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default UpdatePayment;
