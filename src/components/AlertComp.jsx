import { useEffect } from "react";
import { Alert, Fade } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addAlertDetails } from "../redux/features/StatusVar";

const AlertComp = ({ type, message }) => {
  const dispatch = useDispatch();
  const alertDetails = useSelector(
    (state) => state.statusVar.value.alertShowDetails
  );

  useEffect(() => {
    setTimeout(() => {
      dispatch(addAlertDetails({ status: false }));
    }, 2000);
  }, [alertDetails.status]);

  return (
    <Alert
      show={alertDetails.status}
      variant={type}
      className="w-100"
      transition={Fade}
    >
      {message}
    </Alert>
  );
};

export default AlertComp;
