import React, { useEffect, useState } from "react";
import "./UserList.css";
import { PATHS } from "../routes/index";
import Avatar from "@mui/material/Avatar";
import { MdLogout } from "react-icons/md";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../store/module/Loginmodule";
import Loader from "./Loader";
import { actions as Pointaction } from "../store/module/Pointmodule";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import StaticContent from "./StatisContent";

function AllScreenHeader() {
  const History = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [logoutopen, setLogoutOpen] = React.useState(false);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const logoutState = useSelector((state) => state.login);
  const PointState = useSelector((state) => state.point);

  const handleClickLogoutOpen = () => {
    setLogoutOpen(true);
  };

  const handleLogoutClose = () => {
    setLogoutOpen(false);
  };

  useEffect(() => {
    const PROFILEIMAGE_PAYLOAD = {
      END_POINT1: "users",
      END_POINT2: userData.userId,
    };
    dispatch(Pointaction.profileimage(PROFILEIMAGE_PAYLOAD));
  }, []);

  const handleLogoutclick = () => {
    setloading(true);
    const Logout_Payload = {
      END_POINT1: "cocoLogout",
    };
    dispatch(actions.logout(Logout_Payload));
  };

  useEffect(() => {
    if (logoutState.logoutsuccess) {
      setLogoutOpen(false);
      dispatch(actions.resetState());
      setTimeout(() => {
        History(PATHS.LOGIN);

        setloading(false);
      }, 5);
    }
  }, [logoutState.logoutsuccess]);

  return (
   <div className="notificationIconDiv">
        <Loader load={loading} />
        <div
          style={{
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HiOutlineCurrencyRupee style={{ color: "	#DAA520" }} size="25" />
          {PointState.profileimageHeader?.balance == null
            ? 0
            : PointState.profileimageHeader?.balance}
        </div>
        {PointState?.profileimageHeader?.docUrl && (
          <Avatar
            onClick={() => History(PATHS.MYPROFILE)}
            id="allScreenHeaderMyProfileBtnId"
            alt="Remy Sharp"
            src={
              StaticContent.imageUrl + PointState?.profileimageHeader?.docUrl
            }
          />
        )}
        <MdLogout
          onClick={handleClickLogoutOpen}
          id="allScreenHeaderLogoutId"
          size="30"
          style={{ margin: "10px", cursor: "pointer" }}
        />
        <Dialog
          open={logoutopen}
          onClose={handleLogoutClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Logout"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to log out?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogoutClose} id="logoutCancelBtnId">
              Cancel
            </Button>
            <Button
              onClick={() => handleLogoutclick()}
              id="logoutLogoutBtnId"
              color="error"
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    
  );
}

export default AllScreenHeader;
