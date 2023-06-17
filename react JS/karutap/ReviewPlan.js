import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import useInterval from "components/Polling";
import "./ReviewPlan.css";
import { Grid, InputBase } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../images/LOGO.png";
import toast from "react-hot-toast";
import { actions as websiteActions } from "store/module/WebsiteModule";
import Modal from "react-modal";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { PATHS } from "routes";
const customStyles = {
  content: {
    top: "45%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    height: "auto",
    marginRight: "-50%",
    width: "35%",
    border: "2px solid",
    borderColor: "rgb(0, 145, 255)",
    transform: "translate(-50%, -50%)",
    background:
      "linear-gradient(180deg, rgba(244,225,225,0.9037990196078431) 0%, rgba(193,224,240,1) 0%, rgba(255,255,255,1) 100%)",
  },
};

const ReviewPlan = (props) => {
  const History = useHistory();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  const [theme, setTheme] = value;
  var payorgID = sessionStorage.getItem("payorgID");
  var subPlanId = sessionStorage.getItem("plan-id");
  const [purchaseclick, setpurchaseclick] = React.useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const WebsiteState = useSelector((state) => state.website);
  const dispatch = useDispatch();
  const location = useLocation();
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {}
  function closeModal() {
    setIsOpen(false);
  }
  const changeLanguageHandler = ({ target }) => {
    setLang(target.value);
    i18n.changeLanguage(target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const redirectPayment = async () => {
    const planpayment_Payload = {
      END_POINT1: "pay",
      END_POINT2: payorgID,
      Query: {
        subPlanId: subPlanId,
        paymentMethod: "PAYPAL",
        currency: location.state.currency,
        description: "TEST",
        intent: "SALE",
      },
    };
    await dispatch(websiteActions.postPlanpayment(planpayment_Payload));
  };
  useEffect(() => {
    if (sessionStorage.getItem("Purchaseclicked") == "true") {
      setIsOpen(true);
      setpurchaseclick(true);
    }
  });
  useInterval(async () => {
    const Plan_status_Payload = {
      END_POINT1: "org",
      END_POINT2: payorgID,
      END_POINT3: "sub",
      END_POINT4: subPlanId,
      END_POINT5: "payment",
      END_POINT6: "status",
    };
    await dispatch(websiteActions.getpaymentStatus(Plan_status_Payload));
  }, 3000);
  useEffect(() => {
    var windowFeatures =
      "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    console.log("the payment stst=--=", WebsiteState.planpaymentres);
    if (WebsiteState.planpaymentres) {
      var url = WebsiteState.planpaymentres.slice(
        9,
        WebsiteState.planpaymentres.length
      );
      console.log("WebsiteState.planpaymentres", url);
      window.open(url, "PAYPAL", windowFeatures);
    }
  });

  useInterval(async () => {
    if (WebsiteState.paymentstatus?.data == "ACTIVE") {
      History.push(PATHS.PAYMENTSUCCESS);
    } else if (WebsiteState.paymentstatus?.data == "CANCELED") {
      History.push(PATHS.PAYMENTFAILURE);
    }
  }, 2000);

  return (
    <Grid className="SignUpBackground">
      <Grid className="headerRowDiv1" style={{ flex: 0.1 }} xs={4}>
        <img src={logo} className="karutaHomeLogo" />
      </Grid>
      <Grid container spacing={2} className="SignUpConfirmationContainer">
        <Grid
          xs={2}
          sm={1}
          md={1}
          lg={1}
          xl={1}
          className="PaymentSuccessDiv"
        ></Grid>
        <Grid
          xs={7}
          sm={8}
          md={9}
          lg={9}
          xl={9}
          container
          className="PaymentSuccessDiv"
        >
          <Grid xs={12} container className="reviewPlanForm">
            <Grid className="emailverification">
              {t("REVIEW_YOUR_PLAN")} <br></br>
            </Grid>
            <Grid className="emailverification1">
              {t(
                "By_subscribing_you_agree_to_KaruTAP_payment_Terms_Your_Subscription_starts_as_soon_as_your_payment_has_been_confirmed"
              )}
              <br></br>
            </Grid>
            <Grid container xs={12} className="emailverification1">
              {t("Plan1")} - {location.state.planName}
            </Grid>
            <Grid container xs={12} className="emailverification1">
              {t("Bill")}
            </Grid>
            <Grid container xs={6} className="planDetails">
              <Grid className="planprice">{t("Plan_price")}</Grid>
              <Grid className="planAmount">
                {location.state.cost}
                {location.state.currencySymbol}
              </Grid>
            </Grid>
            <hr style={{ width: "20vw", marginTop: "2vh" }}></hr>
            <Grid container xs={6} className="planDetails1">
              <Grid className="planprice">{t("Total_price")}</Grid>
              <Grid className="planAmount">
                {location.state.cost}
                {location.state.currencySymbol}
              </Grid>
            </Grid>
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
        <Grid xs={3} sm={3} md={2} lg={2} xl={2} className="SignUpFeatures">
          <Grid className="createKarutaBtn">
            <Grid
              className="createKarutaIcon"
              onClick={() => {
                handleClickOpen();
                sessionStorage.setItem("Purchaseclicked", true);
                setpurchaseclick(true);
                redirectPayment();
              }}
            >
              {t("Purchase")}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className="SignUpBackgroundText"
        >
          REVIEW PLAN
        </Grid>
        <Grid container xs={12} className="footer">
          Copyright ©️ 2023_Geoglyph All Rights Reserved
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReviewPlan;
