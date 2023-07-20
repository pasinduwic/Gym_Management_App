import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefreshToken";
import { addAlertDetails } from "../../redux/features/StatusVar";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);
  const persist = useSelector((state) => state.statusVar.value.persist);
  const dispatch = useDispatch();
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        console.log("Persist");
        await refresh();
      } catch (e) {
        dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "Something went wrong!"
          })
        );
      } finally {
        setIsLoading(false);
      }
    };

    persist && !sessionUser?.accessToken
      ? verifyRefreshToken()
      : setIsLoading(false);
  }, []);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={() => setIsLoading(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
