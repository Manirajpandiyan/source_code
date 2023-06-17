import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "themes/ThemeProvider";
import "./OrgAdmin.css";
import { Grid } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navbar from "./Navbar";
import { useHistory } from "react-router-dom";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BsFillEyeFill } from "react-icons/bs";
import { tableIcons } from "../utils";
import Button from "@mui/material/Button";
import { PATHS } from "routes";
import toast from "react-hot-toast";
import { actions } from "store/module/AccountSubscriptionModule";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

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
const AccountSubscriptionManagement = (props) => {
  const History = useHistory();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [accountSubsList, setAccountSubsList] = useState([]);
  const accountSubscriptionState = useSelector(
    (state) => state.accountsubscription
  );
  const [lang, setLang] = useState("en");
  var orgId = sessionStorage.getItem("Org_ID");
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
  useEffect(async () => {
    const AccountSubs_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "subscription",
      Query: {
        page: 1,
        size: 100000,
      },
    };
    await dispatch(actions.getAccountSubscription(AccountSubs_Payload));
  }, []);
  // today date
  const today = new Date();
  const currentDate = moment();
  const futureDate = currentDate.add(10, "days");
  useEffect(() => {
    if (accountSubscriptionState.accountsubscriptionlist) {
      const accountsubs_list =
        accountSubscriptionState.accountsubscriptionlist &&
        accountSubscriptionState.accountsubscriptionlist?.subscription?.map(
          ({
            planName,
            category,
            planType,
            maxNoOfKaruta,
            duration,
            cost,
            parchaseDate,
            expiryDate,
            notes,
            subPlanId,
            activationDate,
          }) => {
            return {
              subscription: planName,
              cost: cost.toLocaleString("ja-JP"),
              activation_date: moment(activationDate).format("YYYY-MM-DD"),
              purchase_date: moment(parchaseDate).format("YYYY-MM-DD"),
              valid_till: moment(moment(today).format("YYYY-MM-DD")).isAfter(
                moment(expiryDate).format("YYYY-MM-DD")
              ) ? (
                <div style={{ color: "#ed2b2b", fontWeight: "bold" }}>
                  {moment(expiryDate).format("YYYY-MM-DD")}
                </div>
              ) : moment(moment(futureDate).format("YYYY-MM-DD")).isBefore(
                  moment(expiryDate).format("YYYY-MM-DD")
                ) ? (
                <div style={{ color: "rgb(93 253 5)", fontWeight: "bold" }}>
                  {moment(expiryDate).format("YYYY-MM-DD")}
                </div>
              ) : (
                <div style={{ color: "#e8bd3a", fontWeight: "bold" }}>
                  {moment(expiryDate).format("YYYY-MM-DD")}
                </div>
              ),
              internal_action: (
                <BsFillEyeFill
                  title="View"
                  className="orgAdminTableIcons"
                  onClick={() =>
                    History.push({
                      pathname: PATHS.ACCOUNTSUBSCRIPTIONVIEW,
                      search: `?viewplan=${planName}`,
                      state: {
                        subPlanId: subPlanId,
                        planName: planName,
                        category: category,
                        planType: planType,
                        maxNoOfKaruta: maxNoOfKaruta,
                        duration: duration,
                        cost: cost,
                        parchaseDate: parchaseDate,
                        expiryDate: expiryDate,
                        notes: notes,
                      },
                    })
                  }
                />
              ),
            };
          }
        );
      setAccountSubsList(accountsubs_list);
    }
  }, [accountSubscriptionState]);

  const columns = [
    { title: t("org_subscription"), field: "subscription" },
    { title: t("Subscription_Cost"), field: "cost" },
    { title: t("PURCHASE_DATE"), field: "purchase_date" },
    { title: t("ACTIVATION_DATE"), field: "activation_date" },
    { title: t("VALID_TILL"), field: "valid_till" },
    {
      title: t("ACTION"),
      field: "internal_action",
      editable: false,
      sorting: false,
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
                xs={9}
                sm={9}
                md={9}
                lg={9}
                xl={9}
                className="orgAdminHeadings"
              >
                <div>{t("Account_Subscription_Management")}</div>
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <Button
                  className="orgAdminHeaderBtn"
                  onClick={() =>
                    History.push({ pathname: PATHS.ACCOUNTSUBSCRIPTIONADDPLAN })
                  }
                >
                  <BsFillPlusCircleFill className="orgAdminHeaderIcons" />
                  <Grid className="orgAdminHeaderText">{t("ADD_PLAN")} </Grid>
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
                    data={accountSubsList}
                    title={t("ACCOUNT_SUBSCRIPTION_INFO")}
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

export default AccountSubscriptionManagement;
