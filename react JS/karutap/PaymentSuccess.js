import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import useInterval from "components/Polling";
import "./PaymentSuccess.css";
import { Grid, InputBase } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../images/LOGO.png";
import toast from "react-hot-toast";
import { actions as websiteActions } from "store/module/WebsiteModule";
import Modal from "react-modal";
import { PATHS } from "routes";

const PaymentSuccess = (props) => {
  const History = useHistory();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  const [theme, setTheme] = value;
  var planName = sessionStorage.getItem("PlanName");
  var cost = sessionStorage.getItem("Cost");
  var payorgID = sessionStorage.getItem("payorgID");
  var subPlanId = sessionStorage.getItem("plan-id");
  const [purchaseclick, setpurchaseclick] = React.useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const WebsiteState = useSelector((state) => state.website);
  const dispatch = useDispatch();
  const location = useLocation();

  const changeLanguageHandler = ({ target }) => {
    setLang(target.value);
    i18n.changeLanguage(target.value);
  };

  return (
    <Grid className="PaymentSuccessBackground">
      <Grid className="headerRowDiv1" style={{ flex: 0.1 }} xs={4}>
        <img src={logo} className="karutaHomeLogo" />
      </Grid>
      <Grid container spacing={2} className="PaymentSuccessContainer">
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
          <Grid xs={12} container className="PaymentSuccessForm">
            <Grid className="termsandConditions">
              {t("successfully_subscribed_the_plan")}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          xs={3}
          sm={3}
          md={2}
          lg={2}
          xl={2}
          className="PaymentSuccessFeatures"
        >
          <Grid
            className="createKarutaBtn"
            onClick={() => History.push(PATHS.LOGIN)}
          >
            <Grid className="createKarutaIcon">{t("DONE")}</Grid>
          </Grid>
        </Grid>
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className="PaymentSuccessBackgroundText"
        >
          {t("PAYMENT_SUCCESS")}
        </Grid>
      </Grid>
      <Grid container xs={12} className="footer">
        Copyright ©️ 2023_Geoglyph All Rights Reserved
      </Grid>
    </Grid>
  );
};

export default PaymentSuccess;
