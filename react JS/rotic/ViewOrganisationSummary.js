import React, { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NavigationHeader from "../../components/NavigationHeader";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { MdOutlineNavigateNext } from "react-icons/md";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/index";
import ReadOnlyField from "../../components/ReadOnlyField";
import ReadOnlyTextArea from "../../components/ReadOnlyTextArea";
import { useOperation } from "../../redux/operations";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ViewOrganisationSummary = () => {
  const History = useNavigate();
  const Location = useLocation();
  console.log(Location.state.page);
  const VIEW_ORG_DATA = useSelector(
    (state) => state.user.viewParticularOrg?.data
  );
  const operation = useOperation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(operation.user.viewParticularOrg(`/org/${Location.state.orgId}`));
  }, []);

  const { t } = useTranslation();
  const breadcrumbs = [
    <Link
      underline="hover"
      id="organisationSummaryBreadcrumbId1"
      key="1"
      color="inherit"
      onClick={() => {
        History(PATHS.ORGANISATIONMANAGEMENT, {
          state: { pageNo: Location.state.page },
        });
      }}
    >
      {t("Organisation_Management")}
    </Link>,
    <Typography key="2" color="text.primary">
      {t("View_Organisation_Summary")}
    </Typography>,
  ];

  return (
    <>
      <Header />
      <NavigationHeader />
      <div className="breadCrumbDiv">
        <Stack spacing={2}>
          <Breadcrumbs
            separator={<MdOutlineNavigateNext fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </div>
      <Grid container className="selectIndustrialclassificationContainer">
        <Grid xs={12} lg={6} className="organisationSummaryGrid-1">
          <Grid className="selectIndustryclassificationHeaderDiv">
            <p>{t("Organisation_Profile")}</p>
          </Grid>
          <Grid>
            <ReadOnlyField
              name={t("Organisation_Name")}
              id="organisationSummaryOrgNameId"
              value={VIEW_ORG_DATA?.orgName}
            />
          </Grid>
          <Grid>
            <ReadOnlyField
              name={t("Email_ID")}
              id="organisationSummaryEmailId"
              value={VIEW_ORG_DATA?.emailAddress}
            />
          </Grid>
          <Grid>
            <ReadOnlyField
              name={t("URL")}
              id="organisationSummaryUrlId"
              value={VIEW_ORG_DATA?.orgUrl}
            />
          </Grid>
          <Grid>
            <ReadOnlyField
              name={t("Language")}
              id="organisationSummaryLanguageId"
              value={VIEW_ORG_DATA?.languageId == 1 ? "日本語" : "English"}
            />
          </Grid>
          <Grid>
            <ReadOnlyField
              name={t("Maximum_No_of_Users")}
              id="organisationSummaryMaxUsersId"
              value={VIEW_ORG_DATA?.maxUsers}
            />
          </Grid>
          <Grid>
            <ReadOnlyTextArea
              name={t("Description")}
              id="organisationSummaryDescriptionId"
              value={VIEW_ORG_DATA?.description}
            />
          </Grid>
        </Grid>
        <Grid xs={12} lg={6} className="organisationSummaryGrid-2">
          <Grid className="selectIndustryclassificationHeaderDiv">
            <p>{t("Industry_Classification")}</p>
          </Grid>
          {VIEW_ORG_DATA?.classificationVOList?.map((ele) => (
            <>
              <Typography>
                <b>{ele?.name}</b>
              </Typography>
              {ele?.subClassificationVOList?.map((list, index) => (
                <li key={index} style={{ padding: "5px" }}>
                  {list?.name}
                </li>
              ))}
            </>
          ))}
          <Grid className="selectIndustryclassificationHeaderDiv">
            <p>{t("Subscription")}</p>
          </Grid>
          <Grid className="organisationSummaryHeading">
            <p>{t("Subscription_Name")}: </p>
            <p style={{ fontWeight: "400" }}>&nbsp;{VIEW_ORG_DATA?.planName}</p>
          </Grid>
          <Grid className="organisationSummaryHeading">
            <p>{t("Subscription_Max_No_of_Users")} :</p>
            <p style={{ fontWeight: "400" }}>
              &nbsp;{VIEW_ORG_DATA?.subscriptionMaxUsers}
            </p>
          </Grid>
          <Grid className="organisationSummaryHeading">
            <p>{t("Cost")}: </p>
            <p style={{ fontWeight: "400" }}>&nbsp;¥ {VIEW_ORG_DATA?.amount}</p>
          </Grid>
          <Grid className="organisationSummaryHeading">
            <p>{t("Validity")} :</p>
            <p style={{ fontWeight: "400" }}>
              &nbsp;{VIEW_ORG_DATA?.validity} {t("Days")}
            </p>
          </Grid>
        </Grid>
      </Grid>
      <div className="submitCancelBtnDiv">
        <button
          id="organisationSummaryBtnId"
          className="logOutYesBtn"
          onClick={() => {
            History(PATHS.ORGANISATIONMANAGEMENT, {
              state: { pageNo: Location.state.page },
            });
          }}
        >
          {t("Back")}
        </button>
      </div>
      <Footer />
    </>
  );
};

export default ViewOrganisationSummary;
