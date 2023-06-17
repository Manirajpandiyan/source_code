import React, { useState, useContext, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { PATHS } from "routes";
import { actions as UserManagementActions } from "store/module/UserManagementModule";
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
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& label.Mui-focused": {
    color: "black",
  },
  "& .MuiInputBase-input": {
    padding: "17px",
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
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
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
const UserManagementViewFaclitator = (props) => {
  const History = useHistory();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  const [dob, setDob] = React.useState(new Date());
  const [Firstname, setFirstname] = React.useState("");
  const [Lastname, setLastname] = React.useState("");
  const [dateOfJoining, setdateOfJoining] = React.useState("");
  const [Gender, setGender] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [Grade, setGrade] = React.useState("");
  const [Mobilenumber, setMobilenumber] = React.useState("");
  const [Country, setCountry] = React.useState("");
  const [Prefecture, setPrefecture] = React.useState("");
  const [Major, setMajor] = React.useState("");
  const UserManagementState = useSelector((state) => state.usermanagement);
  const location = useLocation();
  const dispatch = useDispatch();
  const changeLanguageHandler = ({ target }) => {
    setLang(target.value1);
    i18n.changeLanguage(target.value1);
  };
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  const handlePrefectureChange = (event) => {
    setPrefecture(event.target.value);
  };
  const breadcrumbs = [
    <Link
      onClick={() => History.push(PATHS.USERMANAGEMENT)}
      fontSize="13px"
      underline="hover"
      key="1"
      color="inherit"
    >
      {t("Facilitator")}
    </Link>,
    <Typography style={{ fontSize: "13px" }} key="2" color="text.primary">
      {t("View_Facilitator")}
    </Typography>,
  ];

  useEffect(() => {
    const UserManagementViewFacilitator_Payload = {
      END_POINT1: "org",
      END_POINT2: sessionStorage.getItem("Org_ID"),
      END_POINT3: "user",
      END_POINT4: location.state.userId,
    };

    dispatch(
      UserManagementActions.getOrgUserById(
        UserManagementViewFacilitator_Payload
      )
    );
  }, []);

  useEffect(() => {
    if (UserManagementState?.getorguserbyid) {
      setFirstname(UserManagementState.getorguserbyid?.firstName);
      setLastname(UserManagementState.getorguserbyid?.lastName);
      setdateOfJoining(UserManagementState.getorguserbyid?.dateOfJoining);
      setGender(UserManagementState.getorguserbyid?.gender);
      setEmail(UserManagementState.getorguserbyid?.primaryEmailId);
      setGrade(UserManagementState.getorguserbyid?.grade);
      setMobilenumber(UserManagementState.getorguserbyid?.primaryMobileNo);
      setCountry(UserManagementState.getorguserbyid?.countryName);
      setPrefecture(UserManagementState.getorguserbyid?.prefectureName);
      setMajor(UserManagementState.getorguserbyid?.major);
    }
    console.log(
      "UserManagementsingleuserdataaa*******----------",
      UserManagementState?.getorguserbyid
    );
  }, [UserManagementState?.getorguserbyid]);

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
                <div>{t("User_Management")}</div>
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
                  label={t("FirstName")}
                  id="Firstname"
                  variant="filled"
                  value={Firstname}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("LastName")}
                  id="Lastname"
                  variant="filled"
                  value={Lastname}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Date_Of_Birth")}
                  id="Dateofbirth"
                  variant="filled"
                  value={moment(dateOfJoining).format("YYYY/MM/DD")}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Gender")}
                  id="Gender"
                  variant="filled"
                  value={
                    Gender === "M"
                      ? t("Male")
                      : Gender === "F"
                      ? t("Female")
                      : ""
                  }
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Email")}
                  id="Email"
                  variant="filled"
                  value={Email}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Grade")}
                  id="Grade"
                  variant="filled"
                  value={Grade}
                />
              </Grid>

              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Mobile_No")}
                  id="Mobileno"
                  variant="filled"
                  value={Mobilenumber}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Country")}
                  id="FacilitatorViewCountry"
                  variant="filled"
                  value={Country}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Prefecture")}
                  id="FacilitatorViewPrefecture"
                  variant="filled"
                  value={Prefecture}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  disabled
                  label={t("Major")}
                  id="FacilitatorViewMajor"
                  variant="filled"
                  value={Major}
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
                  onClick={() => History.push(PATHS.USERMANAGEMENT)}
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

export default UserManagementViewFaclitator;
