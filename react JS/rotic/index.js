import { getHttpClient } from "../../service/rest-api";
import { toast } from "react-hot-toast";

const apiMiddleWare =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (
      action.hasOwnProperty("request") &&
      !action.hasOwnProperty("response")
    ) {
      const langDetails = JSON.parse(sessionStorage.getItem("UserData"));
      const { request } = action;
      let isOnline = navigator.onLine;
      if (!isOnline) {
        toast.error(
          langDetails?.languageId === 1
            ? "インターネット接続を確認して、もう一度お試しください。"
            : "Check your internet connection and try again.",
          { duration: 5000 }
        );
      }
      if (request.isLoading) {
        dispatch({ type: "showLoading" });
      }
      return new Promise((resolve, reject) => {
        dispatch({ type: action.type + "Req", response: action });
        getHttpClient(
          request.path,
          request.method,
          request.data,
          request.params,
          request.withCredentials
        )
          .request()
          .then((data) => {
            if (request.isLoading) {
              dispatch({ type: "hideLoading" });
            }
            if (action.pagination) {
              //added this changes to verify is the request for pagination in reducer. so that we can append array instead of assigning.
              dispatch({
                type: action.type,
                response: data,
                request: request,
                pagination: action.pagination,
              });
            } else {
              dispatch({ type: action.type, response: data, request: request });
            }
            resolve(data);
          })
          .catch((e) => {
            if (e?.errorCode == 401) {
              sessionStorage.clear();
              toast.error(
                langDetails?.languageId === 1
                  ? "セッションの有効期限が切れました"
                  : "Your session has expired.",
                { duration: 5000 }
              );
              setTimeout(() => {
                window.location = `/`;
              }, 100);
            }
            if (request.isLoading) {
              dispatch({ type: "hideLoading" });
            }
            dispatch({ type: action.type + "_FAIL", error: e });
            reject(e);
          });
      });
    } else {
      next(action);
    }
  };

export default apiMiddleWare;
