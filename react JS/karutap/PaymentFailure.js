import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import "./PaymentFailure.css";
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import logo from "../../images/LOGO.png";
import toast from "react-hot-toast";
import { PATHS } from "routes";

const ReviewPlan = (props) => {
  const History = useHistory();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  const [theme, setTheme] = value;
  const changeLanguageHandler = ({ target }) => {
    setLang(target.value);
    i18n.changeLanguage(target.value);
  };

  return (
    <Grid className="PaymentFailureBackground">
      <Grid className="headerRowDiv1" style={{ flex: 0.1 }} xs={4}>
        <img src={logo} className="karutaHomeLogo" />
      </Grid>
      <Grid container spacing={2} className="PaymentFailureContainer">
        <Grid
          xs={2}
          sm={1}
          md={1}
          lg={1}
          xl={1}
          className="PaymentFailureDiv"
        ></Grid>
        <Grid
          xs={7}
          sm={8}
          md={9}
          lg={9}
          xl={9}
          container
          className="PaymentFailureDiv"
        >
          <Grid xs={12} container className="PaymentFailureForm">
            <Grid className="termsandConditions">
              {t("Sorry_your_payment_failed")}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          xs={3}
          sm={3}
          md={2}
          lg={2}
          xl={2}
          className="PaymentFailureFeatures"
        >
          <Grid
            className="createKarutaBtn"
            onClick={() => History.push(PATHS.WEBSITE)}
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
          className="PaymentFailureBackgroundText"
        >
          {t("PAYMENT_FAILURE")}
        </Grid>
      </Grid>
      <Grid container xs={12} className="footer">
        Copyright ©️ 2023_Geoglyph All Rights Reserved
      </Grid>
    </Grid>
  );
};

export default ReviewPlan;
