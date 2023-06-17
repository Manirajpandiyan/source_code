import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import { styled } from "@mui/material/styles";
import "./OrgAdmin.css";
import "./AddNewUser.css";
import "./AccountSubscriptionReviewplan.css";
import "./AccountSubscriptionAddPlan.css";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from "./Navbar";
import useInterval from "components/Polling";
import { useHistory, useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { PATHS } from "routes";
import { actions } from "store/module/AccountSubscriptionModule";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));
const AccountSubscriptionReviewPlan = (props) => {
  const History = useHistory();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  const [purchaseclick, setpurchaseclick] = React.useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const accountSubscriptionState = useSelector(
    (state) => state.accountsubscription
  );
  console.log({ value });
  const [value1, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  var orgId = sessionStorage.getItem("Org_ID");
  const changeLanguageHandler = ({ target }) => {
    setLang(target.value1);
    i18n.changeLanguage(target.value1);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const location = useLocation();
  var planDetails = JSON.parse(location.state.planDetails);
  const CustomTextField = styled((props) => (
    <TextField
      fullWidth
      style={{ marginTop: "50px" }}
      InputProps={{ disableUnderline: true }}
      {...props}
    />
  ))(({ theme }) => ({
    "& label.Mui-focused": {
      color: "black",
    },
    "& .MuiFilledInput-root": {
      disableUnderline: "true",
      border: "1px solid #f1f1f1",
      overflow: "hidden",
      borderRadius: 5,
      backgroundColor: "#f1f1f1",
      boxShadow: "5px 5px 10px #bdc0c2,-5px -5px 10px #ffffff",
      transition: theme.transitions.create([
        "border-color",
        "background-color",
        "box-shadow",
      ]),

      "& .MuiInput-underline:after": {
        borderBottomColor: "green",
      },
      "&.Mui-focused": {
        disableUnderline: "true",
        color: "#595959",
        borderColor: "#f1f1f1",
        boxShadow: "inset 5px 5px 10px #bdc0c2, inset -5px -5px 10px #ffffff",
      },
    },
  }));
  const breadcrumbs = [
    <Link
      onClick={() => History.push(PATHS.ACCOUNTSUBSCRIPTIONMANAGEMENT)}
      fontSize="13px"
      underline="hover"
      key="1"
      color="inherit"
    >
      {t("Account_Subscription")}
    </Link>,
    <Link
      onClick={() => History.push(PATHS.ACCOUNTSUBSCRIPTIONADDPLAN)}
      fontSize="13px"
      underline="hover"
      key="1"
      color="inherit"
    >
      {t("Add_Plan")}
    </Link>,
    <Typography style={{ fontSize: "13px" }} key="2" color="text.primary">
      {t("Review_plan")}
    </Typography>,
  ];
  const orgplanPayment = async () => {
    const planpayment_Payload = {
      END_POINT1: "pay",
      Query: {
        subPlanId: planDetails?.subPlanId,
        paymentMethod: "PAYPAL",
        currency: planDetails?.currency,
        description: "TEST",
        intent: "SALE",
      },
    };
    await dispatch(actions.postorgPlanpayment(planpayment_Payload));
  };
  useInterval(async () => {
    const org_Plan_status_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "sub",
      END_POINT4: planDetails?.subPlanId,
      END_POINT5: "payment",
      END_POINT6: "status",
    };
    await dispatch(actions.getorgpaymentStatus(org_Plan_status_Payload));
  }, 3000);
  useInterval(async () => {
    if (accountSubscriptionState.orgpaymentstatus?.data == "ACTIVE") {
      History.push(PATHS.ORGPAYMENTSUCCESS);
    } else if (accountSubscriptionState.orgpaymentstatus?.data == "CANCELED") {
      History.push(PATHS.ORGPAYMENTFAILURE);
    }
  }, 2000);
  useEffect(() => {
    if (sessionStorage.getItem("Purchaseclicked") == "true") {
      setIsOpen(true);
      setpurchaseclick(true);
    }
  });
  useEffect(() => {
    var windowFeatures =
      "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    console.log(
      "the payment stst=--=",
      accountSubscriptionState.planorgpaymentres
    );
    if (accountSubscriptionState.planorgpaymentres) {
      var url = accountSubscriptionState.planorgpaymentres.slice(
        9,
        accountSubscriptionState.planorgpaymentres.length
      );
      console.log("accountSubscriptionState.planorgpaymentres", url);
      window.open(url, "PAYPAL", windowFeatures);
    }
  });
  return (
    <div className="orgadminTop">
      <Navbar />
      <Grid className="orgAdminContainer">
        <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
          <Grid className="orgAdminHeader">
            <Grid
              container
              direction="row"
              className="orgAdminBtnDiv"
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className="orgAdminHeadings"
              >
                <div>{t("Account_Subscription_Management")}</div>
                <div>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {breadcrumbs}
                  </Breadcrumbs>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ width: "100%" }} className="addSubscriptionPlanBox">
            <Grid
              container
              xs={12}
              className="addSubscriptionReviewPlanMainContainer"
            >
              <Grid xs={12} className="reviewPlanText1">
                {t("Review_your_plan")}
              </Grid>
              <Grid xs={12}>
                {" "}
                {t(
                  "By_subscribing_you_agree_to_KaruTAP_payment_Terms_Your_Subscription_starts_as_soon_as_your_payment_has_been_confirmed"
                )}
              </Grid>
              <Grid xs={12} className="reviewPlanText">
                {t("Plan")}-{planDetails?.planName}
              </Grid>
              <Grid xs={12} className="Line1">
                {t("Bill")}{" "}
              </Grid>
              <Grid container xs={12}>
                <Grid textAlign={"right"} xs={5}>
                  {t("Plan_price")}
                </Grid>
                <Grid xs={2}></Grid>
                <Grid textAlign={"left"} xs={5}>
                  {planDetails?.cost}
                  {planDetails?.currency}
                </Grid>
              </Grid>
              <Grid xs={4.1}>
                <hr className="Line"></hr>
              </Grid>
              <Grid container xs={12} justifyContent="center">
                <Grid textAlign={"right"} xs={5}>
                  {t("Total_price")}
                </Grid>
                <Grid xs={2}></Grid>
                <Grid textAlign={"left"} xs={5}>
                  {planDetails?.cost}
                  {planDetails?.currency}
                </Grid>
              </Grid>
              <Dialog
                open={open}
                onClose={handleClose}
                className="dialog_container"
                keepMounted
                disableEscapeKeyDown={true}
                disableEnforceFocus
                disableScrollLock
                disablePortal
                disableAutoFocus
              >
                <DialogContent className="dialog_content">
                  <DialogTitle>{t("Payment_processing")}</DialogTitle>
                </DialogContent>
              </Dialog>
              <Grid
                container
                xs={12}
                justifyContent="center"
                className="planViewTextContainer1"
              >
                <Button
                  className="orgAdminSaveBtn"
                  onClick={() => {
                    handleClickOpen();
                    sessionStorage.setItem("Purchaseclicked", true);
                    setpurchaseclick(true);
                    orgplanPayment();
                  }}
                >
                  {t("PURCHASE")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default AccountSubscriptionReviewPlan;
