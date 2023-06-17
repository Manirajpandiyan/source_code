import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import { styled } from "@mui/material/styles";
import StaticContent from "components/StaticContent";
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
import { useDispatch, useSelector } from "react-redux";
import { actions as FeedbackActions } from "store/module/FeedbackModule";
import { PATHS } from "routes";
import toast from "react-hot-toast";
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
    color: "#f1f1f1",
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
      backgroundColor: "#f1f1f1",
      disableUnderline: "true",
      color: "black",
      borderColor: "#f1f1f1",
      boxShadow: "inset 5px 5px 10px #bdc0c2, inset -5px -5px 10px #ffffff",
    },
  },
}));
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& label.Mui-focused": {
    color: "#f1f1f1",
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
const ViewIssue = (props) => {
  const History = useHistory();
  const theme = useTheme();
  const [ReportedBy, setReportedBy] = React.useState("");
  const [Content, setContent] = React.useState("");
  const [Category, setCategory] = React.useState("");
  const [Severity, setSeverity] = React.useState("");
  const [action_taken_reason, setaction_taken_reason] = React.useState("");
  const [Attachment, setAttachment] = React.useState("");
  const [Description, setDescription] = React.useState("");
  const [Status, setStatus] = React.useState("");
  const [count, setcount] = React.useState(0);
  const [Comments, setComments] = React.useState("");
  const [cardId, setcardId] = React.useState("");
  const [loading, setloading] = React.useState(false);
  const [isMounted, setisMounted] = useState(false);
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  const [dob, setDob] = React.useState(new Date());
  const FeedbackState = useSelector((state) => state.feedback);
  const location = useLocation();

  const dispatch = useDispatch();
  const changeLanguageHandler = ({ target }) => {
    setLang(target.value1);
    i18n.changeLanguage(target.value1);
  };
  const [gender, setGender] = React.useState("");
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const [country, setCountry] = React.useState("");
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  const [prefecture, setPrefecture] = React.useState("");
  const handlePrefectureChange = (event) => {
    setPrefecture(event.target.value);
  };
  const [Action, setAction] = React.useState("");
  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  useEffect(() => {
    const Feedback_Payload = {
      END_POINT1: "org",
      END_POINT2: sessionStorage.getItem("Org_ID"),
      END_POINT3: "feedback",
      END_POINT4: location.state.feedbackId,
      Query: {
        list: "All_Feedback",
        feedbackType: 1,
        page: 1,
        size: 10,
      },
    };

    dispatch(FeedbackActions.getFeedbackById(Feedback_Payload));
  }, []);

  useEffect(() => {
    if (count < 3) {
      if (FeedbackState.getfeedbackbyid) {
        setReportedBy(FeedbackState.getfeedbackbyid?.reporteeName);
        setContent(FeedbackState.getfeedbackbyid?.cardContext);
        setCategory(FeedbackState.getfeedbackbyid?.complaintCategory);
        setSeverity(FeedbackState.getfeedbackbyid?.severity);
        setAttachment(FeedbackState.getfeedbackbyid?.complaintProof);
        setDescription(FeedbackState.getfeedbackbyid?.description);
        setComments(FeedbackState.getfeedbackbyid?.actionTakenDetails);
        setcardId(FeedbackState.getfeedbackbyid?.cardId);
        setStatus(FeedbackState.getfeedbackbyid?.status);
        if (FeedbackState.getfeedbackbyid?.action == "4") {
          setAction("4");
        } else if (FeedbackState.getfeedbackbyid?.action == "3") {
          setAction("3");
        } else if (FeedbackState.getfeedbackbyid?.action == "2") {
          setAction("2");
        } else if (FeedbackState.getfeedbackbyid?.action == "1") {
          setAction("1");
        }
        setcount(4);
      }
    } else {
      setcount(count + 1);
    }
  }, [FeedbackState.getfeedbackbyid]);

  const updateIssue = () => {
    const UpdateIssue_Payload = {
      END_POINT1: "org",
      END_POINT2: sessionStorage.getItem("Org_ID"),
      END_POINT3: "feedback",
      END_POINT4: location.state.feedbackId,
      Query: {
        karutaId: location.state.karutaId,
        cardId: location.state.cardId,
        action: Action,
        action_taken_reason: Comments,
      },
    };
    if (Action == "") {
      alert(t("Please_select_action"));
    } else if (Comments == null) {
      alert(t("Please_enter_a_valid_review"));
    } else if (!Comments.replace(/\s/g, "").length) {
      alert(t("Please_enter_a_valid_review"));
    } else {
      dispatch(FeedbackActions.updateIssue(UpdateIssue_Payload));
    }
  };

  const notify = () =>
    toast.success(t("Successfully_updated_Issue"), {
      duration: 4000,
      position: "top-center",
    });
  const notifyError = () =>
    toast.error(t(FeedbackState.updateissuesuccess?.data.data), {
      duration: 4000,
      position: "top-center",
    });

  useEffect(() => {
    console.log("FeedbackState", FeedbackState);
    if (FeedbackState.updateissuesuccess?.statusCode == 200) {
      notify();
      dispatch(FeedbackActions.resetState());
      History.push(PATHS.ISSUEMANAGEMENT);
    } else if (FeedbackState.updateissuesuccess?.statusCode == 403) {
      setloading(false);
      notifyError();
    } else if (FeedbackState.updateissuesuccess?.statusCode == 10201) {
      setloading(false);
      notifyError();
    }
  });

  const breadcrumbs = [
    <Link
      onClick={() => History.push(PATHS.ISSUEMANAGEMENT)}
      fontSize="13px"
      underline="hover"
      key="1"
      color="inherit"
    >
      {t("Issue_Info")}
    </Link>,
    <Typography style={{ fontSize: "13px" }} key="2" color="text.primary">
      {t("Details_of_Issue")}
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
                <div>{t("Issue_Management")}</div>
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
                  label={t("Reported_bY")}
                  id="Reportby"
                  variant="filled"
                  disabled
                  value={ReportedBy}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  label={t("Content")}
                  id="Content"
                  variant="filled"
                  disabled
                  value={
                    Content === "image"
                      ? t("Image")
                      : Content === "audio"
                      ? t("audio")
                      : Content === "text"
                      ? t("Text")
                      : t("Facilitator_Comments")
                  }
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  label={t("Category")}
                  id="Category"
                  variant="filled"
                  disabled
                  value={
                    Category == "Offensive content"
                      ? t("Offensive_Content")
                      : Category == "Discriminatory Content"
                      ? t("Discriminatory_Content")
                      : Category == "Defamation"
                      ? t("Defamation")
                      : Category == "Duplicate Content"
                      ? t("Duplicate_Content")
                      : t("Other")
                  }
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  label={t("Severity")}
                  id="Severity"
                  variant="filled"
                  disabled
                  value={Severity === "Low" ? t("Low") : t("High")}
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  label={t("Attachment")}
                  id="Attachment"
                  variant="filled"
                  type="url"
                  disabled
                  value={
                    Attachment == null
                      ? t("No_attachment")
                      : StaticContent.Card_Url + Attachment
                  }
                />
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}>
                <CustomTextField
                  label={t("Description")}
                  id="Description"
                  variant="filled"
                  disabled
                  value={Description}
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
                    {t("Action")}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={Action}
                    disabled={Status === "CLOSED" ? true : false}
                    onChange={handleActionChange}
                    input={<BootstrapInput />}
                  >
                    <MenuItem value={1}>{t("Block_User")}</MenuItem>
                    <MenuItem value={2}>{t("Delete_Card")}</MenuItem>
                    <MenuItem value={3}>{t("Delete_Karuta")}</MenuItem>
                    <MenuItem value={4}>{t("No_Action_Needed")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={11} sm={5} md={5} lg={5} xl={5}></Grid>
              <Grid xs={11} sm={10.75} md={10.75} lg={10.75} xl={10.75}>
                <CustomTextField
                  disabled={Status === "CLOSED" ? true : false}
                  label={t("CommentsReviews")}
                  id="Commentsreview"
                  variant="filled"
                  value={Comments}
                  onChange={(event) => {
                    setComments(event.target.value);
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
                  onClick={() => History.push(PATHS.ISSUEMANAGEMENT)}
                >
                  {t("CANCEL")}
                </Button>
                {Status === "CLOSED" ? null : (
                  <Button
                    className="orgAdminSaveBtn"
                    onClick={() => {
                      updateIssue();
                    }}
                  >
                    {t("CONFIRM")}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewIssue;
