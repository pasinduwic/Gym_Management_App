import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { addAlertDetails } from "../redux/features/StatusVar";

const Notifications = () => {
  const alertDetails = useSelector(
    (state) => state.statusVar.value.alertShowDetails
  );
  const dispatch = useDispatch();

  return (
    <>
      {/* notification */}
      <Snackbar
        open={alertDetails.status}
        autoHideDuration={6000}
        onClose={() =>
          dispatch(
            addAlertDetails({ status: false, type: "success", message: "test" })
          )
        }
        sx={{ width: "320px" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={alertDetails.type}
          onClose={() =>
            dispatch(
              addAlertDetails({
                status: false,
                type: "success",
                message: "test"
              })
            )
          }
          sx={{ width: "100%" }}
        >
          {alertDetails.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Notifications;
