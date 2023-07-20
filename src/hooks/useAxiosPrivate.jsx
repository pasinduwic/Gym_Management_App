import { useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosPrivate } from "../API/axios";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  // console.log("privetnew")
  const refresh = useRefreshToken();
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.response.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `token ${sessionUser?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responceIntercept = axiosPrivate.interceptors.response.use(
      (responce) => responce,
      async (error) => {
        const preRequest = error?.config;
        if (error?.response?.status === 403 && !preRequest?.sent) {
          preRequest.sent = true;
          // console.log("privet2");
          const newAccessToken = await refresh();

          // console.log("newAccessToken");
          // console.log(newAccessToken);
          newAccessToken
            ? (preRequest.headers["Authorization"] = `token ${newAccessToken}`)
            : (preRequest.headers["Authorization"] = undefined);
          return axiosPrivate(preRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.response.eject(responceIntercept);
      axiosPrivate.interceptors.response.eject(requestIntercept);
    };
  }, [refresh, sessionUser]);

  return axiosPrivate;
};

export default useAxiosPrivate;
