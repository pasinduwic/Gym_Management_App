import { Nav, Tab } from "react-bootstrap";
import loginBack2 from "../images/loginBack2.jpg";

import LoginForm from "../components/loginComp/loginForm";
import SigninForm from "./loginComp/SigninForm";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setScreenSize } from "../redux/features/StatusVar";
import Notifications from "./Notification";

const Login = () => {
  const dispatch = useDispatch();
  const screenSize = useSelector((state) => state.statusVar.value.screenSize);
  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));

    window.addEventListener("resize", handleResize);
    handleResize();
    // console.log(screenSize)

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      className="login-page"
      style={{
        height: "100vh",
        // backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {screenSize > 800 ? (
        <div
          className="banner"
          style={{
            display: "flex",
            justifyContent: "center",
            width: "60%",
            height: "100%"
          }}
        >
          <img src={loginBack2} alt="login back" />
        </div>
      ) : (
        <></>
      )}
      <div
        style={{
          padding: "0 5%",
          borderRadius: "20px",
          width: "40%",
          minWidth: "320px",
          height: "500px"
        }}
      >
        <div
          className="login-header"
          style={{
            margin: "20px 20px 28px 20px"
          }}
        >
          <h3>Whelcome to App</h3>
        </div>
        <div
          className="login-content"
          style={{
            margin: "10px",
            padding: "10px"
          }}
        >
          <Tab.Container defaultActiveKey="login">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link
                  eventKey="login"
                  className="bg-transparent text-dark "
                >
                  Login
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="signin"
                  className="bg-transparent text-dark"
                >
                  Signin
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm />
              </Tab.Pane>
              <Tab.Pane eventKey="signin">
                <SigninForm />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
      <Notifications />
    </div>
  );
};

export default Login;
