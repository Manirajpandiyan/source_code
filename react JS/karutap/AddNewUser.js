import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
import "./OrgAdmin.css";
import { useDispatch, useSelector } from "react-redux";
import "./AddNewUser.css";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from "./Navbar";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import { actions as PostUserActions } from "store/module/UserManagementModule";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { PATHS } from "routes";
import Loader from "components/Loader";

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
const AddNewUser = (props) => {
  const History = useHistory();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [moreInfo, setmoreInfo] = useState("");
  const [loading, setloading] = React.useState(false);
  const [Grade, setGrade] = useState("");
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  const createUserstate = useSelector((state) => state.usermanagement);

  console.log({ value });
  const [value1, setValue] = React.useState(0);
  const changeLanguageHandler = ({ target }) => {
    setLang(target.value1);
    i18n.changeLanguage(target.value1);
  };

  const createNewUser = async () => {
    const newUser_Payload = {
      END_POINT1: "org",
      END_POINT2: sessionStorage.getItem("Org_ID"),
      END_POINT3: "user",
      Query: {
        grade: Grade,
        moreInfo: moreInfo == "" ? null : moreInfo,
        primaryEmailId: Email,
        roleId: 3,
      },
    };
    if (Email === "") {
      alert(t("Please_enter_a_valid_Email"));
    } else if (!Email.replace(/\s/g, "").length) {
      alert(t("Please_enter_a_valid_Email"));
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(Email)) {
      alert(t("Please_enter_a_valid_Email"));
    } else if (Grade === "") {
      alert(t("Please_enter_Grade"));
    } else if (!Grade.replace(/\s/g, "").length) {
      alert(t("Please_enter_Grade"));
    } else {
      setloading(true);
      await dispatch(PostUserActions.postUserToOrg(newUser_Payload));
    }
  };

  const notify = () =>
    toast.success(t("Successfully_Created_User"), {
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
      dispatch(PostUserActions.resetState());
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
      {t("User")}
    </Link>,
    <Typography style={{ fontSize: "13px" }} key="2" color="text.primary">
      {t("Add_new_user")}
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
              <Grid xs={11} sm={10.75} md={10.75} lg={10.75} xl={10.75}>
                <CustomTextField
                  label={t("More_Info")}
                  id="MoreInfo"
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
                  onClick={() => createNewUser()}
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

export default AddNewUser;
