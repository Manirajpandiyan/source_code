import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import "./OrgAdmin.css";
import "./GroupManagement.css";
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
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import { PATHS } from "routes";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { actions } from "store/module/GroupModule";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import moment from "moment";
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
  const [description, setdescription] = useState("");
  const [groupName, setgroupName] = useState("");
  const [getdescription, setgetdescription] = useState("");
  const [getgroupName, setgetgroupName] = useState("");
  const [groupDelete, setGroupDelete] = React.useState("");
  const [Groupedit, setGroupedit] = React.useState("");
  const [Groupeditname, setGroupeditname] = React.useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const [lang, setLang] = useState("en");
  var orgId = sessionStorage.getItem("Org_ID");
  const { value } = useContext(ThemeContext);
  const [isMounted, setisMounted] = useState(false);
  const groupState = useSelector((state) => state.group);
  const [loading, setloading] = React.useState(false);

  const [group_list, setgrouplist] = useState([]);

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
    groupslisting();
    setOpenEdit(false);
  };
  const handleClickDeleteOpen = () => {
    setOpenDelete(true);
  };
  const notify = () =>
    toast.success(t("Successfully_Created_Group"), {
      duration: 4000,
      position: "top-center",
    });
  const updatenotify = () =>
    toast.success(t("Successfully_Edited_the_Group"), {
      duration: 4000,
      position: "top-center",
    });
  const deletenotify = () =>
    toast.success(t("Successfully_deleted_Group"), {
      duration: 4000,
      position: "top-center",
    });
  const notifyError = () =>
    toast.error(t(groupState.postgroupsuccess?.data?.data), {
      duration: 4000,
      position: "top-center",
    });
  const updatenotifyError = () =>
    toast.error(t(groupState.updategroupsuccess?.data?.data), {
      duration: 4000,
      position: "top-center",
    });

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
    },
  ];
  useEffect(async () => {
    //  API call
    const get_group_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "groups",

      Query: {
        page: 1,
        size: 10000,
      },
    };

    await dispatch(actions.fetchGroupList(get_group_Payload));
  }, []);

  const postgroup = async () => {
    const post_group_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "group",
      Query: {
        description: description.trim(),
        groupName: groupName.trim(),
      },
    };
    if (groupName === "") {
      alert(t("Please_enter_a_valid_GroupName"));
    } else if (!groupName.replace(/\s/g, "").length) {
      alert(t("Please_enter_a_valid_GroupName"));
    } else if (description === "") {
      alert(t("Please_enter_a_valid_description"));
    } else if (!description.replace(/\s/g, "").length) {
      alert(t("Please_enter_a_valid_description"));
    } else {
      await dispatch(actions.postGroup(post_group_Payload));
    }
  };
  useEffect(() => {
    if (groupState.postgroupsuccess?.data.statusCode == 200) {
      notify();
      History.push({
        pathname: PATHS.ADDNEWPARTICIPANT,
        search: `?ADDNEWPARTICIPANT=${groupState.postgroupsuccess?.data.data.groupName}`,
        state: { groupId: groupState.postgroupsuccess?.data.data.groupId },
      });
    } else if (groupState.postgroupsuccess?.data.statusCode == 403) {
      setloading(false);
      notifyError();
    } else if (groupState.postgroupsuccess?.data.statusCode == 10201) {
      setloading(false);
      notifyError();
    }
  }, [groupState.postgroupsuccess]);
  const onremovegroupclick = (groupId, groupName) => {
    setGroupDelete(groupId);
    setgetgroupName(groupName);
    handleClickDeleteOpen();
  };
  const oneditgroupclick = (groupId, groupName) => {
    setGroupedit(groupId);
    setGroupeditname(groupName);
    handleClickeditOpen();
    const get_group_by_id_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "group",
      END_POINT4: groupId,
    };

    dispatch(actions.getGroupbyid(get_group_by_id_Payload));
  };
  useEffect(() => {
    if (!groupState.fetching) {
      const group_list = groupState.grouplist?.group?.map(
        ({ createdDate, participants, groupName, groupId }) => {
          return {
            name: groupName,
            created_date: moment(createdDate).format("YYYY/MM/DD"),
            participants: participants,
            internal_action: (
              <Grid className="">
                <BsFillEyeFill
                  title="view"
                  className="orgAdminTableIcons"
                  onClick={() =>
                    History.push({
                      pathname: PATHS.VIEWGROUP,
                      search: `?VIEWGROUP=${groupId}`,
                      state: { groupId: groupId },
                    })
                  }
                />
                <MdEdit
                  title="edit"
                  className="orgAdminTableIcons"
                  onClick={() => oneditgroupclick(groupId)}
                />
                <MdDelete
                  title="delete"
                  className="adminTableDeleteIcon"
                  onClick={() => onremovegroupclick(groupId, groupName)}
                />
              </Grid>
            ),
          };
        }
      );
      setgrouplist(group_list);
    }
  }, [groupState]);
  const deletegroup = () => {
    const delete_group_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "group",
      END_POINT4: groupDelete,
    };
    dispatch(actions.deleteGroup(delete_group_Payload));
  };
  const updategroup = () => {
    const update_group_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "group",
      END_POINT4: Groupedit,
      Query: {
        description: getdescription,
        groupName: getgroupName,
      },
    };
    dispatch(actions.updateGroup(update_group_Payload));
  };
  useEffect(async () => {
    if (groupState.updategroupsuccess?.data.statusCode == 200) {
      updatenotify();
      handleEditClose();
      await groupslisting();
    } else if (groupState.updategroupsuccess?.data.statusCode == 403) {
      updatenotifyError();
    } else if (groupState.updategroupsuccess?.data.statusCode == 10201) {
      updatenotifyError();
    }
  }, [groupState.updategroupsuccess]);
  const groupslisting = () => {
    //  API call
    const get_group_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "groups",

      Query: {
        page: 1,
        size: 10000,
      },
    };

    dispatch(actions.fetchGroupList(get_group_Payload));
  };
  useEffect(async () => {
    if (groupState.deletegroupsuccess?.data.statusCode == 200) {
      deletenotify();
      handleDeleteClose();
      await groupslisting();
    }
  }, [groupState.deletegroupsuccess]);
  useEffect(() => {
    if (groupState.getgroupbyidsuccess) {
      setgetgroupName(groupState.getgroupbyidsuccess.groupName);
      setgetdescription(groupState.getgroupbyidsuccess.description);
    }
  }, [groupState.getgroupbyidsuccess]);

  return (
    <div className="orgadminTop">
      <Navbar />
      {/* *************************create group********************************* */}
      <Dialog open={open} onClose={handleClose} className="">
        <DialogContent className="CreateGroupDialog">
          <DialogTitle>{t("CREATE_GROUP")}</DialogTitle>
          <CustomTextField
            label={t("Enter_Name_(Grade)_(Section)_(Year)")}
            id="Groupname"
            value={groupName}
            onChange={(event) => {
              setgroupName(event.target.value);
            }}
            variant="filled"
          />
          <CustomTextField
            label={t("Description")}
            id="Description"
            value={description}
            onChange={(event) => {
              setdescription(event.target.value);
            }}
            variant="filled"
          />
          <DialogActions>
            <Grid
              container
              justifyContent="flex-end"
              style={{ marginTop: "40px" }}
              xs={11}
            >
              <Button
                onClick={handleClose}
                title="cancel"
                className="orgAdminCreateGrouprBtn"
                style={{ marginRight: "10px" }}
              >
                <text>{t("CANCEL")}</text>
              </Button>
              <Button
                title="create"
                className="orgAdminCreateGrouprBtn"
                onClick={() => postgroup()}
              >
                {t("CREATE")}
              </Button>
            </Grid>
          </DialogActions>
        </DialogContent>
      </Dialog>
      {/* *************************create group********************************* */}
      <Dialog open={openEdit} onClose={handleEditClose} className="">
        <DialogContent className="CreateGroupDialog">
          <DialogTitle>{t("EDIT_GROUP")}</DialogTitle>
          <CustomTextField
            label={t("Group_Name")}
            id="editGroupname"
            variant="filled"
            value={getgroupName}
            onChange={(event) => {
              setgetgroupName(event.target.value);
            }}
          />
          <CustomTextField
            label={t("Description")}
            id="editDescription"
            variant="filled"
            value={getdescription}
            onChange={(event) => {
              setgetdescription(event.target.value);
            }}
          />
          <DialogActions>
            <Grid
              container
              justifyContent="flex-end"
              style={{ marginTop: "40px" }}
              xs={11}
            >
              <Button
                onClick={handleEditClose}
                title="cancel"
                className="orgAdminCreateGrouprBtn"
                style={{ marginRight: "10px" }}
              >
                <text>{t("CANCEL")}</text>
              </Button>
              <Button
                title="create"
                className="orgAdminCreateGrouprBtn"
                onClick={() => updategroup()}
              >
                {t("SAVE")}
              </Button>
            </Grid>
          </DialogActions>
        </DialogContent>
      </Dialog>
      {/* *************************delete group********************************* */}
      <Dialog open={openDelete} onClose={handleDeleteClose} className="">
        <DialogContent className="CreateGroupDialog">
          <Grid>
            {" "}
            {getgroupName} {t("You_want_to_delete_the")}
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
                title="create"
                className="orgAdminDeleteGrouprBtn"
                onClick={() => deletegroup()}
              >
                {t("DELETE")}
              </Button>
            </Grid>
          </DialogActions>
        </DialogContent>
      </Dialog>
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
                xs={9}
                sm={9}
                md={9}
                lg={9}
                xl={9}
                className="orgAdminHeadings"
              >
                <div>{t("Group_Management")}</div>
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <Button className="orgAdminHeaderBtn" onClick={handleClickOpen}>
                  <BsFillPlusCircleFill className="orgAdminHeaderIcons" />
                  <Grid className="orgAdminHeaderText">
                    {t("CREATE_GROUP")}
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
                    data={group_list}
                    title={t("GROUP_INFO")}
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

export default GroupManagement;
