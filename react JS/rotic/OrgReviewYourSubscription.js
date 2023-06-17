import React from "react";
import Radio from "@mui/material/Radio";
import Header from "../../components/Header";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import InputField from "../../components/InputField";
import ReadOnlyField from "../../components/ReadOnlyField";
import TextArea from "../../components/TextArea";
import DateField from "../../components/DateField";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { PATHS } from "../../routes";
import { useNavigate } from "react-router-dom";
import OrgAdminNavigation from "../../components/OrgAdminNavigation";
import { useDispatch } from "react-redux/es/exports";
import { useOperation } from "../../redux/operations";
import { useLocation } from "react-router-dom";
import useInterval from "../../components/Polling";
import { toast } from "react-hot-toast";
import moment from "moment";

const OrgReviewYourSubscription = () => {
  const History = useNavigate();
  const dispatch = useDispatch();
  const operation = useOperation();
  const { t } = useTranslation();
  const Location = useLocation();

  const [selectedValue, setSelectedValue] = useState("");
  const [purchaseclick, setpurchaseclick] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [description, setDescription] = useState("");
  const [paymentRefId, setPaymentRefId] = useState("");
  const [accountList, setAccountList] = useState([]);
  const UserData = JSON.parse(sessionStorage.getItem("UserData"));
  const [open, setOpen] = useState(false);
  const dateNow = new Date();
  const [paymentDate, setPaymentDate] = useState(moment(dateNow).format());
  const [paymentToken, setPaymentToken] = useState("");
  const [paymentdateError, setPaymentDateError] = useState("");
  const [paymentReferenceError, setPaymentReferenceError] = useState("");
  const [errorTitleError, setErrorTitleError] = useState("");
  const [manual, setManual] = useState(0);
  const [paymentReferenceId, setPaymentReferenceId] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleClickAddUser = () => {
    dispatch(operation.user.getConfiguration()).then((res) => {
      setAccountList(res?.data?.data);
    });
    setOpenAddUser(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //ORG PAYPAL PAYMENT
  const onclickPaypalRedirection = () => {
    const PAYPAL_PAYMENT_PAYLOAD = {
      subPlanId: Location.state.subscriptionid,
      paymentMethod: "PAYPAL",
      currency: "USD",
      description: "PAYPALSALE",
      intent: "SALE",
    };
    dispatch(
      operation.orgAdmin.paypal({
        url: `/org/${UserData?.orgId}/pay`,
        params: PAYPAL_PAYMENT_PAYLOAD,
      })
    ).then((res) => {
      setOpen(true);
      setPaymentReferenceId(res?.data?.data?.paymentReferenceId);
      const paymentUrl = res?.data?.data?.redirect;
      setPaymentToken(
        paymentUrl?.split(
          "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token="
        )[1]
      );
      const windowFeatures =
        "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
      window.open(paymentUrl, windowFeatures);
    });
  };

  // INTERVEL POLLING OF PAYMENT STATUS
  useInterval(async () => {
    {
      open == true
        ? await dispatch(
            operation.orgAdmin.paypalPaymentSuccessStatus({
              url: `/org/${UserData?.orgId}/subscription/${Location.state.subscriptionid}/payment/status`,
              params: { paymentReference: paymentReferenceId },
            })
          ).then((res) => {
            if (res?.data?.data == "APPROVED") {
              setOpen(false);
              History(PATHS.ORGADMINSUBSCRIPTIONMANAGEMENT);
              toast.success(res?.data?.message);
            }
          })
        : null;
    }
  }, 5000);

  // MANUAL PAYMENT
  const bankDetailsPost = () => {
    let POST_EXPENSE_PAYLOAD = {
      accountId: accountList.accountId,
      description: description,
      paymentDate: paymentDate,
      paymentRefId: paymentRefId,
      paymentType: "MANUAL",
      subscriptionId: Location.state.subscriptionid,
    };

    dispatch(
      operation.orgAdmin.addBankDetails({
        url: `/org/${UserData?.orgId}/payment`,
        data: POST_EXPENSE_PAYLOAD,
      })
    )
      .then((res) => {
        clearData();
        setOpenAddUser(false);
        toast.success(res?.data?.message);
        History(PATHS.ORGADMINSUBSCRIPTIONMANAGEMENT);
      })
      .catch((e) => {
        setPaymentDateError(e?.data?.paymentDate);
        setPaymentReferenceError(e?.data?.paymentReference);
        setErrorTitleError(e?.data?.errorTitle);
      });
  };

  const clearData = () => {
    setDescription("");
    setPaymentDate("");
    setPaymentRefId("");
    setPaymentDateError("");
    setPaymentReferenceError("");
    setErrorTitleError("");
  };
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      onClick={() => History(PATHS.ORGADMINSUBSCRIPTIONMANAGEMENT)}
    >
      {/* } */}
      {t("Subscription_Management")}
    </Link>,
    <Link
      underline="hover"
      color="inherit"
      key="2"
      onClick={() => {
        History(PATHS.ORGSELECTPLAN);
      }}
    >
      {t("Select_Plan")}
    </Link>,
    <Typography key="2" id="orgSelectPlanBreadCrumbId1" color="text.primary">
      {t("Review_Plan")}
    </Typography>,
  ];

  return (
    <>
      <Header />
      <OrgAdminNavigation />
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
      <div className="reviewWhole">
        <div className="reviewText">{t("Review_Your_Subscription")}</div>
        <div className="subscriptionCard">
          <div className="subscriptionText">
            <div>{Location.state.planName}</div>
            <div className="subCostDiv">
              <div className="subsInnerText">
                {t("Subscription_Cost")}: ¥ {Location.state.amount}
              </div>
              <div className="subsInnerText">
                {t("Max_No_of_Users")}: {Location.state.maxUsers}
              </div>
              <div className="subsInnerText">
                {t("Validity")}: {Location.state.validity}
              </div>
              <div className="wholeRadioBtnDiv">
                <div className="radioButtonDiv">
                  <Radio
                    checked={selectedValue === "a"}
                    onChange={() => {
                      setManual(2);
                    }}
                    value="a"
                    onClick={handleChange}
                    name="radio-buttons"
                    inputProps={{ "aria-label": "A" }}
                    id="reviewPayPalId"
                  />
                  <div>{t("Paypal_Payment")}</div>
                </div>
                <div className="radioButtonDiv">
                  <Radio
                    checked={selectedValue === "b"}
                    onChange={() => {
                      setManual(1);
                    }}
                    value="b"
                    onClick={handleChange}
                    name="radio-buttons"
                    inputProps={{ "aria-label": "B" }}
                    id="reviewManualId"
                  />
                  <div>{t("Manual_Transaction")}</div>
                </div>
              </div>

              <Dialog open={openAddUser}>
                <DialogTitle>Rotic Bank Account Details</DialogTitle>
                <div style={{ color: "red", textAlign: "center" }}>
                  {errorTitleError}
                </div>
                <DialogContent>
                  <Grid container>
                    <Grid container>
                      <Grid container>
                        <Grid
                          xs={12}
                          sm={5.5}
                          md={5.5}
                          lg={5.5}
                          xl={5.5}
                          className="oneInputGridContainer"
                        >
                          <ReadOnlyField
                            id="reviewPlanBankNameId"
                            name={t("Bank_Name")}
                            value={accountList.bankName}
                          />
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
                          <ReadOnlyField
                            id="reviewPlanSubPlanId"
                            name={t("Plan_Name")}
                            value={Location.state.planName}
                          />
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
                            <ReadOnlyField
                              id="reviewPlanBranchNameid"
                              name={t("Branch_Name")}
                              value={accountList.branchName}
                            />
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
                          <ReadOnlyField
                            id="reviewPlanSubCost"
                            name={t("Subscription_Cost")}
                            value={Location.state.amount}
                          />
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
                          <ReadOnlyField
                            id="reviewPlanAccountType"
                            name={t("Account_Type")}
                            value={accountList.accountType}
                          />
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
                          <ReadOnlyField
                            id="reviewPlanMaxNoOfUsersId"
                            name={t("Maximum_No_of_Users")}
                            value={Location.state.maxUsers}
                          />
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
                          <ReadOnlyField
                            id="reviewPlanAccountNumberId"
                            name={t("Account_Number")}
                            value={accountList.accountNumber}
                          />
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
                          <ReadOnlyField
                            name={t("Validity")}
                            id="reviewPlanPayRefId"
                            value={Location.state.validity}
                          />
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
                            inputProps={{
                              max: moment(dateNow).format("YYYY-MM-DD"),
                            }}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            name={t("Payment_Date")}
                            id="reviewPlanPaymentDateId"
                          />
                          <div style={{ color: "red" }}>{paymentdateError}</div>
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
                          <InputField
                            name={`${t("Payment_Ref_No")} ${"*"}`}
                            onChange={(e) => setPaymentRefId(e.target.value)}
                            id="reviewPlanPayRefId"
                          />
                          <div style={{ color: "red" }}>
                            {paymentReferenceError}
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid xs={12} className="oneInputGridContainer">
                          <TextArea
                            onChange={(e) => setDescription(e.target.value)}
                            helperText={`${description.length}/500`}
                            name={t("Description")}
                            id="reviewPlanDescriptionId"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <div>
                    <Button
                      color="error"
                      id="reviewPlanCancelBtnId"
                      onClick={() => {
                        setOpenAddUser(false), clearData();
                      }}
                    >
                      {t("Cancel")}
                    </Button>
                    <Button
                      id="reviewPlanSubmitBtnId"
                      onClick={() => {
                        bankDetailsPost();
                      }}
                    >
                      {"Submit"}
                    </Button>
                  </div>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        className="dialog_container"
        keepMounted
        disableEscapeKeyDown={true}
        disableEnforceFocus
        disableScrollLock
        disablePortal
        disableAutoFocus
      >
        <DialogContent className="dialog_content">
          <DialogTitle>{t("Payment_processing...")}</DialogTitle>
        </DialogContent>
      </Dialog>

      <div className="submitCancelBtnDiv">
        {manual == 0 ? (
          <button
            id="reviewCancelBtnId"
            onClick={() => {
              History(PATHS.ORGSELECTPLAN);
            }}
            className="logOutNoBtn"
          >
            {t("Cancel")}
          </button>
        ) : null}
        {manual == 1 ? (
          <>
            <button
              id="reviewCancelBtnId"
              onClick={() => {
                History(PATHS.ORGSELECTPLAN);
              }}
              className="logOutNoBtn"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={() => handleClickAddUser()}
              id="reviewPurchaseBtnId"
              className="logOutYesBtn"
            >
              {t("Purchase")}
            </button>
          </>
        ) : null}
        {manual == 2 ? (
          <>
            <button
              id="reviewCancelBtnId"
              onClick={() => {
                History(PATHS.ORGSELECTPLAN);
              }}
              className="logOutNoBtn"
            >
              {t("Cancel")}
            </button>
            <button
              id="reviewPurchaseBtnId"
              onClick={() => {
                onclickPaypalRedirection(setpurchaseclick(true));
              }}
              className="logOutYesBtn"
            >
              {t("Next")}
            </button>
          </>
        ) : null}
      </div>
      <Footer />
    </>
  );
};

export default OrgReviewYourSubscription;
