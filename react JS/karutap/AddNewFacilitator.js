import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import toast from "react-hot-toast";
import { styled } from "@mui/material/styles";
import moment from "moment";
import "./OrgAdmin.css";
import "./AddNewUser.css";
import { actions as PostFacilitatorActions } from "store/module/UserManagementModule";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from "./Navbar";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import DatePicker from "@mui/lab/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";
import Link from "@mui/material/Link";
import { PATHS } from "routes";
import Loader from "components/Loader";

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
const AddNewFacilitator = (props) => {
  const History = useHistory();
  const [primaryMobileNo, setprimaryMobileNo] = useState("");
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [apihitcount, setapihitcount] = React.useState(1);
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const [Email, setEmail] = useState("");
  const [moreInfo, setmoreInfo] = useState("");
  const [Grade, setGrade] = useState("");
  const [major, setMajor] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const { value } = useContext(ThemeContext);
  const [loading, setloading] = React.useState(false);
  const createUserstate = useSelector((state) => state.usermanagement);
  const [dateOfJoining, setdateOfJoining] = React.useState(new Date());

  const changeLanguageHandler = ({ target }) => {
    setLang(target.value1);
    i18n.changeLanguage(target.value1);
  };
  const [gender, setGender] = React.useState("");
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const [Country, setCountry] = React.useState("");

  const [prefecture, setPrefecture] = React.useState("");
  const handlePrefectureChange = (event) => {
    setPrefecture(event.target.value);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    const Prefecture_Payload = {
      END_POINT1: "country",
      END_POINT2: event.target.value,
      END_POINT3: "prefectures",
      Query: {
        countryId: event.target.value,
      },
    };
    dispatch(PostFacilitatorActions.getPrefecturelist(Prefecture_Payload));
  };

  useEffect(() => {
    if (apihitcount < 3) {
      const Country_Payload = {
        END_POINT1: "country",
      };
      dispatch(PostFacilitatorActions.getCountrylist(Country_Payload));
    }
    setapihitcount(5);
  });

  const createNewFacilitator = async () => {
    const newUser_Payload = {
      END_POINT1: "org",
      END_POINT2: sessionStorage.getItem("Org_ID"),
      END_POINT3: "user",
      Query: {
        countryId: Country,
        dateOfJoining:
          moment(dateOfJoining).format("YYYY-MM-DD") + "T16:32:26.970Z",
        firstName: firstName,
        gender: gender,
        grade: Grade,
        lastName: lastName,
        major: major,
        moreInfo: moreInfo == "" ? null : moreInfo,
        prefectureId: prefecture,
        primaryEmailId: Email,
        primaryMobileNo: primaryMobileNo,
        roleId: 2,
      },
    };
    if (firstName === "") {
      alert(t("Please_enter_a_valid_FirstName"));
    } else if (!firstName.replace(/\s/g, "").length) {
      alert(t("Please_enter_a_valid_FirstName"));
    } else if (lastName === "") {
      alert(t("Please_enter_a_valid_LastName"));
    } else if (!lastName.replace(/\s/g, "").length) {
      alert(t("Please_enter_a_valid_LastName"));
    } else if (Email === "") {
      alert(t("Please_enter_a_valid_Email"));
    } else if (!Email.replace(/\s/g, "").length) {
      alert(t("Please_enter_a_valid_Email"));
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(Email)) {
      alert(t("Please_enter_a_valid_Email"));
    } else if (Grade === "") {
      alert(t("Please_enter_Grade"));
    } else if (!Grade.replace(/\s/g, "").length) {
      alert(t("Please_enter_Grade"));
    } else if (gender == "") {
      alert(t("please select gender"));
    } else if (primaryMobileNo === "") {
      alert(t("Please_enter_a_valid_Mobile"));
    } else if (!primaryMobileNo.replace(/\s/g, "").length) {
      alert(t("Please_enter_a_valid_Mobile"));
    } else if (!/^[0-9]*$/.test(primaryMobileNo)) {
      alert(t("Please_enter_a_valid_Mobile"));
    } else if (Country === "") {
      alert(t("Please_enter_Country"));
    } else if (prefecture === "") {
      alert(t("Please_enter_a_Prefecture"));
    } else if (major === "") {
      alert(t("Please_enter_Major"));
    } else if (!major.replace(/\s/g, "").length) {
      alert(t("Please_enter_Major"));
    } else {
      setloading(true);
      await dispatch(PostFacilitatorActions.postUserToOrg(newUser_Payload));
    }
  };

  const notify = () =>
    toast.success(t("Successfully_Created_Facilitator"), {
      duration: 4000,
      position: "top-center",
    });

  const notifyError = () =>
    toast.error(createUserstate.postusertoorg?.data?.data, {
      duration: 4000,
      position: "top-center",
    });
  useEffect(() => {
    if (createUserstate.postusertoorg?.data?.statusCode == 201) {
      notify();
      dispatch(PostFacilitatorActions.resetState());
      History.push(PATHS.USERMANAGEMENT);
    } else if (createUserstate.postusertoorg?.data?.statusCode == 403) {
      setloading(false);
      notifyError();
    } else if (createUserstate.postusertoorg?.data?.statusCode == 10201) {
      setloading(false);
      notifyError();
    }
  }, [createUserstate.postusertoorg]);

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
      {t("Add_new_facilitator")}
    </Typography>,
  ];

  return (
    <div className="orgadminTop">
      <Navbar />
      <Grid className="orgAdminContainer">
        <Loader load={loading} />
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
                  label={t("FirstName")}
                  id="Firstname"
                  variant="filled"
                  value={firstName}
                  onChange={(event) => {
                    setfirstName(event.target.value);
                  }}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  label={t("LastName")}
                  id="Lastname"
                  variant="filled"
                  value={lastName}
                  onChange={(event) => {
                    setlastName(event.target.value);
                  }}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  label={t("Email")}
                  id="Email"
                  variant="filled"
                  value={Email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  label={t("Grade")}
                  id="Grade"
                  variant="filled"
                  value={Grade}
                  onChange={(event) => {
                    setGrade(event.target.value);
                  }}
                />
              </Grid>

              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableUnderline={true}
                    disableFuture
                    label={t("Date_Of_Joining")}
                    views={["year", "month", "day"]}
                    value={dateOfJoining}
                    onChange={(newValue) => {
                      setdateOfJoining(newValue);
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        disableUnderline
                        label={t("Date_Of_Joining")}
                        id="DateOfBirth"
                        variant="filled"
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid
                xs={11}
                sm={5}
                md={5}
                lg={5}
                xl={5}
                style={{ marginTop: "50px" }}
              >
                <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-filled-label">
                    {t("Gender")}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={gender}
                    onChange={handleGenderChange}
                    input={<BootstrapInput />}
                  >
                    <MenuItem value="">
                      <em>{t("Select")}</em>
                    </MenuItem>
                    <MenuItem value="M">{t("Male")}</MenuItem>
                    <MenuItem value="F">{t("Female")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  label={t("Mobile_No")}
                  id="Mobileno"
                  variant="filled"
                  value={primaryMobileNo}
                  onChange={(event) => {
                    setprimaryMobileNo(event.target.value);
                  }}
                />
              </Grid>
              <Grid
                xs={11}
                sm={5}
                md={5}
                lg={5}
                xl={5}
                style={{ marginTop: "50px" }}
              >
                <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-filled-label">
                    {t("Country")}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={Country}
                    onChange={handleCountryChange}
                    input={<BootstrapInput />}
                  >
                    {createUserstate.countrylist &&
                      createUserstate.countrylist?.data
                        ?.filter((e) => e.countryName != "GLOBAL")
                        .map(({ countryId, countryName }) => {
                          return (
                            <MenuItem value={countryId}>{countryName}</MenuItem>
                          );
                        })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                xs={11}
                sm={5}
                md={5}
                lg={5}
                xl={5}
                style={{ marginTop: "50px" }}
              >
                <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-filled-label">
                    {t("Prefecture")}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={prefecture}
                    onChange={handlePrefectureChange}
                    input={<BootstrapInput />}
                  >
                    {createUserstate.prefecturelist &&
                      createUserstate.prefecturelist?.data.map(
                        ({ prefectureId, prefectureName }) => {
                          return (
                            <MenuItem value={prefectureId}>
                              {prefectureName}
                            </MenuItem>
                          );
                        }
                      )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  label={t("Major")}
                  id="Major"
                  variant="filled"
                  value={major}
                  onChange={(event) => {
                    setMajor(event.target.value);
                  }}
                />
              </Grid>
              <Grid xs={11} sm={10.75} md={10.75} lg={10.75} xl={10.75}>
                <CustomTextField
                  label={t("More_Info")}
                  id="Moreinfo"
                  variant="filled"
                  value={moreInfo}
                  onChange={(event) => {
                    setmoreInfo(event.target.value);
                  }}
                />
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginTop: "50px" }}
                xs={11}
              >
                <Button
                  className="orgAdminCancelBtn"
                  style={{ marginRight: "15px" }}
                  onClick={() => History.push(PATHS.USERMANAGEMENT)}
                >
                  {t("CANCEL")}
                </Button>
                <Button
                  className="orgAdminSaveBtn"
                  onClick={() => createNewFacilitator()}
                >
                  {t("CONFIRM")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddNewFacilitator;
