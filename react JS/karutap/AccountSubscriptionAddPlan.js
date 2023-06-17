import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./OrgAdmin.css";
import "./AddNewUser.css";
import "./AccountSubscriptionAddPlan.css";
import { Grid } from "@mui/material";
import Navbar from "./Navbar";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { PATHS } from "routes";
import { actions } from "store/module/AccountSubscriptionModule";
import { useDispatch, useSelector } from "react-redux";
import { tableIcons } from "../utils";
import MaterialTable from "material-table";

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

const AccountSubscriptionAddPlan = (props) => {
  const History = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const accountSubscriptionState = useSelector(
    (state) => state.accountsubscription
  );
  var orgId = sessionStorage.getItem("Org_ID");
  const [value1, setValue] = useState(0);
  const [planList, setplanList] = useState([]);
  const [sameValues, setSameValues] = useState([]);

  // Breadcrumbs
  const breadcrumbs = [
    <Link
      onClick={() => History.push(PATHS.ACCOUNTSUBSCRIPTIONMANAGEMENT)}
      fontSize="13px"
      underline="hover"
      key="1"
      color="inherit"
    >
      {t("Account_Subscription")}
    </Link>,
    <Typography style={{ fontSize: "13px" }} key="2" color="text.primary">
      {t("Add_Plan")}
    </Typography>,
  ];

  // Plan list useEffect
  useEffect(async () => {
    const Plan_Payload = {
      END_POINT1: "plan",
      END_POINT2: "filter",
      Query: {
        list: "All_Plans",
        page: 1,
        size: 100000,
      },
    };
    await dispatch(actions.getAllPlans(Plan_Payload));
  }, []);

  // particular plan view
  const postorganisationplan = async (subPlanId) => {
    const post_org_Plan_Payload = {
      END_POINT1: "org",
      END_POINT2: orgId,
      END_POINT3: "plan",
      END_POINT4: "planId",
      Query: {
        subPlanId: subPlanId,
      },
    };
    await dispatch(actions.postOrgPlan(post_org_Plan_Payload));
  };
  useEffect(() => {
    if (accountSubscriptionState.postorgplanres?.data?.statusCode == 200) {
    }
  }, [accountSubscriptionState.postorgplanres]);
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

  const columns = [
    { title: t("PLAN_NAME"), field: "planName" },
    { title: t("NO_OF_KARUTA"), field: "noOfKaruta" },
    { title: t("DURATION_IN_MONTHS"), field: "duration" },
    { title: t("COST"), field: "cost" },
    {
      title: t("ACTION"),
      field: "action",
      editable: false,
      sorting: false,
    },
  ];
  // Table value mapping useEffect
  useEffect(() => {
    if (accountSubscriptionState.getAllPlans) {
      const plan_list =
        accountSubscriptionState.getAllPlans &&
        accountSubscriptionState.getAllPlans?.data &&
        accountSubscriptionState.getAllPlans?.data?.subscription.map(
          (
            {
              planName,
              maxNoOfKaruta,
              duration,
              cost,
              subPlanId,
              currencySymbol,
            },
            i
          ) => {
            return {
              planName: planName,
              noOfKaruta: maxNoOfKaruta,
              duration: duration,
              cost: currencySymbol + " " + cost.toLocaleString("ja-JP"),
              action: (
                <Button
                  className="orgAdminSaveBtn"
                  title={t("Buy")}
                  style={{
                    fontSize: "15px",
                    textTransform: "none",
                    padding: "0",
                  }}
                  onClick={() => {
                    postorganisationplan(subPlanId);
                    History.push({
                      pathname: PATHS.ACCOUNTSUBSCRIPTIONREVIEWPLAN,
                      search: `?ACCOUNTSUBSCRIPTIONREVIEWPLAN`,
                      state: {
                        planDetails: JSON.stringify(
                          accountSubscriptionState.getAllPlans?.data
                            ?.subscription[i]
                        ),
                      },
                    });
                  }}
                >
                  {t("Buy")}
                </Button>
              ),
            };
          }
        );
      setplanList(plan_list);
    }
  }, [accountSubscriptionState]);

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
                <div>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {breadcrumbs}
                  </Breadcrumbs>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ width: "100%" }} className="addSubscriptionPlanBox">
            <TabPanel value={value1} index={0}>
              <Grid className="materialTableContainer">
                <MaterialTable
                  className="materialTable"
                  style={{ backgroundColor: "transparent" }}
                  icons={tableIcons}
                  columns={columns}
                  data={planList}
                  title={t("ADD_PLAN")}
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
    </div>
  );
};

export default AccountSubscriptionAddPlan;
