import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import "./OrgAdmin.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import "./AddNewParticipant.css";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from "./Navbar";
import { useHistory, useLocation } from "react-router-dom";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "@mui/material/Link";
import PropTypes from "prop-types";
import { tableIcons } from "../utils";
import Button from "@mui/material/Button";
import { PATHS } from "routes";
import { actions } from "store/module/GroupModule";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

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
const AddParticipants = (props) => {
  const History = useHistory();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [lang, setLang] = useState("en");

  const { value } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const location = useLocation();
  const [group_users_list, setgroup_users_list] = useState([]);
  const groupState = useSelector((state) => state.group);
  console.log({ value });
  const [value1, setValue] = React.useState(0);
  var orgId = sessionStorage.getItem("Org_ID");
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
  const notify = () =>
    toast.success(t("Successfully_Added_the_participants"), {
      duration: 4000,
      position: "top-center",
    });
  const columns = [
    { title: t("NAME"), field: "name" },
    { title: t("GRADE"), field: "grade" },
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
    <Link
      onClick={() => History.push(PATHS.GROUPMANAGEMENT)}
      fontSize="13px"
      underline="hover"
      key="1"
      color="inherit"
    >
      {t("ViewGroup")}
    </Link>,
    <Typography style={{ fontSize: "13px" }} key="2" color="text.primary">
      {t("Add_participants")}
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
        list: "NOT_INVITED",
        page: 1,
        size: 10000,
      },
    };

    await dispatch(actions.getgroupusersbyid(get_group_users_by_id_Payload));
  }, []);

  function Add(props) {
    const [add_button, setadd_button] = useState("ADD");
    return (
      <div>
        {add_button == "ADD" ? (
          <Button
            title="create"
            className="orgAdminAddParticipantBtn"
            onClick={() => {
              postusergroup(props.Id);
              setadd_button("ADDED");
            }}
          >
            {t("ADD")}
          </Button>
        ) : (
          <Button title="create" className="orgAdminAddParticipantBtn">
            {t("ADDED")}
          </Button>
        )}
      </div>
    );
  }
  const postusergroup = async (Id) => {
    console.log("payload", Id);

    const post_user_group_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "group",
      END_POINT4: location.state.groupId,
      END_POINT5: "user",
      END_POINT6: Id,
    };
    await dispatch(actions.postGroupuser(post_user_group_Payload));
  };
  useEffect(async () => {
    if (groupState.postgroupuserres?.data.statusCode == 201) {
      notify();
      await groupsuserslisting();
    }
  }, [groupState.postgroupuserres]);
  const groupsuserslisting = () => {
    //  API call
    const get_group_users_by_id_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "group",
      END_POINT4: location.state.groupId,
      END_POINT5: "users",
      Query: {
        list: "NOT_INVITED",
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
          ({
            gender,
            age,
            firstName,
            primaryEmailId,
            grade,
            groupId,
            userId,
          }) => {
            return {
              age: age,
              gender:
                gender == "M" ? t("Male") : gender == "F" ? t("Female") : "",
              name: firstName,
              email: primaryEmailId,
              grade: grade,
              internal_action: <Add Id={userId} />,
            };
          }
        );
      setgroup_users_list(group_users_list);
    }
  }, [groupState]);

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
                <div>{t("Group_Management")}</div>
                <div>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {breadcrumbs}
                  </Breadcrumbs>
                </div>
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
                    title={t("ADD_PARTICIPANT")}
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
          <Grid
            container
            justifyContent="flex-end"
            style={{ marginTop: "5px" }}
            xs={12}
          >
            <Button
              onClick={() => History.push(PATHS.GROUPMANAGEMENT)}
              className="orgAdminSaveBtn"
            >
              {t("DONE")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddParticipants;
