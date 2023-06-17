import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import Link from "@mui/material/Link";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import "./OrgAdmin.css";
import DialogContent from "@material-ui/core/DialogContent";
import { Grid } from "@mui/material";
import toast from "react-hot-toast";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from "./Navbar";
import { useHistory, useLocation } from "react-router-dom";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BsFillEyeFill } from "react-icons/bs";
import { tableIcons } from "../utils";
import Button from "@mui/material/Button";
import { actions } from "store/module/GroupModule";
import { useDispatch, useSelector } from "react-redux";
import { PATHS } from "routes";

const data = [
  {
    participants: "Matsumoto",
    gender: "M",
    age: "17",
    email: "matsumoto@gmail.com",
  },
  {
    participants: "Yamazaki",
    gender: "F",
    age: "15",
    email: "yamazaki@gmail.com",
  },
  { participants: "Suzuki", gender: "F", age: "10", email: "suzuki@gmail.com" },
];

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
const ViewGroup = (props) => {
  const History = useHistory();
  const [openDelete, setOpenDelete] = React.useState(false);
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [lang, setLang] = useState("en");
  const { value } = useContext(ThemeContext);
  var orgId = sessionStorage.getItem("Org_ID");
  console.log({ value });
  const dispatch = useDispatch();
  const location = useLocation();
  const [group_users_list, setgroup_users_list] = useState([]);
  const [groupuserDelete, setGroupuserDelete] = React.useState("");
  const [Username, setUsername] = React.useState("");
  const [groupuseriddelete, setGroupuseriddelete] = React.useState("");
  const [value1, setValue] = React.useState(0);
  const groupState = useSelector((state) => state.group);
  const changeLanguageHandler = ({ target }) => {
    setLang(target.value1);
    i18n.changeLanguage(target.value1);
  };

  const handleClickDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const deletenotify = () =>
    toast.success(t("Successfully_deleted_group"), {
      duration: 4000,
      position: "top-center",
    });
  const deleteusernotify = () =>
    toast.success(t("Successfully_Deleted_User"), {
      duration: 4000,
      position: "top-center",
    });
  const onremovegroupuserclick = (userId, firstName) => {
    setGroupuseriddelete(userId);
    setUsername(firstName);
    handleClickDeleteOpen();
  };
  const deletegroupuser = () => {
    const delete_group_user_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "group",
      END_POINT4: location.state.groupId,
      END_POINT5: "user",
      END_POINT6: groupuseriddelete,
    };
    dispatch(actions.deleteGroupusers(delete_group_user_Payload));
  };
  useEffect(async () => {
    if (groupState.deletegroupusersuccess?.data.statusCode == 200) {
      deleteusernotify();
      handleDeleteClose();
      await groupsuserslisting();
    }
  }, [groupState.deletegroupusersuccess]);
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };
  const handleChange = () => {
    setValue(value1 === 0 ? 1 : 0);
  };
  const columns = [
    { title: t("PARTICIPANTS"), field: "participants" },
    { title: t("GENDER"), field: "gender" },
    { title: t("AGE"), field: "age" },
    { title: t("EMAIL"), field: "email" },
    {
      title: t("ACTION"),
      field: "internal_action",
      editable: false,
    },
  ];
  const breadcrumbs = [
    <Link
      onClick={() => History.push(PATHS.GROUPMANAGEMENT)}
      fontSize="13px"
      underline="hover"
      key="1"
      color="inherit"
    >
      {t("Group_info")}
    </Link>,
    <Typography style={{ fontSize: "13px" }} key="2" color="text.primary">
      {t("ViewGroup")}
    </Typography>,
  ];
  useEffect(async () => {
    //  API call
    const get_group_users_by_id_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "group",
      END_POINT4: location.state.groupId,
      END_POINT5: "users",
      Query: {
        list: "INVITED",
        page: 1,
        size: 10000,
      },
    };

    await dispatch(actions.getgroupusersbyid(get_group_users_by_id_Payload));
  }, []);
  const groupsuserslisting = () => {
    //  API call
    const get_group_users_by_id_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "group",
      END_POINT4: location.state.groupId,
      END_POINT5: "users",
      Query: {
        list: "INVITED",
        page: 1,
        size: 10000,
      },
    };

    dispatch(actions.getgroupusersbyid(get_group_users_by_id_Payload));
  };
  useEffect(() => {
    console.log(
      "thegroupuser----",
      groupState.getgroupusersbyidsuccess?.userProfile
    );
    if (!groupState.fetching) {
      const group_users_list =
        groupState.getgroupusersbyidsuccess?.userProfile?.map(
          ({ gender, age, firstName, primaryEmailId, groupId, userId }) => {
            return {
              age: age,
              gender:
                gender == "M" ? t("Male") : gender == "F" ? t("Female") : "",
              participants: firstName,
              email: primaryEmailId,
              internal_action: (
                <Grid title="create" className="">
                  <MdDelete
                    className="adminTableDeleteIcon"
                    onClick={() => onremovegroupuserclick(userId, firstName)}
                  />
                </Grid>
              ),
            };
          }
        );
      setgroup_users_list(group_users_list);
    }
  }, [groupState]);
  return (
    <div className="orgadminTop">
      <Navbar />
      <Dialog open={openDelete} onClose={handleDeleteClose} className="">
        <DialogContent className="CreateGroupDialog">
          <Grid>
            {" "}
            {Username} {t("You_want_to_delete_the")}{" "}
          </Grid>
          <DialogActions>
            <Grid
              container
              justifyContent="flex-end"
              style={{ marginTop: "40px" }}
              xs={11}
            >
              <Button
                onClick={handleDeleteClose}
                title="cancel"
                className="orgAdminDeleteGrouprBtn"
                style={{ marginRight: "10px" }}
              >
                <text>{t("CANCEL")}</text>
              </Button>
              <Button
                title="Delete"
                className="orgAdminDeleteGrouprBtn"
                onClick={() => deletegroupuser()}
              >
                {t("DELETE")}
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
                <div>{t("Group_Management")}</div>
                <div>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {breadcrumbs}
                  </Breadcrumbs>
                </div>
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <Button
                  className="orgAdminHeaderBtn"
                  onClick={() =>
                    History.push({
                      pathname: PATHS.ADDPARTICIPANTS,
                      search: `?ADDPARTICIPANTS=${location.state.groupId}`,
                      state: { groupId: location.state.groupId },
                    })
                  }
                >
                  <BsFillPlusCircleFill className="orgAdminHeaderIcons" />
                  <Grid className="orgAdminHeaderText">
                    {t("ADD_PARTICIPANT")}
                  </Grid>
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
                    data={group_users_list}
                    title={t("VIEW_GROUP")}
                    options={{
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

export default ViewGroup;
