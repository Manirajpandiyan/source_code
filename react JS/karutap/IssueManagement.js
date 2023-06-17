import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { ThemeContext } from "themes/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import "./OrgAdmin.css";
import { actions as FeedbackActions } from "store/module/FeedbackModule";
import "../admin/IssueManagement.css";

import FormControl from "@mui/material/FormControl";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import InputBase from "@mui/material/InputBase";
import Navbar from "./Navbar";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { useHistory, useLocation } from "react-router-dom";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@mui/material/DialogActions";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { FaFilter } from "react-icons/fa";
import { BsFillEyeFill } from "react-icons/bs";
import { tableIcons } from "../utils";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import moment from "moment";
import { PATHS } from "routes";

const data = [
  {
    reported_by: "Matsumoto",
    content: "5",
    time: "5",
    category: "5",
    severity: "5",
    status: "5",
  },
  {
    reported_by: "Yamazaki",
    content: "2",
    time: "5",
    category: "5",
    severity: "5",
    status: "5",
  },
  {
    reported_by: "Suzuki",
    content: "3",
    time: "5",
    category: "5",
    severity: "5",
    status: "5",
  },
  {
    reported_by: "Suzuki",
    content: "3",
    time: "5",
    category: "5",
    severity: "5",
    status: "5",
  },
  {
    reported_by: "Suzuki",
    content: "3",
    time: "5",
    category: "5",
    severity: "5",
    status: "5",
  },
];
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
const IssueManagement = (props) => {
  const History = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  console.log({ value });
  const [value1, setValue] = React.useState(0);
  const [Reported, setReported] = React.useState("");
  const [feedback, setfeedback] = useState([]);
  const [feedbackId, setfeedbackId] = useState("");

  const [ReporteredFor, setReporteredFor] = React.useState("");
  const [Severity, setSeverity] = React.useState("");
  const FeedbackState = useSelector((state) => state.feedback);
  const location = useLocation();

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

  useEffect(() => {
    const Feedback_Payload = {
      END_POINT1: "org",
      END_POINT2: sessionStorage.getItem("Org_ID"),
      END_POINT3: "feedback",
      END_POINT4: "filter",
      Query: {
        list: "All_Feedback",
        feedbackType: 1,
        page: 1,
        size: 1000000000,
      },
    };
    dispatch(FeedbackActions.getFeedback(Feedback_Payload));
  }, []);

  useEffect(() => {
    if (!FeedbackState.fetching) {
      const feedback_list = FeedbackState.feedbacklist?.complaint?.map(
        ({
          reporteeName,
          cardId,
          karutaId,
          feedbackId,
          cardContext,
          createdDate,
          complaintCategory,
          severity,
          status,
        }) => {
          return {
            reportedby: reporteeName,
            content:
              cardContext === "image"
                ? t("Image")
                : cardContext === "audio"
                ? t("Audio")
                : cardContext === "text"
                ? t("Text")
                : t("Facilitator_Comments"),
            date: createdDate,
            category:
              complaintCategory == "Offensive content"
                ? t("Offensive_Content")
                : complaintCategory == "Discriminatory Content"
                ? t("Discriminatory_Content")
                : complaintCategory == "Defamation"
                ? t("Defamation")
                : complaintCategory == "Duplicate Content"
                ? t("Duplicate_Content")
                : t("Other"),
            severity: severity === "Low" ? t("Low") : t("High"),
            status: status === "PENDING" ? t("Pending") : t("Closed"),
            internal_action: (
              <Grid title="create" className="">
                <BsFillEyeFill
                  onClick={() =>
                    History.push({
                      pathname: PATHS.VIEWISSUE,
                      search: `?FeedBackId=${feedbackId}`,
                      state: {
                        feedbackId: feedbackId,
                        karutaId: karutaId,
                        cardId: cardId,
                      },
                    })
                  }
                  className="tableIcons"
                />
              </Grid>
            ),
          };
        }
      );
      setfeedback(feedback_list);
    }
  }, [FeedbackState, value]);

  const columns = [
    { title: t("REPORTED_BY"), field: "reportedby" },
    { title: t("CONTENT"), field: "content" },
    { title: t("TIME"), field: "date" },
    { title: t("CATEGORY"), field: "category" },
    { title: t("SEVERITY"), field: "severity" },
    { title: t("STATUS"), field: "status" },
    {
      title: t("ACTION"),
      field: "internal_action",
      editable: false,
    },
  ];
  const handlesubmit = () => {
    const Feedback_Payload = {
      END_POINT1: "org",
      END_POINT2: sessionStorage.getItem("Org_ID"),
      END_POINT3: "feedback",
      END_POINT4: "filter",
      Query: {
        list: "All_Feedback",
        feedbackType: 1,
        page: 1,
        category: ReporteredFor,
        severity: Severity,
        status: Reported,
        size: 100000,
      },
    };
    dispatch(FeedbackActions.getFeedback(Feedback_Payload));

    setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  return (
    <div className="orgadminTop">
      <Navbar />
      <Dialog open={open} onClose={handleClose} className="">
        <DialogContent className="FilterDialog">
          <DialogTitle>{t("FILTER")}</DialogTitle>
          <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-filled-label">
              {t("Status")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={Reported}
              onChange={(event) => {
                setReported(event.target.value);
              }}
              input={<BootstrapInput />}
            >
              <MenuItem value="">
                <em>{t("Select")}</em>
              </MenuItem>
              <MenuItem value={"PENDING"}>{t("Pending")}</MenuItem>
              <MenuItem value={"CLOSED"}>{t("Closed")}</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            variant="filled"
            sx={{ minWidth: 120, marginTop: 3 }}
          >
            <InputLabel id="demo-simple-select-filled-label">
              {t("Category")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={ReporteredFor}
              onChange={(event) => {
                setReporteredFor(event.target.value);
              }}
              input={<BootstrapInput />}
            >
              <MenuItem value="">
                <em>{t("Select")}</em>
              </MenuItem>
              <MenuItem value={1}>{t("Offensive_Content")}</MenuItem>
              <MenuItem value={2}>{t("Discriminatory_Content")}</MenuItem>
              <MenuItem value={3}>{t("Defamation")}</MenuItem>
              <MenuItem value={4}>{t("Duplicate_Content")}</MenuItem>
              <MenuItem value={5}>{t("Other")}</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            variant="filled"
            sx={{ minWidth: 120, marginTop: 3 }}
          >
            <InputLabel id="demo-simple-select-filled-label">
              {t("Severity")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={Severity}
              onChange={(event) => {
                setSeverity(event.target.value);
              }}
              input={<BootstrapInput />}
            >
              <MenuItem value="">
                <em>{t("Select")}</em>
              </MenuItem>
              <MenuItem value={"High"}>{t("High")}</MenuItem>
              <MenuItem value={"Medium"}>{t("Medium")}</MenuItem>
              <MenuItem value={"Low"}>{t("Low")}</MenuItem>
            </Select>
          </FormControl>
          <DialogActions>
            <Grid
              container
              justifyContent="flex-end"
              style={{ marginTop: "50px" }}
              xs={12}
            >
              <Button
                title="reset"
                onClick={() => {
                  setReported("");
                  setReporteredFor("");
                  setSeverity("");
                }}
                className="orgAdminFilterBtn"
                style={{ marginRight: "15px" }}
              >
                {t("RESET")}
              </Button>
              <Button
                onClick={handleClose}
                title="cancel"
                className="orgAdminFilterBtn"
                style={{ marginRight: "15px" }}
              >
                <text>{t("CANCEL")}</text>
              </Button>
              <Button
                title="confirm"
                onClick={() => handlesubmit()}
                className="orgAdminFilterBtn"
              >
                {t("CONFIRM")}
              </Button>
            </Grid>
          </DialogActions>
        </DialogContent>
      </Dialog>
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
                xs={9}
                sm={9}
                md={9}
                lg={9}
                xl={9}
                className="orgAdminHeadings"
              >
                <div>{t("Issue_Management")}</div>
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <Button className="orgAdminHeaderBtn" onClick={handleClickOpen}>
                  <FaFilter className="orgAdminHeaderIcons" />
                  <Grid className="orgAdminHeaderText">{t("FILTER")}</Grid>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box sx={{ width: "100%" }} className="TableBox">
              <TabPanel value={value1} index={0}>
                <Grid className="materialTableContainer">
                  <MaterialTable
                    className="materialTable"
                    style={{ backgroundColor: "transparent" }}
                    icons={tableIcons}
                    columns={columns}
                    data={feedback}
                    title={t("ISSUE_INFO")}
                    options={{
                      search: false,
                      paginationType: "stepped",
                      pageSizeOptions: [],
                      pageSize: 4,
                      headerStyle: { backgroundColor: "transparent" },
                    }}
                    localization={{
                      body: {
                        emptyDataSourceMessage: (
                          <div className="tableNoRecordDiv">
                            {t("No_records_to_display")}
                          </div>
                        ),
                      },
                      toolbar: {
                        searchPlaceholder: t("Search"),
                        searchTooltip: t("Search"),
                      },
                      pagination: {
                        firstTooltip: t("First_page"),
                        previousTooltip: t("Previous_page"),
                        nextTooltip: t("Next_page"),
                        lastTooltip: t("Last_page"),
                      },
                    }}
                  />
                </Grid>
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default IssueManagement;
