import React, { useState } from "react";
import { Grid } from "@mui/material";
import { FaLock, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { PATHS } from "../routes/index";
import "./Style.css";
import { useTranslation } from "react-i18next";
import { useOperation } from "../redux/operations";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import InputField from "../components/InputField";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import i18next from "i18next";
import { toast } from "react-hot-toast";

function Login() {
  const History = useNavigate();
  const { t } = useTranslation();
  const operation = useOperation();
  const dispatch = useDispatch();
  const [email, setemail] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  //LOIGN ERROR
  const [error, setError] = useState("");
  const [password, setpassword] = useState({
    password: "",
    showPassword: false,
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForgotPasswordEmail("");
  };

  const handleClickShowPassword = () => {
    setpassword({ ...password, showPassword: !password.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handlePasswordChange = (prop) => (event) => {
    setpassword({ ...password, [prop]: event.target.value });
  };

  // LOGIN API
  const onclickSigninbutton = () => {
    dispatch(
      operation.user.login({ password: password?.password, username: email })
    )
      .then((res) => {
        sessionStorage.setItem("AccessToken", JSON.stringify(res?.data));
        dispatch(operation.user.user()).then((res) => {
          sessionStorage.setItem("UserData", JSON.stringify(res?.data?.data));
          if (res?.data?.data?.roleId === 1) {
            if (res?.data?.data?.languageId === 1) {
              sessionStorage.setItem("i18nextLng", "jp");
              i18next.changeLanguage("jp");
            } else {
              sessionStorage.setItem("i18nextLng", "en");
              i18next.changeLanguage("en");
            }
            History(PATHS.DASHBOARD);
          } else if (res?.data?.data?.roleId === 2) {
            History(PATHS.ORGADMINDASHBOARD);
            if (res?.data?.data?.languageId === 1) {
              sessionStorage.setItem("i18nextLng", "jp");
              i18next.changeLanguage("jp");
            } else {
              sessionStorage.setItem("i18nextLng", "en");
              i18next.changeLanguage("en");
            }
          } else if (res?.data?.data?.roleId === 3) {
            History(PATHS.PROJECTMANAGERDASHBOARD);
            if (res?.data?.data?.languageId === 1) {
              sessionStorage.setItem("i18nextLng", "jp");
              i18next.changeLanguage("jp");
            } else {
              sessionStorage.setItem("i18nextLng", "en");
              i18next.changeLanguage("en");
            }
          } else History(PATHS.EMPLOYEETIMESHEET);
          if (res?.data?.data?.languageId === 1) {
            sessionStorage.setItem("i18nextLng", "jp");
            i18next.changeLanguage("jp");
          } else {
            sessionStorage.setItem("i18nextLng", "en");
            i18next.changeLanguage("en");
          }
        });
      })
      .catch((e) => {
        if (e?.statusCode == 401) {
          setError(e?.data);
        }
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onclickSigninbutton();
    }
  };

  //LOGIN REDUX
  const LoginData = useSelector((state) => state.user.result);

  // FORGOT PASSWORD
  const onClickForgotPasswordEmailSubmit = () => {
    const FORGOT_PASSWORD = {
      emailAddress: forgotPasswordEmail,
    };
    dispatch(operation.user.forgotPassword(FORGOT_PASSWORD))
      .then((res) => {
        setForgotPasswordEmail("");
        setOpen(false);
        toast.success(res?.data, { duration: 8000 });
      })
      .catch((e) => console.log("forgotPasswordError", e));
  };

  return (
    <>
      <Grid container className="loginContainer">
        <div className="loginGrid w-100">
          <div className="loginGridSec">
            <img src="https://res.cloudinary.com/ssjltc/image/upload/v1663849027/rotic/logo1_gimp7y.jpg" />
          </div>
          <div className="loginGridSec">
            <div className="loginGridInner">
              <div className="loginHeader">
                <h2>{t("LOGIN")}</h2>
              </div>
              <p
                style={{
                  color: "red",
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                {error}
              </p>
              <div className="emailDiv">
                <div className="emailLabel">
                  <label htmlFor="emailId">{t("Email_Id")}</label>
                </div>
                <MdEmail size={20} className="loginInputFieldIcons" />
                <input
                  className="loginInputFields"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                  id="emailId"
                  name="emailId"
                />
              </div>
              <div className="emailDiv">
                <div className="emailLabel">
                  <label htmlFor="password">{t("Password")}</label>
                </div>
                <FaLock size={20} className="loginInputFieldIcons" />
                <div
                  className="eyeCloseaOpenIcon"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {password.showPassword ? (
                    <FaRegEye size={20} />
                  ) : (
                    <FaRegEyeSlash size={20} />
                  )}
                </div>
                <input
                  className="loginInputFields loginInputFieldsPwd "
                  type={password.showPassword ? "text" : "password"}
                  value={password.password}
                  onChange={handlePasswordChange("password")}
                  onKeyPress={handleKeyPress}
                  id="password"
                  name="password"
                />
              </div>
              <div>
                <div className="forgotPasswordLinkDiv">
                  <div style={{ cursor: "pointer" }} onClick={handleClickOpen}>
                    {t("Forgot_Password?")}
                  </div>
                </div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">
                    {t("Forgot_Password?")}
                  </DialogTitle>
                  <DialogContent>
                    {t("Enter_your_Email_address_to_retrieve_your_password")}
                    <Grid xs={12}>
                      <InputField
                        name={t("Email_Id")}
                        value={forgotPasswordEmail}
                        onChange={(e) => {
                          setForgotPasswordEmail(e.target.value);
                        }}
                        id="forgotPasswordId"
                      />
                    </Grid>
                  </DialogContent>

                  <DialogActions>
                    <Button
                      color="error"
                      id="forgotPasswordNoIcon"
                      onClick={handleClose}
                    >
                      {t("No")}
                    </Button>
                    <Button
                      id="forgotPasswordYesIcon"
                      onClick={() => onClickForgotPasswordEmailSubmit()}
                    >
                      {t("Yes")}
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              <Grid
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="buttonDiv"
              >
                <button
                  onClick={() => {
                    onclickSigninbutton();
                  }}
                  className="loginButton"
                >
                  {t("LOGIN")}
                </button>
              </Grid>
            </div>
          </div>
        </div>
      </Grid>
    </>
  );
}

export default Login;
