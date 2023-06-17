import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import InputField from "../../components/InputField";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import { FormControl } from "@mui/material";
import "./PlatformAdmin.css";
import UploadButton from "../../components/UploadButton";
import TextArea from "../../components/TextArea";
import "../Style.css";
import CustomNumberField from "../../components/CustomNumberField";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import Footer from "../../components/Footer";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { MdOutlineNavigateNext } from "react-icons/md";
import Link from "@mui/material/Link";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/index";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import {
  isRegisterEmailValid,
  orgSessionStorage,
  orgSessionStorageEdit,
} from "../../utility/validation";
import { useOperation } from "../../redux/operations";
import { useDispatch } from "react-redux";
import ReadOnlyField from "../../components/ReadOnlyField";

const AddOrg = () => {
  const History = useNavigate();
  const { t } = useTranslation();
  const operation = useOperation();
  const dispatch = useDispatch();
  const type = sessionStorage.getItem("type");
  const pageNo = localStorage.getItem("orgPage");
  const [orgData, setOrgData] = useState({
    orgName: { value: "", validation: "" },
    email: { value: "", validation: "" },
    url: { value: "", validation: "" },
    maxuser: { value: "", validation: "" },
    language: { value: 1, validation: "" },
    description: { value: "", validation: "" },
  });

  const [filter, setFilter] = useState([]);

  useEffect(() => {
    dispatch(operation.user.languageAPI()).then((res) => {
      setFilter([
        { id: 1, value: "日本語" },
        { id: 2, value: "English" },
      ]);
    });
    const dataOrg = orgSessionStorage("addOrg", "GET");
    if (dataOrg) {
      setOrgData({
        orgName: { value: dataOrg?.orgName, validation: "" },
        email: { value: dataOrg?.emailAddress, validation: "" },
        url: { value: dataOrg?.orgUrl, validation: "" },
        maxuser: { value: dataOrg?.maxUsers, validation: "" },
        language: { value: dataOrg?.languageId, validation: "" },
        description: { value: dataOrg?.description, validation: "" },
      });
    } else {
      const dataEdit = orgSessionStorageEdit("orgEdit");
      if (dataEdit) {
        setOrgData({
          orgName: { value: dataEdit?.orgName, validation: "" },
          email: { value: dataEdit?.emailAddress, validation: "" },
          url: { value: dataEdit?.orgUrl, validation: "" },
          maxuser: { value: dataEdit?.maxUsers, validation: "" },
          language: { value: dataEdit?.languageId, validation: "" },
          description: { value: dataEdit?.description, validation: "" },
        });
      }
    }
  }, []);

  const onChangeData = (lable, value) => {
    setOrgData({
      ...orgData,
      [lable]: { value: value, validation: "" },
    });
  };

  const orgValidation = () => {
    const data = { ...orgData };

    if (isEmpty(orgData?.orgName?.value))
      data.orgName.validation = t("This_field_is_required");

    if (isEmpty(orgData?.email?.value))
      data.email.validation = t("This_field_is_required");
    else if (!isRegisterEmailValid(orgData?.email?.value))
      data.email.validation = t("Please_enter_a_valid_Email");
    if (orgData?.maxuser?.value == "")
      data.maxuser.validation = t("This_field_is_required");

    for (let key in data) {
      if (data[key].validation != "") {
        throw { OrgData: data };
      }
    }
  };

  const handleDataStorage = (data) => {
    let orgStorage = {
      orgName: data?.orgName?.value,
      emailAddress: data?.email?.value,
      orgUrl: data?.url?.value,
      languageId: data?.language?.value,
      maxUsers: data?.maxuser?.value,
      description: data?.description?.value,
      languagename: filter.filter((ele) => ele?.id == data?.language?.value)[0]
        ?.value,
    };
    orgSessionStorage("addOrg", "SAVE", orgStorage);
  };

  const onSubmit = async () => {
    try {
      orgValidation();
      handleDataStorage(orgData);
      History(PATHS.SELECTINDUSTRYCLASSCIFICATION);
    } catch (e) {
      if (e?.OrgData) {
        setOrgData({ ...orgData, ...e.OrgData });
      }
    }
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      onClick={() => {
        History(PATHS.ORGANISATIONMANAGEMENT);
      }}
    >
      {t("Organisation_Management")}
    </Link>,
    <Typography key="2" color="text.primary">
      {type === "ADD" ? t("Add_Organisation") : t("Edit_Organisation")}
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
      <Grid container className="inputFieldsWholeContainer">
        <Grid container>
          <Grid
            xs={12}
            sm={5.5}
            md={5.5}
            lg={5.5}
            xl={5.5}
            className="oneInputGridContainer"
          >
            <InputField
              id="addOrgOrganisationNameId"
              name={`${t("Organisation_Name")} ${"*"}`}
              value={orgData?.orgName?.value}
              onChange={(e) => {
                onChangeData("orgName", e.target.value);
              }}
            />
            {!isEmpty(orgData?.orgName?.validation) && (
              <span className="danger"> {orgData?.orgName?.validation} </span>
            )}
          </Grid>
          <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
          <Grid
            xs={12}
            sm={5.5}
            md={5.5}
            lg={5.5}
            xl={5.5}
            className="oneInputGridContainer"
          >
            {type === "ADD" ? (
              <>
                <InputField
                  id="addOrgEmailId"
                  name={`${t("Email_ID")} ${"*"}`}
                  value={orgData?.email?.value}
                  onChange={(e) => {
                    onChangeData("email", e.target.value);
                  }}
                />
                {!isEmpty(orgData?.email?.validation) && (
                  <span className="danger"> {orgData?.email?.validation} </span>
                )}
              </>
            ) : (
              <ReadOnlyField
                name={`${t("Email_ID")} ${"*"}`}
                id="organisationSummaryEmailId"
                value={orgData?.email?.value}
              />
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            xs={12}
            sm={5.5}
            md={5.5}
            lg={5.5}
            xl={5.5}
            className="oneInputGridContainer"
          >
            <InputField
              id="addOrgURLId"
              name={t("URL")}
              value={orgData?.url?.value}
              onChange={(e) => {
                onChangeData("url", e.target.value);
              }}
            />
            {!isEmpty(orgData?.url?.validation) && (
              <span className="danger"> {orgData?.url?.validation} </span>
            )}
          </Grid>
          <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
          <Grid
            xs={12}
            sm={5.5}
            md={5.5}
            lg={5.5}
            xl={5.5}
            className="oneInputGridContainer"
          >
            <CustomNumberField
              name={`${t("Maximum_Number_of_Users")} ${"*"}`}
              value={orgData?.maxuser?.value}
              id="addOrgMaxNoOfUsersId"
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  e.target.value.match(/^[0-9]{1,100000}$/g)
                )
                  onChangeData("maxuser", e.target.value);
              }}
            />
            {!isEmpty(orgData?.maxuser?.validation) && (
              <span className="danger"> {orgData?.maxuser?.validation} </span>
            )}
          </Grid>
          <Grid container>
            <Grid
              xs={12}
              sm={5.5}
              md={5.5}
              lg={5.5}
              xl={5.5}
              className="oneInputGridContainer"
            >
              <div>
                <FormControl
                  variant="standard"
                  style={{ width: "98%", marginTop: "20px" }}
                >
                  <InputLabel id="addOrgLanguageId">{`${t(
                    "Language"
                  )} ${"*"}`}</InputLabel>
                  <NativeSelect
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      onChangeData("language", e.target.value);
                    }}
                    id="addOrgLanguageSelectId"
                    value={orgData?.language?.value}
                  >
                    <option diabled selected hidden>
                      {t("---select---")}
                    </option>
                    {filter.map((ele, index) => (
                      <option value={ele?.id} id={`addOrgSoftwareId${index}`}>
                        {ele?.value}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              </div>
            </Grid>
            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
            <Grid
              xs={12}
              sm={5.5}
              md={5.5}
              lg={5.5}
              xl={5.5}
              className="oneInputGridContainer"
            ></Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} className="oneInputGridContainer">
              <TextArea
                name={t("Description")}
                id="addOrgDescriptionId"
                value={orgData?.description?.value}
                helperText={`${orgData?.description?.value.length}/500`}
                onChange={(e) => {
                  onChangeData("description", e.target.value);
                }}
              />
              {!isEmpty(orgData?.description?.validation) && (
                <span className="danger">
                  {" "}
                  {orgData?.description?.validation}{" "}
                </span>
              )}
            </Grid>
          </Grid>
        </Grid>
        <div className="submitCancelBtnDiv">
          <button
            id="addOrgCancelBtnId"
            onClick={() => {
              History(PATHS.ORGANISATIONMANAGEMENT, {
                state: { pageNo: pageNo },
              });
            }}
            className="logOutNoBtn"
          >
            {t("Cancel")}
          </button>
          <button
            id="addOrgNextBtnId"
            onClick={() => {
              onSubmit();
            }}
            className="logOutYesBtn"
          >
            {t("Next")}
          </button>
        </div>
      </Grid>
      <Footer />
    </>
  );
};

export default AddOrg;
