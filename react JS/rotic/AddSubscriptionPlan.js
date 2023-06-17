import React, { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import { Grid } from "@mui/material";
import DateField from "../../components/DateField";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import Footer from "../../components/Footer";
import { PATHS } from "../../routes";
import { useNavigate, useLocation } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { MdOutlineNavigateNext } from "react-icons/md";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import { useOperation } from "../../redux/operations";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import NativeSelect from "@mui/material/NativeSelect";
import { toast } from "react-hot-toast";
import moment from "moment";
import CustomNumberField from "../../components/CustomNumberField";

const AddSubscriptionPlan = () => {
  const History = useNavigate();
  const dispatch = useDispatch();
  const operation = useOperation();
  const location = useLocation();
  const { t } = useTranslation();
  const [type, setType] = useState({});
  const [planName, setPlanName] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(
    moment(new Date().toLocaleDateString("en-US")).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date().toLocaleDateString("en-US")).format("YYYY-MM-DD")
  );
  const [validity, setValidity] = useState("");
  const [amt, setAmt] = useState("");
  const [maxUsers, setMaxUsers] = useState("");
  const [visiblity, setVisiblity] = useState("");
  const [errorStatus, setErrorStatus] = useState([]);
  const [editPlanName, setEditPlanName] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editValidity, setEditValidity] = useState("");
  const [editAmt, setEditAmt] = useState("");
  const [editMaxNum, setEditMaxNum] = useState("");
  const [editVisibiltiy, setEditVisibility] = useState("");
  const [editErrorStatus, setEditErrorStatus] = useState([]);

  useEffect(() => {
    setType({ ...location.state });
  }, [location]);

  console.log("LOCATION", location.state.page);

  //CLEAR DATA FOR CREATE SUBSCRIPTION PLAN
  const clearData = () => {
    setAmt("");
    setEndDate("");
    setMaxUsers("");
    setPlanName("");
    setStartDate("");
    setStatus("");
    setValidity("");
    setVisiblity("");
    setErrorStatus("");
  };

  //CREATE SUBSCRIPTION PLAN
  const onClickAddBtn = () => {
    const ADD_SUB_PAYLOAD = {
      amount: amt,
      endDate: endDate,
      maxUsers: maxUsers,
      planName: planName,
      startDate: startDate,
      status: status,
      validity: validity,
      visibility: visiblity,
    };
    dispatch(
      operation.user.addSub({ url: `/subscription`, data: ADD_SUB_PAYLOAD })
    )
      .then((res) => {
        toast.success(res?.data?.message);
        History(PATHS.SUBSCRIPTIONMANAGEMENT);
        clearData();
      })
      .catch((e) => {
        setErrorStatus(e?.data);
      });
  };

  // GET SUBSCRIPTION FOR EDIT
  useEffect(() => {
    {
      type.type === "EDIT" &&
        dispatch(
          operation.user.particularSubscriptionPlan({
            url: `/subscription/${location.state.id}`,
          })
        )
          .then((res) => {
            setEditPlanName(res?.data?.data?.planName),
              setEditStatus(res?.data?.data?.status),
              setEditStartDate(res?.data?.data?.startDate),
              setEditEndDate(res?.data?.data?.endDate),
              setEditValidity(res?.data?.data?.validity),
              setEditAmt(res?.data?.data?.amount),
              setEditMaxNum(res?.data?.data?.maxUsers),
              setEditVisibility(res?.data?.data?.visibility);
          })
          .catch((e) => console.log(e));
    }
  }, [type]);

  //EDIT SUBSCRIPTION PLAN
  const onClickEditBtn = () => {
    const EDIT_SUB_PAYLOAD = {
      amount: editAmt,
      endDate: editEndDate,
      maxUsers: editMaxNum,
      planName: editPlanName,
      startDate: editStartDate,
      status: editStatus,
      validity: editValidity,
      visibility: editVisibiltiy,
    };
    dispatch(
      operation.user.editsubscriptionplan({
        url: `/subscription/${location.state.id}`,
        data: EDIT_SUB_PAYLOAD,
      })
    )
      .then((res) => {
        toast.success(res?.data?.message);
        History(PATHS.SUBSCRIPTIONMANAGEMENT, { state: { pageNo: type.page } });
        setEditErrorStatus("");
      })
      .catch((e) => {
        setEditErrorStatus(e?.data);
      });
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      id="addSubSubManagementBreadCrumbId"
      color="inherit"
      onClick={() => {
        History(PATHS.SUBSCRIPTIONMANAGEMENT);
      }}
    >
      {t("Subscription_Management")}
    </Link>,
    <Typography key="2" id="addProjectIdBreadCrumbId" color="text.primary">
      {type.type === "ADD" ? t("Create_Plan") : t("Edit_Plan")}
    </Typography>,
  ];

  return (
    <div>
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
      <div style={{ color: "red", paddingTop: "5px", textAlign: "center" }}>
        {type.type === "ADD"
          ? errorStatus?.errorTitle
          : editErrorStatus?.errorTitle}
      </div>
      <div style={{ color: "red", paddingTop: "5px", textAlign: "center" }}>
        {editErrorStatus?.subscriptionAlreadyPurchased}
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
              id="addSubPlanPlanNameId"
              name={`${t("plan_Name")} ${"*"}`}
              value={type.type === "ADD" ? planName : editPlanName}
              onChange={
                type.type === "ADD"
                  ? (e) => setPlanName(e.target.value)
                  : (e) => setEditPlanName(e.target.value)
              }
            />
            <div style={{ color: "red" }}>
              {type.type === "ADD"
                ? errorStatus?.planName
                : editErrorStatus?.planName}
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
          >
            <div>
              <FormControl
                variant="standard"
                style={{ width: "98%", marginTop: "20px" }}
              >
                <InputLabel>{`${t("Status")} ${"*"}`}</InputLabel>
                <NativeSelect
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="addSubPlanStatusSelectId"
                  value={type.type === "ADD" ? status : editStatus}
                  onChange={
                    type.type === "ADD"
                      ? (e) => setStatus(e.target.value)
                      : (e) => setEditStatus(e.target.value)
                  }
                >
                  <option diabled selected hidden>
                    {t("---select---")}
                  </option>
                  <option value="ACTIVE" id="addSubPlanAcitveId">
                    {t("Active")}
                  </option>
                  <option value="INACTIVE" id="addSubPlanInactiveId">
                    {t("Inactive")}
                  </option>
                </NativeSelect>
              </FormControl>
              <div style={{ color: "red" }}>
                {type.type === "ADD"
                  ? errorStatus?.status
                  : editErrorStatus?.status}
              </div>
            </div>
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
            <DateField
              name={`${t("Plan_Start_Date")} ${"*"}`}
              value={
                type.type === "ADD"
                  ? moment(startDate.toLocaleString()).format("YYYY-MM-DD")
                  : moment(editStartDate.toLocaleString()).format("YYYY-MM-DD")
              }
              onChange={
                type.type === "ADD"
                  ? (e) => setStartDate(e.target.value)
                  : (e) => setEditStartDate(e.target.value)
              }
              id="addSubPlanStartDateId"
            />
            <div style={{ color: "red" }}>
              {type.type === "ADD"
                ? errorStatus?.startDate
                : editErrorStatus?.startDate}
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
          >
            <DateField
              name={`${t("Plan_End_Date")} ${"*"}`}
              value={
                type.type === "ADD"
                  ? moment(endDate.toLocaleString()).format("YYYY-MM-DD")
                  : moment(editEndDate.toLocaleString()).format("YYYY-MM-DD")
              }
              inputProps={{ min: startDate }}
              onChange={
                type.type === "ADD"
                  ? (e) => setEndDate(e.target.value)
                  : (e) => setEditEndDate(e.target.value)
              }
              id="addSubPlanEndDateId"
            />
            <div style={{ color: "red" }}>
              {type.type === "ADD"
                ? errorStatus?.endDate
                : editErrorStatus?.endDate}
            </div>
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
            <div>
              <FormControl
                variant="standard"
                style={{ width: "98%", marginTop: "20px" }}
              >
                <InputLabel>{`${t("Validity_in_days")} ${"*"}`}</InputLabel>
                <NativeSelect
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={type.type === "ADD" ? validity : editValidity}
                  onChange={
                    type.type === "ADD"
                      ? (e) => setValidity(e.target.value)
                      : (e) => setEditValidity(e.target.value)
                  }
                  id="addSubPlanSelectValidityId"
                >
                  <option diabled selected hidden>
                    {t("---select---")}
                  </option>
                  <option value="30" id="subManagementPlatinumId">
                    30{" "}
                  </option>
                  <option value="90" id="subManagemntSilberId">
                    90{" "}
                  </option>
                  <option value="180" id="subManagemntSilberId">
                    180{" "}
                  </option>
                  <option value="365" id="subManagemntSilberId">
                    365{" "}
                  </option>
                </NativeSelect>
              </FormControl>
            </div>
            <div style={{ color: "red" }}>
              {type.type === "ADD"
                ? errorStatus?.validity
                : editErrorStatus?.validity}
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
          >
            {type.type === "ADD" ? (
              <CustomNumberField
                name={`${t("Cost")} ${"¥"}${"*"}`}
                value={amt}
                id="addSubAmountId"
                onChange={(e) => {
                  if (
                    e.target.value === "" ||
                    e.target.value.match(/^[0-9]{1,100000}$/g)
                  )
                    setAmt(e.target.value);
                }}
              />
            ) : (
              <CustomNumberField
                name={`${t("Cost")} ${"¥"}${"*"}`}
                value={editAmt}
                id="addSubAmountId"
                onChange={(e) => {
                  if (
                    e.target.value === "" ||
                    e.target.value.match(/^[0-9]{1,100000}$/g)
                  )
                    setEditAmt(e.target.value);
                }}
              />
            )}
            <div style={{ color: "red" }}>
              {type.type === "ADD"
                ? errorStatus?.amount
                : editErrorStatus?.amount}
            </div>
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
            {type.type === "ADD" ? (
              <CustomNumberField
                name={`${t("Max_Users")} ${"*"}`}
                value={maxUsers}
                id="addSubPlanMaxNoOfUsersId"
                onChange={(e) => {
                  if (
                    e.target.value === "" ||
                    e.target.value.match(/^[0-9]{1,100000}$/g)
                  )
                    setMaxUsers(e.target.value);
                }}
              />
            ) : (
              <CustomNumberField
                name={`${t("Max_Users")} ${"*"}`}
                value={editMaxNum}
                id="addSubPlanMaxNoOfUsersId"
                onChange={(e) => {
                  if (
                    e.target.value === "" ||
                    e.target.value.match(/^[0-9]{1,100000}$/g)
                  )
                    setEditMaxNum(e.target.value);
                }}
              />
            )}
            <div style={{ color: "red" }}>
              {type.type === "ADD"
                ? errorStatus?.maxUsers
                : editErrorStatus?.maxUsers}
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
          >
            <div>
              <FormControl
                variant="standard"
                style={{ width: "98%", marginTop: "20px" }}
              >
                <InputLabel>{`${t("Visiblity")} ${"*"}`}</InputLabel>
                <NativeSelect
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="addSubPlanVisiblitySelectId"
                  value={type.type === "ADD" ? visiblity : editVisibiltiy}
                  onChange={
                    type.type === "ADD"
                      ? (e) => setVisiblity(e.target.value)
                      : (e) => setEditVisibility(e.target.value)
                  }
                >
                  <option diabled selected hidden>
                    {t("---select---")}
                  </option>
                  <option value="ROTIC TEAM" id="addSubPlanRoticTeamId">
                    {t("Rotic Team")}
                  </option>
                  <option value="ALL ORGANIZATION" id="addSubPlanForAllOrgsId">
                    {t("All Organisation")}
                  </option>
                </NativeSelect>
              </FormControl>
            </div>
            <div style={{ color: "red" }}>
              {type.type === "ADD"
                ? errorStatus?.visibility
                : editErrorStatus?.visibility}
            </div>
          </Grid>
        </Grid>
        <div className="submitCancelBtnDiv">
          <button
            id="addSubCancelBtnId"
            onClick={() =>
              History(PATHS.SUBSCRIPTIONMANAGEMENT, {
                state: { pageNo: location.state.page },
              })
            }
            className="logOutNoBtn"
          >
            {t("Cancel")}
          </button>
          {type.type === "ADD" ? (
            <button
              id="addSubAddBtnId"
              onClick={() => {
                onClickAddBtn();
              }}
              className="logOutYesBtn"
            >
              {t("Add")}{" "}
            </button>
          ) : (
            <button
              id="addSubAddBtnId"
              onClick={() => {
                onClickEditBtn();
              }}
              className="logOutYesBtn"
            >
              {t("Save")}{" "}
            </button>
          )}
        </div>
      </Grid>
      <Footer />
    </div>
  );
};

export default AddSubscriptionPlan;
