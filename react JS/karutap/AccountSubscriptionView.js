import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import { styled } from "@mui/material/styles";
import "./OrgAdmin.css";
import "./AddNewUser.css";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from "./Navbar";
import { useHistory, useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import InputBase from "@mui/material/InputBase";
import Link from "@mui/material/Link";
import { PATHS } from "routes";
import moment from "moment";

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
    "&.Mui-focused": {
      disableUnderline: "true",
      color: "#595959",
      borderColor: "#f1f1f1",
      boxShadow: "inset 5px 5px 10px #bdc0c2, inset -5px -5px 10px #ffffff",
    },
  },
}));
const CustomTextArea = styled((props) => (
  <TextField
    multiline
    fullWidth
    style={{ marginTop: "50px", height: "150px" }}
    maxRows={4}
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
    minHeight: "100px",
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: "#f1f1f1",
    boxShadow: "5px 5px 10px #bdc0c2,-5px -5px 10px #ffffff",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&.Mui-focused": {
      backgroundColor: "#f1f1f1",
      disableUnderline: "true",
      color: "#595959",
      borderColor: "#f1f1f1",
      boxShadow: "inset 5px 5px 10px #bdc0c2, inset -5px -5px 10px #ffffff",
    },
  },
}));
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
const AccountSubscriptionView = (props) => {
  const History = useHistory();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  const location = useLocation();
  const changeLanguageHandler = ({ target }) => {
    setLang(target.value1);
    i18n.changeLanguage(target.value1);
  };
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
    <Typography style={{ fontSize: "13px" }} key="2" color="text.primary">
      {t("Account_Subscription_View")}
    </Typography>,
  ];

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
          <Box sx={{ width: "100%" }} className="inputContainerBox">
            <Grid
              container
              justifyContent="space-evenly"
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("view_subscription")}
                  id="Subscription"
                  variant="filled"
                  value={location.state.planName}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Type")}
                  id="Type"
                  variant="filled"
                  value={
                    location.state.planType === "TRIAL" ? t("Trial") : t("Paid")
                  }
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("No_of_Karuta")}
                  id="NoOfKarutas"
                  variant="filled"
                  value={location.state.maxNoOfKaruta}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Sub_view_Cost")}
                  id="Cost"
                  variant="filled"
                  value={location.state.cost.toLocaleString("ja-JP")}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Purchase_Date")}
                  id="PurchaseDate"
                  variant="filled"
                  value={moment(location.state.parchaseDate).format(
                    "YYYY-MM-DD"
                  )}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Valid_till")}
                  id="ValidTill"
                  variant="filled"
                  value={moment(location.state.expiryDate).format("YYYY-MM-DD")}
                />
              </Grid>
              <Grid xs={11} sm={10.75} md={10.75} lg={10.75} xl={10.75}>
                <CustomTextArea
                  disabled
                  label={t("More_Info")}
                  id="Moreinfo"
                  variant="filled"
                  value={location.state.notes}
                />
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginTop: "50px" }}
                xs={11}
              >
                <Button
                  className="orgAdminSaveBtn"
                  onClick={() =>
                    History.push(PATHS.ACCOUNTSUBSCRIPTIONMANAGEMENT)
                  }
                >
                  {t("BACK")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default AccountSubscriptionView;
