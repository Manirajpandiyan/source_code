import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import DialogueBox from "components/DialogueBox";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useHistory } from "react-router-dom";
import "./Navbar.css";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { RiGroup2Line } from "react-icons/ri";
import { MdOutlineGroups } from "react-icons/md";
import LanguageSelect from "components/LanguageSelectAdmin";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineBugReport } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import logo from "../../images/LOGO.png";
import { actions } from "store/module/Loginmodule";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { PATHS } from "routes";
import { Helmet } from "react-helmet";

const drawerWidth = 240;

function Navbar(props) {
  const { window } = props;
  const logoutState = useSelector((state) => state.login);
  const { t, i18n } = useTranslation();
  const [isMounted, setisMounted] = useState(false);
  const dispatch = useDispatch();
  const History = useHistory();
  const ProfileState = useSelector((state) => state.profile);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout_click = () => {
    const Logout_Payload = {
      END_POINT1: "karutaLogout",
    };
    dispatch(actions.logOut(Logout_Payload));
  };
  const notify = () =>
    toast.success(t("Logout_Successfull"), {
      duration: 4000,
      position: "top-center",
    });
  useEffect(() => {
    console.log("logoutState==>>>", logoutState);
    if (logoutState.logoutsuccess?.data?.statusCode == 200) {
      setisMounted(false);
      notify();
      History.push(PATHS.LOGIN);
    }
  });

  const mount_dialogue = () => {
    setisMounted(true);
  };
  const unmount_dialogue = () => {
    setisMounted(false);
  };

  const drawer = (
    <div className="AdminToolBarDiv">
      <Toolbar />
      <List style={{ flexGrow: 1 }}>
        <ListItem onClick={() => History.push(PATHS.USERMANAGEMENT)}>
          <Typography
            variant="display3"
            className="adminNavBarLinks"
            style={{ marginTop: "20px" }}
          >
            <RiGroup2Line className="userManagementIcon" />
            {t("USER_MANAGEMENT")}
          </Typography>
        </ListItem>
        <ListItem onClick={() => History.push(PATHS.GROUPMANAGEMENT)}>
          <Typography
            variant="display3"
            className="adminNavBarLinks"
            style={{ marginTop: "20px" }}
          >
            <MdOutlineGroups className="groupManagementIcon" />
            {t("GROUP_MANAGEMENT")}
          </Typography>
        </ListItem>
        <ListItem
          onClick={() => History.push(PATHS.ACCOUNTSUBSCRIPTIONMANAGEMENT)}
        >
          <Typography
            variant="display3"
            className="adminNavBarLinks"
            style={{ marginTop: "20px" }}
          >
            <MdOutlineSubscriptions className="accountSubscriptionManagementIcon" />
            {t("ACCOUNT_SUBSCRIPTION")}
          </Typography>
        </ListItem>
        <ListItem onClick={() => History.push(PATHS.ISSUEMANAGEMENT)}>
          <Typography
            variant="display3"
            className="adminNavBarLinks"
            style={{ marginTop: "20px" }}
          >
            <MdOutlineBugReport className="issueReportManagementIcon" />
            {t("ISSUES_MANAGEMENT")}
          </Typography>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Helmet>
        <html translate="no"></html>
        <meta name="google" content="notranslate" />
        <html lang="en" class="notranslate"></html>
        <meta http-equiv="content-language" content="en" />
      </Helmet>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar className="AdminNavBarDiv">
          <IconButton
            color="default"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Grid className="adminKarutaLogoDiv" xs={2}>
            <img src={logo} className="adminKarutaLogo" />
          </Grid>
          <Grid className="adminNavBarIconsDiv" xs={10}>
            <LanguageSelect UserData={ProfileState.profile} user={"admin"} />
            <RiLogoutCircleRLine
              onClick={mount_dialogue}
              className="adminNavBarIcon"
            />
            <DialogueBox
              content={"Logout"}
              load={isMounted}
              value={`Are you sure you want to Logout?`}
              action={logout_click}
              cancel={unmount_dialogue}
            />
          </Grid>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
