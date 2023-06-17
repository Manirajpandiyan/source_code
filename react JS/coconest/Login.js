import React, { useEffect, useState } from "react";
import { Grid } from '@mui/material';
import './Login.css';
import LOGO from '../images/coco_mail.png';
import InputAdornment from '@mui/material/InputAdornment';
import Input from "@mui/material/Input";
import { MdOutlineMail, MdLockOutline } from 'react-icons/md';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { PATHS } from '../routes/index';
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../store/module/Loginmodule";
import StaticContent from "./StatisContent";
import Loader from "./Loader";



const Login = () => {
  const History = useNavigate()
  const [email, setemail] = useState('')
  const [errorStatus, setErrorStatus] = useState([]);
  const [apicount, setapicount] = useState(0)
  const [loading, setloading] = useState(false)
  const [password, setpassword] = useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setpassword({ ...password, showPassword: !password.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (prop) => (event) => {
    setpassword({ ...password, [prop]: event.target.value });
  };

  const handleKeypress = e => {
    if (e.keyCode === 13) {
      onclickSigninbutton();
    }
  };

  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.login);

  const onclickSigninbutton = () => {
    setErrorStatus([]);
    const Login_Payload = {
      END_POINT: "login",
      PAYLOAD_DATA: JSON.stringify({ password: password.password, username: email }),
    };
    dispatch(actions.login(Login_Payload));
    setloading(true)
  }

  useEffect(() => {

    if (loginState.logindata) {
      if (loginState.logindata[0].startsWith("{") && apicount < 3) {
        sessionStorage.setItem('accessToken', JSON.parse(loginState.logindata[0]).accessToken)
        dispatch(actions.resetState());
        setloading(false)
        const User_Payload = {
          END_POINT1: "user",
        };

        dispatch(actions.userfetch(User_Payload));
        setapicount(4)
      }
      else if (loginState.logindata[0].startsWith("username") && apicount < 3) {
        setErrorStatus(loginState.logindata[0])
        dispatch(actions.resetState());
        setloading(false)
      }

    }
  }, [loginState.logindata])


  useEffect(() => {

    if (loginState.userdata) {
      if (loginState.userdata.statusCode == StaticContent.Status200) {
        sessionStorage.setItem('userData', JSON.stringify(loginState.userdata.data))
        console.log('loginstate----->>>>', loginState.userdata.data?.roleId);
        if (loginState.userdata.data?.roleId === 1) {
          History(PATHS.USERLIST)
        }
        else if (loginState.userdata.data?.roleId === 2) {
          History(PATHS.MANAGERUSERLIST)
        }
        else if (loginState.userdata.data?.roleId === 3) {
          History(PATHS.MEMBERBOOKINGMANAGEMENT)
        }

      }
    }
  }, [loginState.userdata])


  return (
    <div className="background">

      <Grid container className='loginContainer'>
        <Loader load={loading} />
        <Grid xs={12} sm={5} md={5} lg={4} xl={4} className='loginSubContainer'>
          <Grid xs={12} >
            <img className='coconestLogo' src={LOGO} />
          </Grid>
        </Grid>
        <Grid xs={12} sm={5} md={5} lg={4} xl={4} className='loginSubContainer2'>
          <div className="loginPageText">
            <Grid xs={12} className='loginTexts'>
              Log In
            </Grid>
            <Grid xs={12} style={{ color: "red", paddingTop: "15px", justifyContent: "center", paddingBottom: "15px", alignItems: "center", display: "flex" }}>
              {errorStatus}
            </Grid>
            <Grid xs={12}>
              <div className='email'>
                <Input onKeyPress={handleKeypress} id="loginEmailId" placeholder="Email" fullWidth onChange={(e) => { setemail(e.target.value) }} value={email}
                  startAdornment={<InputAdornment position="start"><MdOutlineMail style={{ fontSize: "25px" }} /></InputAdornment>} />
              </div>
            </Grid>
            <Grid xs={12}>
              <div className='password'>
                <Input onKeyPress={handleKeypress} id="loginPasswordId" placeholder="Password" fullWidth
                  type={password.showPassword ? "text" : "password"}
                  onChange={handlePasswordChange("password")}
                  value={password.password}
                  startAdornment={<InputAdornment position="start"><MdLockOutline style={{ fontSize: "25px" }} /></InputAdornment>}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {password.showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </div>
            </Grid>
            <div className='forgotPasswordDiv'></div>
            <Grid xs={12} style={{ marginTop: "20px", }}>
              <input type="submit" onClick={() => { onclickSigninbutton() }} className='signInBtn' value="Sign In"></input>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
export default Login;