import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NavigationHeader from "../../components/NavigationHeader";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { MdOutlineNavigateNext } from "react-icons/md";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextArea from "../../components/TextArea";
import InputField from "../../components/InputField";
import { useTranslation } from "react-i18next";
import { orgSessionStorage } from "../../utility/validation";
import { useDispatch } from "react-redux";
import { useOperation } from "../../redux/operations";
import { PATHS } from "../../routes";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReadOnlyField from "../../components/ReadOnlyField";
import ReadOnlyTextArea from "../../components/ReadOnlyTextArea";

const OrganisationSummary = () => {
  const operation = useOperation();
  const dispatch = useDispatch();
  const History = useNavigate();
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [maxUser, setMaxUser] = useState("");
  const [errorStatus, setErrorStatus] = useState([]);
  const [editError, setEditError] = useState(false);
  const type = sessionStorage.getItem("type");
  const orgIdForEdit = JSON.parse(sessionStorage.getItem("orgEdit"));
  const pageNo = localStorage.getItem("orgPage");
  const [summaryData, setSummaryData] = useState({
    addORG: {},
    classification: {},
    industry: [],
    plan: {},
  });

  useEffect(() => {
    if (editError == true) {
      setOrgName(summaryData?.addORG?.orgName);
      setEmail(summaryData?.addORG?.emailAddress);
      setUrl(summaryData?.addORG?.orgUrl);
      setDescription(summaryData?.addORG?.description);
      setMaxUser(summaryData?.addORG?.maxUsers);
    }
  }, [editError]);

  useEffect(() => {
    const addORG = orgSessionStorage("addOrg", "GET");
    const classification = orgSessionStorage("classification", "GET");
    const industry = orgSessionStorage("industry", "GET");
    const plan = orgSessionStorage("plan", "GET");
    setSummaryData({
      addORG: addORG,
      classification: classification,
      industry: industry?.industry,
      plan: plan,
    });
  }, []);

  const getClassificationData = (data = []) => {
    const updatedData = data.filter((item) => item?.checkStatus === true);

    const str = updatedData.reduce((acc, item, index, array) => {
      return (acc += `${item?.subClassificationName}${
        index < array.length - 1 ? ", " : ""
      }`);
    }, "");
    return str;
  };

  const getClassificationAPIData = () => {
    let data = {};
    Object.keys(summaryData?.classification).forEach((e) => {
      let list = [];
      summaryData?.classification[e].forEach((ele) => {
        if (ele?.checkStatus) list.push(ele?.subClassificationId);
      });
      data[e] = list;
    });
    return data;
  };

  const onSubmit = () => {
    const APIClassificationData = getClassificationAPIData();
    let data = {
      classificationList: {
        ...APIClassificationData,
      },
      description:
        description === "" ? summaryData?.addORG?.description : description,
      emailAddress:
        email === "" && !editError ? summaryData?.addORG?.emailAddress : email,
      languageId: summaryData?.addORG?.languageId,
      maxUsers: maxUser === "" ? summaryData?.addORG?.maxUsers : maxUser,
      orgName:
        orgName === "" && !editError ? summaryData?.addORG?.orgName : orgName,
      orgUrl: url === "" ? summaryData?.addORG?.orgUrl : url,
      subscriptionId:
        summaryData?.plan === undefined
          ? orgIdForEdit?.subscriptionId
          : summaryData?.plan?.subscriptionId,
      userId: orgIdForEdit?.userId,
      status: orgIdForEdit?.status,
    };
    if (type === "ADD") {
      dispatch(operation.user.createOrganisation(data))
        .then((res) => {
          toast.success(res?.data?.message);
          History(PATHS.ORGANISATIONMANAGEMENT);
          sessionStorage.removeItem("orgStorage");
          sessionStorage.removeItem("type");
          setErrorStatus("");
        })
        .catch((e) => {
          setErrorStatus(e?.data);
          setEditError(true);
        });
    } else {
      dispatch(
        operation.user.editOrganisation({
          orgId: `${orgIdForEdit?.orgId}`,
          data: data,
        })
      )
        .then((res) => {
          toast.success(res?.data?.message);
          History(PATHS.ORGANISATIONMANAGEMENT, { state: { pageNo: pageNo } });
          sessionStorage.removeItem("orgStorage");
          sessionStorage.removeItem("type");
          sessionStorage.removeItem("subscriptionStatus");
          setErrorStatus("");
        })
        .catch((e) => {
          setErrorStatus(e?.data);
          setEditError(true);
        });
    }
  };

  const { t } = useTranslation();
  const breadcrumbs = [
    <Link
      underline="hover"
      id="organisationSummaryBreadcrumbId1"
      key="1"
      color="inherit"
      onClick={() => {
        History(PATHS.ORGANISATIONMANAGEMENT);
      }}
    >
      {t("Organisation_Management")}
    </Link>,
    <Link
      underline="hover"
      id="organisationSummaryBreadcrumbId2"
      key="2"
      color="inherit"
      onClick={() => {
        History(PATHS.ADDORG);
      }}
    >
      {type === "ADD" ? t("Add_Organisation") : t("Edit_Organisation")}
    </Link>,
    <Link
      underline="hover"
      id="organisationSummaryBreadcrumbId3"
      key="3"
      color="inherit"
      onClick={() => {
        History(PATHS.SELECTINDUSTRYCLASSCIFICATION);
      }}
    >
      {t("Industrial_Classification")}
    </Link>,
    <Link
      underline="hover"
      id="organisationSummaryBreadcrumbId3"
      key="4"
      color="inherit"
      onClick={() => {
        History(PATHS.SELECTINDUSTRYSUBCLASSCIFICATION);
      }}
    >
      {t("Industrial_Sub_Classification")}
    </Link>,
    <Link
      underline="hover"
      id="organisationSummaryBreadcrumbId3"
      key="5"
      color="inherit"
      onClick={() => {
        History(PATHS.CREATEORGSELECTPLAN);
      }}
    >
      {t("Select_Plan")}
    </Link>,
    <Typography key="4" color="text.primary">
      {t("Organisation_Summary")}
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
            {editError == false ? (
              <ReadOnlyField
                name={t("Organisation_Name")}
                id="orgSummaryOrgNameViewId"
                value={summaryData?.addORG?.orgName}
              />
            ) : (
              <InputField
                name={t("Organisation_Name")}
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                }}
              />
            )}
            <div style={{ color: "red" }}>{errorStatus?.orgName}</div>
          </Grid>
          <Grid>
            {editError == false || type != "ADD" ? (
              <ReadOnlyField
                name={t("Email_ID")}
                id="organisationSummaryEmailId"
                value={summaryData?.addORG?.emailAddress}
              />
            ) : (
              <InputField
                name={t("Email_ID")}
                id="organisationSummaryEmailId"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            )}
            <div style={{ color: "red" }}>{errorStatus?.emailAddress}</div>
          </Grid>
          <Grid>
            {editError == false ? (
              <ReadOnlyField
                name={t("URL")}
                id="organisationSummaryUrl"
                value={summaryData?.addORG?.orgUrl}
              />
            ) : (
              <InputField
                name={t("URL")}
                id="organisationSummaryUrlId"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
            )}
            <div style={{ color: "red" }}>{errorStatus?.orgUrl}</div>
          </Grid>
          <Grid>
            <InputField
              name={t("Language")}
              id="organisationSummaryLanguageId"
              value={summaryData?.addORG?.languagename}
            />
          </Grid>
          <Grid>
            {editError == false ? (
              <ReadOnlyField
                name={t("Max_No_of_Users")}
                id="organisationSummaryMaxUserId"
                value={summaryData?.addORG?.maxUsers}
              />
            ) : (
              <InputField
                name={t("Max_No_of_Users")}
                id="organisationSummaryMaxUserId"
                value={maxUser}
                onChange={(e) => {
                  if (
                    e.target.value === "" ||
                    e.target.value.match(/^[0-9]{1,100000}$/g)
                  )
                    setMaxUser(e.target.value);
                }}
              />
            )}
            <div style={{ color: "red" }}>{errorStatus?.maxUsers}</div>
          </Grid>
          <Grid>
            {editError == false ? (
              <ReadOnlyTextArea
                name={t("Description")}
                id="organisationSummaryMaxUserId"
                value={summaryData?.addORG?.description}
              />
            ) : (
              <TextArea
                name={t("Description")}
                id="organisationSummaryDescriptionId"
                value={description}
                helperText={`${description.length}/500`}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            )}
            <div style={{ color: "red" }}>{errorStatus?.description}</div>
          </Grid>
        </Grid>
        <Grid xs={12} lg={6} className="organisationSummaryGrid-2">
          <Grid className="selectIndustryclassificationHeaderDiv">
            <p>{t("Industry_Classification")}</p>
          </Grid>
          {errorStatus == "" ? null : (
            <>
              <div style={{ color: "red", paddingTop: "10px" }}>
                {errorStatus?.classification}
              </div>
              <div style={{ color: "red", paddingTop: "10px" }}>
                {errorStatus?.subClassification}
              </div>
            </>
          )}
          {summaryData?.industry?.map((ele, index) => (
            <Grid xs={12} lg={6} key={index}>
              <p className="organisationSummaryHeading">
                {ele?.classificationName}
              </p>
              <p className="organisationSummarySubHeading">
                -{" "}
                {getClassificationData(
                  summaryData?.classification?.[ele?.classificationId]
                )}
              </p>
            </Grid>
          ))}

          <Grid className="selectIndustryclassificationHeaderDiv">
            <p>{t("Subscription")}</p>
          </Grid>
          <Grid className="organisationSummaryHeading">
            <p>{t("Subscription_Name")}: </p>
            <p style={{ fontWeight: "400" }}>
              &nbsp;
              {summaryData?.plan === undefined
                ? orgIdForEdit?.planName
                : summaryData?.plan?.planName}
            </p>
          </Grid>
          <Grid className="organisationSummaryHeading">
            <p>{t("Subscription_Max_No_of_Users")} :</p>
            <p style={{ fontWeight: "400" }}>
              &nbsp;
              {summaryData?.plan === undefined
                ? orgIdForEdit?.subscriptionMaxUsers
                : summaryData?.plan?.maxUsers}
            </p>
          </Grid>
          <Grid className="organisationSummaryHeading">
            <p>{t("Validity")} :</p>
            <p style={{ fontWeight: "400" }}>
              &nbsp;
              {summaryData?.plan === undefined
                ? orgIdForEdit?.validity
                : summaryData?.plan?.validity}{" "}
              {t("Days")}
            </p>
          </Grid>
        </Grid>
      </Grid>
      <div className="submitCancelBtnDiv">
        {editError === false ? (
          <button
            id="organisationSummaryCancelBtnId"
            className="logOutNoBtn"
            onClick={() =>
              History(PATHS.ORGANISATIONMANAGEMENT, {
                state: { pageNo: pageNo },
              })
            }
          >
            {t("Cancel")}
          </button>
        ) : (
          <button
            id="organisationSummaryCancelBtnId"
            className="logOutNoBtn"
            onClick={() => History(PATHS.CREATEORGSELECTPLAN)}
          >
            {t("Back")}
          </button>
        )}

        <button
          id="organisationSummaryBtnId"
          className="logOutYesBtn"
          onClick={() => onSubmit()}
        >
          {type === "ADD" ? t("Create") : t("Save")}
        </button>
      </div>
      <Footer />
    </>
  );
};

export default OrganisationSummary;
