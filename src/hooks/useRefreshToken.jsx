import { useDispatch, useSelector } from "react-redux";
import axios, { axiosPrivate } from "../API/axios";
import { addAlertDetails, addSessionUser } from "../redux/features/StatusVar";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  // console.log("refresh token");
  const refresh = async () => {
    try {
      const responce = await axios.get("/api/users/refresh", {
        withCredentials: true
      });
      // if(responce.data.error){
      //   return responce.data
      // }
      // if (!sessionUser) {
      //   return;
      // }
      // console.log(responce.data)
      // const newUser = Object.assign({}, sessionUser);
      const newUser = responce.data;
      // newUser["accessToken"] = responce.data.accessToken;

      // console.log(responce.data.accessToken);
      // console.log(newUser);

      dispatch(addSessionUser({ type: "add", payload: newUser }));
      return responce.data.accessToken;
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!"
        })
      );
    }
  };
  return refresh;
};

export default useRefreshToken;
