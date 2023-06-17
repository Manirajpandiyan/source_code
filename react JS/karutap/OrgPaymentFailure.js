import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import "./OrgAdmin.css";
import "./OrgPaymentFailure.css";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from "./Navbar";
import { useHistory } from "react-router-dom";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import DialogActions from "@mui/material/DialogActions";
import PropTypes from "prop-types";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BsFillEyeFill } from "react-icons/bs";
import Dialog from "@mui/material/Dialog";
import { tableIcons } from "../utils";
import Button from "@mui/material/Button";
import { PATHS } from "routes";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { t } from "i18next";

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

const OrgPaymentFailure = (props) => {
  const History = useHistory();

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
              </Grid>
            </Grid>
          </Grid>
          <Grid className="OrgPaymentSuccessForm">
            <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
              <Grid className="termsandConditions">
                {t("Sorry_your_payment_failed")}
              </Grid>

              <Grid
                container
                direction="row"
                className="OrgpaymentSuccessButton"
              >
                <Button
                  title="create"
                  className="orgAdminDeleteGrouprBtn"
                  onClick={() =>
                    History.push(PATHS.ACCOUNTSUBSCRIPTIONMANAGEMENT)
                  }
                >
                  {t("DONE")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default OrgPaymentFailure;
