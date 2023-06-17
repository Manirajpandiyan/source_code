import React, { useEffect } from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import { MdRemoveRedEye } from "react-icons/md";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import "./PlatformAdmin.css";
import "../Style.css";
import {
  MdOutlineCancel,
  MdOutlineCheckCircle,
  MdOutlineNavigateNext,
} from "react-icons/md";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { PATHS } from "../../routes";
import { useNavigate } from "react-router-dom";
import DialogContent from "@mui/material/DialogContent";
import ReadOnlyField from "../../components/ReadOnlyField";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ReadOnlyTextArea from "../../components/ReadOnlyTextArea";
import TextArea from "../../components/TextArea";
import DateField from "../../components/DateField";
import { AiFillFilter } from "react-icons/ai";
import Typography from "@mui/material/Typography";
import { BiReset } from "react-icons/bi";
import NativeSelect from "@mui/material/NativeSelect";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useOperation } from "../../redux/operations";
import { useDispatch } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
import moment from "moment";
import { toast } from "react-hot-toast";
import PaginationWithRows from "../../components/PaginationWithRows";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
} from "react-icons/hi";

function ManualPayment() {
  const History = useNavigate();
  const { t } = useTranslation();
  const [openViewPayment, setOpenViewPayment] = useState(false);
  const [openCancelPayment, setOpenCancelPayment] = useState(false);
  const [filterPayment, setFilterPayment] = useState(false);
  const [manualPayment, setmanualPayment] = useState([]);
  const [viewManualPayment, setViewManualPayment] = useState("");
  const [cancelOrgName, setCancelOrgName] = useState("");
  const [cancelSubName, setCancelSubName] = useState("");
  const [cancelPurchaseDate, setCancelPurchaseDate] = useState("");
  const [cancelTransactionNum, setCancelTransactionNum] = useState("");
  const [cancelCost, setCancelCost] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelPayId, setCancelPayId] = useState("");
  const [filterReset, setFilterReset] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const operation = useOperation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [totalNoPages, setTotalNoPages] = useState();
  const [recordsPerPages, setRecordsPerPages] = useState();
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState({ sortBy: "ORG_NAME", order: "DESC" });
  const [pageuseeffect, setPageUseEffect] = useState(false);

  const [filter, setFilter] = useState({
    subscriptionFromDate: moment(new Date().toLocaleDateString("en-US"))
      .subtract(7, "d")
      .format("YYYY-MM-DD"),
    subscriptionToDate: moment(new Date().toLocaleDateString("en-US")).format(
      "YYYY-MM-DD"
    ),
  });
  useEffect(() => {
    const MANUAL_PAYMENT_PAYLOAD = {
      ...sortBy,
      pageNumber: page,
      pageSize: pageSize,
      ...filter,
    };
    dispatch(operation.user.getManualPayment(MANUAL_PAYMENT_PAYLOAD))
      .then((res) => {
        setmanualPayment(res?.data?.data?.orgPaymentDetailsList);
        setTotalNoPages(res?.data?.data.totalNoOfPages);
        setRecordsPerPages(res?.data?.data.totalNoOfRecords);
        console.log(setmanualPayment);
      })
      .catch((err) => {
        console.log("error", err);
      });
  }, []);

  const onClickSort = (sort, type) => {
    setSortBy({
      sortBy: sort,
      order: type,
    });
    const ASC_ORGS_PAYLOAD = {
      sortBy: sort,
      order: type,
      pageNumber: page,
      pageSize: pageSize,
      ...filter,
    };
    dispatch(operation.user.getManualPayment(ASC_ORGS_PAYLOAD)).then((res) => {
      setmanualPayment(res?.data?.data?.orgPaymentDetailsList);
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
      console.log(setmanualPayment);
    });
  };

  useEffect(() => {
    setPage(1);
    const MANUAL_PAYMENT_PAYLOAD = {
      ...sortBy,
      pageNumber: 1,
      pageSize: pageSize,
      ...filter,
    };
    {
      pageuseeffect == true &&
        dispatch(operation.user.getManualPayment(MANUAL_PAYMENT_PAYLOAD))
          .then((res) => {
            setmanualPayment(res?.data?.data?.orgPaymentDetailsList);
            setTotalNoPages(res?.data?.data.totalNoOfPages);
            setRecordsPerPages(res?.data?.data.totalNoOfRecords);
            console.log(setmanualPayment);
          })
          .catch((err) => {
            console.log("error", err);
          });
    }
  }, [pageSize]);

  //FILTER ONCLICK
  const onClickFilterBtn = () => {
    setFilterReset(true);
    const MANUAL_PAYMENT_PAYLOAD = {
      ...filter,
      pageNumber: page,
      pageSize: pageSize,
      sortBy: "ORG_NAME",
      order: "DESC",
    };
    dispatch(operation.user.getManualPayment(MANUAL_PAYMENT_PAYLOAD))
      .then((res) => {
        setFilterPayment(false),
          setmanualPayment(res?.data?.data?.orgPaymentDetailsList);
        setTotalNoPages(res?.data?.data.totalNoOfPages);
        setRecordsPerPages(res?.data?.data.totalNoOfRecords);
      })
      .catch((e) => console.log(e));
  };
  //RESET BUTTON ONCLICK
  const handleClickResetBtn = () => {
    setPage(1);
    setFilter({
      subscriptionFromDate: moment(new Date().toLocaleDateString("en-US"))
        .subtract(7, "d")
        .format("YYYY-MM-DD"),
      subscriptionToDate: moment(new Date().toLocaleDateString("en-US")).format(
        "YYYY-MM-DD"
      ),
    });
    setFilterReset(false);
    const MANUAL_PAYMENT_PAYLOAD = {
      sortBy: "ORG_NAME",
      order: "DESC",
      pageNumber: 1,
      pageSize: pageSize,
      subscriptionFromDate: moment(new Date().toLocaleDateString("en-US"))
        .subtract(7, "d")
        .format("YYYY-MM-DD"),
      subscriptionToDate: moment(new Date().toLocaleDateString("en-US")).format(
        "YYYY-MM-DD"
      ),
    };
    dispatch(operation.user.getManualPayment(MANUAL_PAYMENT_PAYLOAD))
      .then((res) => {
        console.log(res),
          setmanualPayment(res?.data?.data?.orgPaymentDetailsList);
        setTotalNoPages(res?.data?.data.totalNoOfPages);
        setRecordsPerPages(res?.data?.data.totalNoOfRecords);
      })
      .catch((e) => console.log(e));
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      onClick={() => History(PATHS.ORGANISATIONMANAGEMENT)}
    >
      {t("Organisation_Management")}
    </Link>,
    <Typography key="4" color="text.primary">
      {t("Manual_Payment")}
    </Typography>,
  ];

  const handleClickViewManualPayment = (payID) => {
    dispatch(operation.user.viewManualPayment(`/payment/${payID}`))
      .then((res) => {
        console.log(res), setViewManualPayment(res?.data?.data);
        const MANUAL_PAYMENT_PAYLOAD = {
          pageNumber: page,
          pageSize: pageSize,
          sortBy: "ORG_NAME",
          order: "DESC",
          ...filter,
        };
        dispatch(operation.user.getManualPayment(MANUAL_PAYMENT_PAYLOAD))
          .then((res) => {
            setmanualPayment(res?.data?.data?.orgPaymentDetailsList);
            setTotalNoPages(res?.data?.data.totalNoOfPages);
            setRecordsPerPages(res?.data?.data.totalNoOfRecords);
          })
          .catch((err) => {
            console.log("error", err);
          });
      })
      .catch((e) => console.log(e));
    setOpenViewPayment(true);
  };

  //ON APPROVE MANUAL PAYMENT:
  const onApproveManualPayment = (payID) => {
    const APPROVE_MANUAL_PAYMENT_PAYLOAD = {
      status: "APPROVED",
    };
    dispatch(
      operation.user.patchManualPayment({
        url: `/payment/${payID}`,
        params: APPROVE_MANUAL_PAYMENT_PAYLOAD,
      })
    )
      .then((res) => {
        console.log(res);
        toast.success(res?.data?.message);
        const MANUAL_PAYMENT_PAYLOAD = {
          pageNumber: page,
          pageSize: pageSize,
          sortBy: "ORG_NAME",
          order: "DESC",
          ...filter,
        };
        dispatch(operation.user.getManualPayment(MANUAL_PAYMENT_PAYLOAD)).then(
          (res) => {
            console.log("RES", res);

            setmanualPayment(res?.data?.data?.orgPaymentDetailsList);
            setTotalNoPages(res?.data?.data.totalNoOfPages);
            setRecordsPerPages(res?.data?.data.totalNoOfRecords);
          }
        );
      })
      .catch((e) => console.log(e));
  };

  const handelClickCancelManualPayment = (payId) => {
    setCancelPayId(payId);

    setOpenCancelPayment(true);
    dispatch(operation.user.viewManualPayment(`/payment/${payId}`))
      .then((res) => {
        setCancelOrgName(res?.data?.data?.orgName),
          setCancelSubName(res?.data?.data?.subscriptionName),
          setCancelTransactionNum(res?.data?.data?.paymentRefId),
          setCancelPurchaseDate(res.data.data.purchaseDate),
          setCancelCost(res.data.data.cost),
          setCancelReason(res.data.data.rejectionReason);
      })
      .catch((e) => console.log(e));
  };

  //CANCEL BTN MANUAL PAYMENT
  const clearCancelManualPaymentData = () => {
    setCancelReason("");
  };
  const onClickRejectBtn = () => {
    const CANCEL_MANUAL_PAYMENT_PAYLOAD = {
      status: "REJECTED",
      rejectionReason: cancelReason,
    };
    dispatch(
      operation.user.patchManualPayment({
        url: `/payment/${cancelPayId}`,
        params: CANCEL_MANUAL_PAYMENT_PAYLOAD,
      })
    )
      .then((res) => {
        console.log(res),
          toast.success(res?.data?.message),
          setOpenCancelPayment(false),
          clearCancelManualPaymentData();
        const MANUAL_PAYMENT_PAYLOAD = {
          pageNumber: page,
          pageSize: pageSize,
          sortBy: "ORG_NAME",
          order: "DESC",
          ...filter,
        };
        dispatch(operation.user.getManualPayment(MANUAL_PAYMENT_PAYLOAD)).then(
          (res) => {
            setmanualPayment(res?.data?.data?.orgPaymentDetailsList);
            setCancelError("");
          }
        );
      })
      .catch((e) => {
        console.log(e);
        setCancelError(e?.data);
      });
  };
  const handelClickFilterManualPayment = () => {
    setFilterPayment(true);
  };

  const handleChange = (event, value) => {
    setPage(value);
    const MANUAL_PAYMENT_PAYLOAD = {
      ...sortBy,
      pageNumber: value,
      pageSize: pageSize,
      ...filter,
    };
    dispatch(operation.user.getManualPayment(MANUAL_PAYMENT_PAYLOAD)).then(
      (res) => {
        setmanualPayment(res?.data?.data?.orgPaymentDetailsList);
        setTotalNoPages(res?.data?.data.totalNoOfPages);
        setRecordsPerPages(res?.data?.data.totalNoOfRecords);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        console.log(setmanualPayment);
      }
    );
  };

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
      <div className="tableHeaderActionContainer">
        <div className="tableHeaderActionDiv">
          <div
            className="addUserButton"
            id="manualPaymentFilterBtnId"
            onClick={() => handelClickFilterManualPayment()}
          >
            <AiFillFilter style={{ margin: "5px" }} size={20} />{" "}
            <div className="btnText">{t("Filter")}</div>
          </div>
          {filterReset == true ? (
            <div
              id="manualPaymentResetBtnId"
              style={{ backgroundColor: "crimson" }}
              className="addUserButton"
              onClick={() => handleClickResetBtn()}
            >
              <BiReset style={{ margin: "5px" }} size={20} />
              <div className="btnText">{t("Reset")}</div>
            </div>
          ) : null}
        </div>
      </div>
      <Dialog open={filterPayment}>
        <DialogTitle>{t("Manual_Payment_Filter")}</DialogTitle>

        <DialogContent>
          <Grid container>
            <Grid xs={12}>
              <DateField
                name={t("From")}
                id="startDate"
                value={filter?.subscriptionFromDate}
                inputProps={{ max: filter?.subscriptionToDate }}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    subscriptionFromDate: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid xs={12}>
              <DateField
                name={t("To")}
                id="endDate"
                value={filter?.subscriptionToDate}
                inputProps={{
                  min: filter?.subscriptionFromDate,
                  max: moment(new Date().toLocaleDateString("en-US")).format(
                    "YYYY-MM-DD"
                  ),
                }}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    subscriptionToDate: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="cancelFilterManualPaymentId"
            style={{ color: "red" }}
            onClick={() => {
              setFilterPayment(false);
            }}
            color="error"
          >
            {t("Cancel")}
          </Button>
          <Button
            id="applyFilterManualPaymentId"
            onClick={() => {
              onClickFilterBtn();
            }}
          >
            {t("Apply")}
          </Button>
        </DialogActions>
      </Dialog>
      <Grid className="TableGrid">
        <table>
          <thead>
            {manualPayment?.length == 0 || manualPayment == null ? (
              <tr>
                <th>{t("Organisation_Name")}</th>
                <th>{t("Subscription_Name")}</th>
                <th>{t("Purchased_Date")}</th>
                <th>{t("Transaction_Number")}</th>
                <th>{t("Cost")}</th>
                <th>{t("Status")}</th>
                <th style={{ textAlign: "center", paddingLeft: "65px" }}>
                  {t("Action")}
                </th>
              </tr>
            ) : (
              <tr>
                <th>
                  {t("Organisation_Name")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("ORG_NAME", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("ORG_NAME", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Subscription_Name")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("SUBSCRIPTION_NAME", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("SUBSCRIPTION_NAME", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Purchased_Date")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("PURCHASE_DATE", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("PURCHASE_DATE", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Transaction_Number")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("PAYMENT_REF_ID", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("PAYMENT_REF_ID", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Cost")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("AMOUNT", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("AMOUNT", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Status")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("STATUS ", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("STATUS", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>{t("Action")}</th>
              </tr>
            )}
          </thead>
          {manualPayment?.length == 0 || manualPayment == null ? (
            <tbody>
              <tr>
                <td
                  style={{ height: "35px" }}
                  data-column={t("Organisation_Name")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Subscription_Name")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Purchased_Date")}
                ></td>
                <td
                  colSpan={7}
                  style={{
                    borderLeft: "solid white 1px",
                    color: "crimson",
                    fontSize: "18px",
                  }}
                  data-column={t("Transaction_Number")}
                  className="NoDataInMobile"
                >
                  {t("No_data_found")}
                </td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Cost")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Status")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  className="NodataLast"
                  data-column={t("Action")}
                ></td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {manualPayment?.map(
                ({
                  orgName,
                  subscriptionName,
                  purchaseDate,
                  paymentRefId,
                  cost,
                  status,
                  paymentId,
                }) => {
                  return (
                    <tr key={paymentId}>
                      <td data-column={t("Organisation_Name")}>{orgName}</td>
                      <td data-column={t("Subscription_Name")}>
                        {subscriptionName}
                      </td>
                      <td data-column={t("Purchased_Date")}>
                        {moment(purchaseDate.toLocaleString()).format(
                          "YYYY-MM-DD"
                        )}
                      </td>
                      <td data-column={t("Transaction_Number")}>
                        {paymentRefId}
                      </td>
                      <td data-column={t("Cost")}>{cost}</td>
                      <td data-column={t("Status")}>
                        {status == "PENDING"
                          ? t("Pending")
                          : status == "REJECTED"
                          ? t("Rejected")
                          : t("Approved")}
                      </td>
                      <td data-column={t("Action")}>
                        {status == "PENDING" ? (
                          <>
                            <Tooltip title={t("Accept_Payment")}>
                              <MdOutlineCheckCircle
                                size={24}
                                id="manualPaymentCheckIcon"
                                className="tableActionIcon"
                                onClick={() =>
                                  onApproveManualPayment(paymentId)
                                }
                                style={{ marginRight: "20px", color: "green" }}
                              />
                            </Tooltip>
                            <Tooltip title={t("Cancel_Payment")}>
                              <MdOutlineCancel
                                size={24}
                                id="manualPaymentViewIcon"
                                onClick={() =>
                                  handelClickCancelManualPayment(paymentId)
                                }
                                className="tableActionIcon"
                                style={{ marginRight: "20px", color: "red" }}
                              />
                            </Tooltip>
                            <MdRemoveRedEye
                              size={24}
                              id="manualPaymentViewIcon"
                              className="tableActionIcon tableActionDisableIcon"
                            />
                          </>
                        ) : (
                          <>
                            <MdOutlineCheckCircle
                              size={24}
                              id="manualPaymentCheckIcon"
                              className="tableActionIcon tableActionDisableIcon"
                              style={{ marginRight: "20px" }}
                            />

                            <MdOutlineCancel
                              size={24}
                              id="manualPaymentViewIcon"
                              className="tableActionIcon tableActionDisableIcon"
                              style={{ marginRight: "20px" }}
                            />

                            <Tooltip title={t("View_Payment")}>
                              <MdRemoveRedEye
                                size={24}
                                id="manualPaymentViewIcon"
                                onClick={() =>
                                  handleClickViewManualPayment(paymentId)
                                }
                                className="tableActionIcon"
                              />
                            </Tooltip>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                }
              )}

              {/* FOR VIEW MANUAL PAYMENT */}
              <Dialog open={openViewPayment}>
                <DialogTitle>{t("View_Manual_Payment")}</DialogTitle>

                <DialogContent>
                  <Grid container>
                    <Grid xs={12}>
                      <ReadOnlyField
                        id="viewManualPaymentOrgName"
                        name={t("Organisation_Name")}
                        value={viewManualPayment.orgName}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <ReadOnlyField
                        id="viewManualSubId"
                        name={t("Subscription_Name")}
                        value={viewManualPayment.subscriptionName}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <ReadOnlyField
                        id="viewManualPurchasedDateId"
                        name={t("Purchased_Date")}
                        value={moment(viewManualPayment.purchaseDate).format(
                          "YYYY-MM-DD"
                        )}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <ReadOnlyField
                        id="viewManualTransactionNumber"
                        name={t("Transaction_Number")}
                        value={viewManualPayment.paymentRefId}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <ReadOnlyField
                        id="viewManualCostId"
                        name={t("Cost_1")}
                        value={viewManualPayment.cost}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <ReadOnlyTextArea
                        id="viewManualReasonForRejectionId"
                        name={`${t("Reason_For_Rejection")} ${"*"}`}
                        value={viewManualPayment.rejectionReason}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    id="viweManualPaymentBackBtnId"
                    color="error"
                    style={{ color: "red" }}
                    onClick={() => {
                      setOpenViewPayment(false);
                    }}
                  >
                    {t("Cancel")}
                  </Button>

                  {/* onAddclick() */}
                </DialogActions>
              </Dialog>

              {/* FOR CANCEL MANUAL PAYMENT */}
              <Dialog open={openCancelPayment}>
                <DialogTitle>{t("Payment_Cancellation")}</DialogTitle>

                <DialogContent>
                  <Grid container>
                    <div
                      style={{
                        color: "red",
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      {cancelError?.errorTitle}
                    </div>
                    <Grid xs={12}>
                      <ReadOnlyField
                        id="cancelPaymentOrgNameId"
                        name={t("Organisation_Name")}
                        value={cancelOrgName == null ? "-" : cancelOrgName}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <ReadOnlyField
                        id="cancelPaymentSubNameId"
                        name={t("Subscription_Name")}
                        value={cancelSubName == null ? "-" : cancelSubName}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <ReadOnlyField
                        id="cancelPaymentPurchaseDateId"
                        name={t("Purchased_Date")}
                        value={
                          cancelPurchaseDate == null
                            ? "-"
                            : moment(cancelPurchaseDate).format("YYYY-MM-DD")
                        }
                      />
                    </Grid>
                    <Grid xs={12}>
                      <ReadOnlyField
                        id="cancelPaymentTransactionId"
                        name={t("Transaction_Number")}
                        value={
                          cancelTransactionNum == null
                            ? "-"
                            : cancelTransactionNum
                        }
                      />
                    </Grid>
                    <Grid xs={12}>
                      <ReadOnlyField
                        id="cancelPaymentCostId"
                        name={t("Cost_1")}
                        value={cancelCost == null ? "-" : cancelCost}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <TextArea
                        id="cancelPaymentRejectionId"
                        name={t("Reason_For_Rejection")}
                        value={cancelReason}
                        helperText={`${
                          cancelReason?.length == undefined
                            ? 0
                            : cancelReason?.length
                        }/500`}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                      <div style={{ color: "red" }}>
                        {cancelError?.rejectionReason}
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <div>
                    <Button
                      id="cancelPaymentCancelBtnId"
                      onClick={() => {
                        setOpenCancelPayment(false), setCancelError("");
                      }}
                    >
                      {t("Cancel")}
                    </Button>
                    <Button
                      color="error"
                      style={{ color: "red" }}
                      id="cancelPaymentRejectBtnId"
                      onClick={() => {
                        onClickRejectBtn();
                      }}
                    >
                      {t("Reject")}
                    </Button>
                  </div>
                </DialogActions>
              </Dialog>
            </tbody>
          )}
        </table>
        <div className="LastRowPaginationContainer">
          <div className="LastRowSections">
            {recordsPerPages <= 5 ? null : (
              <FormControl style={{ width: "40%" }}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  {t("Rows_per_page")}
                </InputLabel>
                <NativeSelect
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(e.target.value), setPageUseEffect(true);
                  }}
                  inputProps={{
                    name: "RowsPerPage",
                    id: "uncontrolled-native",
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </NativeSelect>
              </FormControl>
            )}
          </div>
          <div className="LastPaginationSections">
            {recordsPerPages <= pageSize ? null : (
              <PaginationWithRows
                count={totalNoPages}
                onChange={handleChange}
                page={page}
              />
            )}
          </div>
        </div>
      </Grid>
      <Footer />
    </>
  );
}

export default ManualPayment;
