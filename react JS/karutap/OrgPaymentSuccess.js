import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import "./OrgAdmin.css";
import "./OrgPaymentSuccess.css";
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
const GroupManagement = (props) => {
  const History = useHistory();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  console.log({ value });
  const [value1, setValue] = React.useState(0);
  const changeLanguageHandler = ({ target }) => {
    setLang(target.value1);
    i18n.changeLanguage(target.value1);
  };
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };
  const handleChange = () => {
    setValue(value1 === 0 ? 1 : 0);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickeditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };
  const handleClickDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const columns = [
    { title: t("NAME"), field: "name" },
    { title: t("CREATED_DATE"), field: "created_date" },
    { title: t("PARTICIPANTS"), field: "participants" },
    {
      title: t("ACTION"),
      field: "internal_action",
      editable: false,
      render: (rowData) =>
        rowData && (
          <Grid title="create" className="">
            <MdEdit
              className="orgAdminTableIcons"
              onClick={handleClickeditOpen}
            />
            <BsFillEyeFill
              className="orgAdminTableIcons"
              onClick={() => History.push(PATHS.VIEWGROUP)}
            />
            <MdDelete
              className="adminTableDeleteIcon"
              onClick={handleClickDeleteOpen}
            />
          </Grid>
        ),
    },
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
              </Grid>
            </Grid>
          </Grid>
          <Grid className="OrgPaymentSuccessForm">
            <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
              <Grid className="termsandConditions">
                {t("Successfully_completed_the_payment")}
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

export default GroupManagement;
