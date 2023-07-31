import { Button, Form, Spinner } from "react-bootstrap";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../config/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import axios from "axios";
import axios from "../../API/axios";
import { useDispatch } from "react-redux";
import {
  addAlertDetails,
  addSessionUser,
  addTogalPersist
} from "../../redux/features/StatusVar";
import logo from "../../images/google.png";
import AlertComp from "../AlertComp";
import { useSelector } from "react-redux";
import Notifications from "../Notification";

const LoginForm = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home/dashboard";

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: ""
  });
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const dispatch = useDispatch();
  const persist = useSelector((state) => state.statusVar.value.persist);

  const loginRequest = async (data) => {
    try {
      // console.log(data);

      const responce = await axios.post("/api/users/login", data, {
        withCredentials: true
      });
      const user = responce.data;
      // console.log(user);

      if (user.error) {
        dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "Invalid credentials!"
          })
        );
        return;
      }
      dispatch(addSessionUser({ type: "add", payload: user }));
      // console.log(user);
      navigate(from, { replace: true });
    } catch (e) {
      // console.log(e);
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!!"
        })
      );
    } finally {
      setLoaderStatus(false);
    }
  };

  const useGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      if (!user.user) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "Something went wrong!"
          })
        );
      }
      if (user.user) {
        const googleUser = {
          email: user.user.email,
          password: user.user.uid
        };
        loginRequest(googleUser);
      }
    } catch (e) {
      // console.log(e)
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!!"
        })
      );
    }
    // console.log("used google");
  };

  const validateForm = () => {
    // console.log(userDetails);
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])((?!pasindu).){8,}$/;
    let status = true;
    // console.log("check");
    if (!userDetails.email || userDetails?.email === "") {
      setErrors((prevState) => ({
        ...prevState,
        email: "Email is required!"
      }));
      status = false;
      // console.log(errors);
    } else if (!regexEmail.test(userDetails.email)) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Email is not valid!"
      }));
      status = false;
      // console.log(errors);
    }

    if (!userDetails.password || userDetails?.password === "") {
      setErrors((prevState) => ({
        ...prevState,
        password: "Password is required!"
      }));
      status = false;
      // console.log(errors);
    }
    if (userDetails?.password.length < 8 && userDetails?.password.length > 0) {
      setErrors((prevState) => ({
        ...prevState,
        password: "Password is not strong!"
      }));
      status = false;
    } else if (!regexPassword.test(userDetails.password)) {
      setErrors((prevState) => ({
        ...prevState,
        password: "Password is not Valid!"
      }));
      status = false;
    }

    return status;
  };

  const handleOnChange = (e) => {
    const key = e.target.getAttribute("name");
    const enterdValue = e.target.value;
    // console.log(key);
    const newData = { ...userDetails };
    newData[key] = enterdValue;
    setUserDetails(newData);
    if (errors) {
      if (!!errors[key]) {
        setErrors({
          ...errors,
          [key]: null
        });
      }
    }

    // console.log(errors);
    // console.log(userDetails);
  };

  const handelLogin = async (e) => {
    e.preventDefault();

    const isValid = await validateForm();
    // console.log("errors");
    // console.log("userDetails");
    // console.log(userDetails);

    if (isValid) {
      if (userDetails) {
        setLoaderStatus(true);
        const data = userDetails;
        loginRequest(data);
        // console.log(data);
      }
    }
  };

  const togalPersist = () => {
    dispatch(addTogalPersist());
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);
  return (
    <div className="login-form">
      <Form className="mt-3">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={handleOnChange}
            isInvalid={!!errors?.email}
            size="sm"
            // className="bg-dark text-light"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleOnChange}
            isInvalid={!!errors?.password}
            size="sm"
            // className="bg-dark text-light"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="formBasicPassword"
          style={{ textAlign: "left" }}
        >
          <Form.Check
            type="checkbox"
            label="Trust this device"
            onChange={togalPersist}
            checked={persist}
          />
        </Form.Group>
        <Button
          variant="secondary"
          type="submit"
          onClick={handelLogin}
          className="mb-3 w-100"
        >
          {loaderStatus ? (
            <Spinner animation="border" variant="secondary" size="sm" />
          ) : (
            "Login"
          )}
        </Button>
      </Form>
      <div className="login-options">
        <p style={{ margin: "0" }}>
          Login with{" "}
          <button
            style={{
              background: "none",
              border: "none",
              color: "#0d6efd",
              textDecoration: "underline"
            }}
            onClick={useGoogle}
          >
            <img src={logo} alt="" style={{ width: "28px" }} />
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
