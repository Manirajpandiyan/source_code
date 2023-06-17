import * as React from "react";
import Grid from "@mui/material/Grid";
import { MdModeEdit, MdDelete } from "react-icons/md";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import "./PlatformAdmin.css";
import "../Style.css";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { AiFillFilter } from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
import DateField from "../../components/DateField";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useOperation } from "../../redux/operations";
import { useDispatch, useSelector } from "react-redux";
import PaginationWithRows from "../../components/PaginationWithRows";
import { toast } from "react-hot-toast";
import moment from "moment";
import { useLocation } from "react-router-dom";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
} from "react-icons/hi";
import NativeSelect from "@mui/material/NativeSelect";

function SubscriptionManagement() {
  const { t } = useTranslation();
  const History = useNavigate();
  const Location = useLocation();
  const [OpenPlanDelete, setOpenPlanDelete] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [delSubId, setDelSubId] = useState("");
  const [delPlanName, setDelPlanName] = useState("");
  const [filterReset, setFilterReset] = useState(false);
  const operation = useOperation();
  const dispatch = useDispatch();
  const planList = useSelector((state) => state.user.subscription);
  const [page, setPage] = useState(1);
  const [totalNoPages, setTotalNoPages] = useState();
  const [recordsPerPages, setRecordsPerPages] = useState();
  const subScripitonFilter = useSelector(
    (state) => state.user.getSubFilter?.data
  );
  const [sortBy, setSortBy] = useState({ sortBy: "PLAN_NAME", order: "DESC" });
  const [pageSize, setPageSize] = useState(5);
  const [pageuseeffect, setPageUseEffect] = useState(false);

  const handleClickOpenPlanDelete = (subId, planName) => {
    setOpenPlanDelete(true);
    setDelSubId(subId);
    setDelPlanName(planName);
  };
  const handleClickFilterOpen = () => {
    setOpenFilter(true);
    const SUBSCRIPTION_PAYLOAD = {
      pageNumber: 1,
      pageSize: 100,
    };

    dispatch(operation.user.getSubFilter(SUBSCRIPTION_PAYLOAD));
  };
  const onChangePageAddEdit = (type, editSubId, page) => {
    History(PATHS.ADDSUBSCRIPTIONPLAN, {
      state: { type: type, id: editSubId, page: page },
    });
  };

  const [filter, setFilter] = useState({
    subscriptionId: "",
    validity: "",
    subscriptionType: "",
    visibility: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  React.useEffect(() => {
    setPage(Location.state?.pageNo ? Location.state?.pageNo : 1);
    let SUBSCRIPTION_PAYLOAD = {
      ...sortBy,
      pageNumber: Location.state?.pageNo ? Location.state?.pageNo : 1,
      pageSize: pageSize,
    };
    const LocalFilter = JSON.parse(localStorage.getItem("Filter"));

    if (LocalFilter) {
      setFilter(LocalFilter);
      localStorage.removeItem("Filter");
      if (
        LocalFilter?.endDate != "" ||
        LocalFilter?.visibility != "" ||
        LocalFilter?.validity != "" ||
        LocalFilter?.subscriptionType != "" ||
        LocalFilter?.subscriptionId != "" ||
        LocalFilter?.status != ""
      ) {
        setFilterReset(true);
      }

      SUBSCRIPTION_PAYLOAD = {
        ...SUBSCRIPTION_PAYLOAD,
        ...LocalFilter,
      };
    }
    {
      pageuseeffect != false
        ? dispatch(operation.user.subscription(SUBSCRIPTION_PAYLOAD)).then(
            (res) => {
              setTotalNoPages(res?.data?.data.totalNoOfPages);
              setRecordsPerPages(res?.data?.data.totalNoOfRecords);
            }
          )
        : null;
    }
  }, [Location.state?.pageNo, pageSize]);

  React.useEffect(() => {
    setPage(Location.state?.pageNo ? Location.state?.pageNo : 1);
    const SUBSCRIPTION_PAYLOAD = {
      ...sortBy,
      pageNumber: Location.state?.pageNo ? Location.state?.pageNo : 1,
      pageSize: pageSize,
      ...filter,
    };

    dispatch(operation.user.subscription(SUBSCRIPTION_PAYLOAD)).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
    });
  }, [pageSize]);

  const handleFilterBtn = () => {
    setPage(1);
    setFilterReset(true);
    const SUBSCRIPTION_PAYLOAD = {
      ...sortBy,
      pageNumber: 1,
      pageSize: pageSize,
      ...filter,
    };
    dispatch(operation.user.subscription(SUBSCRIPTION_PAYLOAD)).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
    });
    setOpenFilter(false);
  };

  const handleResetBtn = () => {
    setPage(1);
    setPageSize(pageSize);
    setFilterReset(false);
    setFilter({
      subscriptionId: "",
      validity: "",
      subscriptionType: "",
      visibility: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    const SUBSCRIPTION_PAYLOAD = {
      pageNumber: 1,
      pageSize: pageSize,
      ...sortBy,
    };
    dispatch(operation.user.subscription(SUBSCRIPTION_PAYLOAD)).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
    });
  };

  //DELETE SUBSCRIPTION
  const onClickDelSub = (id) => {
    dispatch(operation.user.deleteSubPlan(`/subscription/${id}`))
      .then((res) => {
        toast.success(res?.data?.message);
        setOpenPlanDelete(false);
        const SUBSCRIPTION_PAYLOAD = {
          ...sortBy,
          pageNumber: page,
          pageSize: pageSize,
          ...filter,
        };
        dispatch(operation.user.subscription(SUBSCRIPTION_PAYLOAD)).then(
          (res) => {
            setTotalNoPages(res?.data?.data.totalNoOfPages);
            setRecordsPerPages(res?.data?.data.totalNoOfRecords);
          }
        );
      })
      .catch(() => {});
  };

  const handleChange = function (event, value) {
    setPage(value);
    const SUBSCRIPTION_PAYLOAD = {
      ...sortBy,
      pageNumber: value,
      pageSize: pageSize,
      ...filter,
    };
    dispatch(operation.user.subscription(SUBSCRIPTION_PAYLOAD)).then((res) => {
      setTotalNoPages(res?.data?.data.totalNoOfPages);
      setRecordsPerPages(res?.data?.data.totalNoOfRecords);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  };
  //SORTING
  const onClickSort = (sort, type) => {
    setSortBy({
      sortBy: sort,
      order: type,
    });
    const ASC_SUBSCRIPTION_PAYLOAD = {
      sortBy: sort,
      order: type,
      pageNumber: page,
      pageSize: pageSize,
      ...filter,
    };
    dispatch(operation.user.subscription(ASC_SUBSCRIPTION_PAYLOAD)).then(
      (res) => {
        setTotalNoPages(res?.data?.data.totalNoOfPages);
        setRecordsPerPages(res?.data?.data.totalNoOfRecords);
      }
    );
  };

  return (
    <>
      <Header />
      <NavigationHeader />
      <div className="tableHeaderActionContainer">
        <div className="tableHeaderActionDiv">
          <div
            className="addUserButton"
            id="subManagementFilterBtnId"
            onClick={() => handleClickFilterOpen()}
          >
            {" "}
            <AiFillFilter style={{ margin: "5px" }} size={20} />
            <div className="btnText">{t("Filter")}</div>
          </div>
          {filterReset == true ? (
            <div
              className="addUserButton"
              style={{ backgroundColor: "crimson" }}
              id="subManagementResetBtn"
              onClick={() => {
                handleResetBtn();
              }}
            >
              <BiReset style={{ margin: "5px" }} size={20} />
              <div className="btnText">{t("Reset")}</div>
            </div>
          ) : null}
          <div
            className="addOrgButton"
            id="subManagementAddSubId"
            onClick={() => {
              onChangePageAddEdit("ADD");
            }}
          >
            <MdOutlineCreateNewFolder style={{ margin: "5px" }} size={20} />
            <div className="btnText">{t("Create_Plan")}</div>
          </div>
        </div>
      </div>
      {/* Filter Dialaog Box */}
      <Dialog open={openFilter}>
        <DialogTitle>{t("Subscription_Filter")}</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid xs={12}>
              <FormControl
                variant="standard"
                style={{ width: "98%", marginTop: "20px" }}
              >
                <InputLabel id="subManagementFilterPlanNameId">
                  {t("Plan_Name")}
                </InputLabel>
                <NativeSelect
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      subscriptionId: e.target.value,
                    });
                  }}
                  value={filter.subscriptionId}
                  id="subManagementFilterSelectId"
                >
                  <option diabled selected hidden>
                    {t("---select---")}
                  </option>
                  {subScripitonFilter?.subscription
                    ?.filter(
                      (value, index, self) =>
                        index ===
                        self.findIndex(
                          (t) => t.subscriptionId === value.subscriptionId
                        )
                    )
                    .map((name) => {
                      return (
                        <option
                          key={name}
                          value={name?.subscriptionId}
                          id="orgMgtOrgNameFilterId"
                        >
                          {name?.planName}
                        </option>
                      );
                    })}
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl
                variant="standard"
                style={{ width: "98%", marginTop: "20px" }}
              >
                <InputLabel id="subManagementFilterValidityId">
                  {t("Validity_in_days")}
                </InputLabel>
                <NativeSelect
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      validity: e.target.value,
                    });
                  }}
                  value={filter.validity}
                  id="subManagementFilterValiditySelectId"
                >
                  <option diabled selected hidden>
                    {t("---select---")}
                  </option>
                  <option value="30" id="subManagementPlatinumId">
                    30
                  </option>
                  <option value="90" id="subManagemntSilberId">
                    90
                  </option>
                  <option value="180" id="subManagemntSilberId">
                    180
                  </option>
                  <option value="365" id="subManagemntSilberId">
                    365
                  </option>
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <div>
                <FormControl
                  variant="standard"
                  style={{ width: "98%", marginTop: "20px" }}
                >
                  <InputLabel id="subManagementSubTypeId">
                    {t("Subscription_Type")}
                  </InputLabel>
                  <NativeSelect
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        subscriptionType: e.target.value,
                      });
                    }}
                    value={filter.subscriptionType}
                    id="subManagementSelectTypeId"
                  >
                    <option diabled selected hidden>
                      {t("---select---")}
                    </option>
                    <option value="TRIAL" id="subManagementPaidId">
                      {t("Trial")}
                    </option>
                    <option value="PAID" id="subManagementFreeId">
                      {t("Paid")}
                    </option>
                  </NativeSelect>
                </FormControl>
              </div>
            </Grid>
            <Grid xs={12}>
              <div>
                <FormControl
                  variant="standard"
                  style={{ width: "98%", marginTop: "20px" }}
                >
                  <InputLabel id="subManagementVisiblityId">
                    {t("Visiblity")}
                  </InputLabel>
                  <NativeSelect
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        visibility: e.target.value,
                      });
                    }}
                    value={filter.visibility}
                    id="subManagementSelectVisiblityId"
                  >
                    <option diabled selected hidden>
                      {t("---select---")}
                    </option>
                    <option value="ROTIC TEAM" id="subManagementRoticTeamId">
                      {t("Rotic Team")}
                    </option>
                    <option
                      value="ALL ORGANIZATION"
                      id="subManagementAllOrganisationId"
                    >
                      {t("All Organisation")}
                    </option>
                  </NativeSelect>
                </FormControl>
              </div>
            </Grid>
            <Grid xs={12}>
              <div>
                <FormControl
                  variant="standard"
                  style={{ width: "98%", marginTop: "20px" }}
                >
                  <InputLabel id="subManagementstatusId">
                    {t("Status")}
                  </InputLabel>
                  <NativeSelect
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        status: e.target.value,
                      });
                    }}
                    value={filter.status}
                    id="subManagementSelectStatusId"
                  >
                    <option diabled selected hidden>
                      {t("---select---")}
                    </option>
                    <option value="ACTIVE" id="subManagementactiveId">
                      {t("Active")}
                    </option>
                    <option value="INACTIVE" id="subManagementInactiveId">
                      {t("Inactive")}
                    </option>
                    <option value="EXPIRED" id="subManagementInactiveId">
                      {t("Expired")}
                    </option>
                  </NativeSelect>
                </FormControl>
              </div>
            </Grid>
            <Grid xs={12}>
              <DateField
                name={t("Plan_Valid_From")}
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    startDate: e.target.value,
                  });
                }}
                inputProps={{ max: filter?.endDate }}
                value={filter.startDate}
                id="subManagementFilterFromId"
              />
            </Grid>
            <Grid xs={12}>
              <DateField
                name={t("Plan_Valid_Till")}
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    endDate: e.target.value,
                  });
                }}
                inputProps={{ min: filter?.startDate }}
                value={filter.endDate}
                id="subManagementFilterToId"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <div>
            <Button
              color="error"
              style={{ color: "red" }}
              id="subManagementCancelBtnId"
              onClick={() => {
                setOpenFilter(false);
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              id="subManagementAddUserBtnId"
              onClick={() => {
                handleFilterBtn();
              }}
            >
              {t("Apply")}
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      <Grid className="TableGrid">
        <table>
          <thead>
            {planList?.subscription.length <= 1 ||
            planList?.subscription == null ? (
              <tr>
                <th>{t("Plan_Name")}</th>
                <th>{t("Start_Date")}</th>
                <th>{t("End_Date")}</th>
                <th>{t("Validity")}</th>
                <th>{t("Cost")}</th>
                <th>{t("Max_Users")}</th>
                <th>{t("Visiblity")}</th>
                <th>{t("Status")}</th>
                <th>{t("Action")}</th>
              </tr>
            ) : (
              <tr>
                <th>
                  {t("Plan_Name")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("PLAN_NAME", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("PLAN_NAME", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Start_Date")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("START_DATE", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("START_DATE", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("End_Date")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("END_DATE", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("END_DATE", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Validity")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("VALIDITY", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("VALIDITY", "DESC")}
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
                  {t("Max_Users")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("MAX_USERS", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("MAX_USERS", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Visiblity")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("VISIBILITY", "ASC")}
                    />
                  ) : (
                    <HiOutlineArrowNarrowUp
                      onClick={() => onClickSort("VISIBILITY", "DESC")}
                      className="TbHeaderFilter"
                    />
                  )}
                </th>
                <th>
                  {t("Status")}
                  {sortBy?.order == "DESC" ? (
                    <HiOutlineArrowNarrowDown
                      className="TbHeaderFilter"
                      onClick={() => onClickSort("STATUS", "ASC")}
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
          {planList?.subscription.length == 0 ||
          planList?.subscription == null ? (
            <tbody>
              <tr>
                <td
                  style={{ height: "35px" }}
                  data-column={t("Plan_Name")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Start_Date")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("End_Date")}
                ></td>
                <td
                  colSpan={7}
                  style={{
                    borderLeft: "solid white 1px",
                    height: "35px",
                    color: "crimson",
                    fontSize: "18px",
                  }}
                  className="NoDataInMobile"
                  data-column={t("Validity")}
                >
                  {t("No_data_found")}
                </td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Cost")}
                  className="TableLastData"
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Max_Users")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Status")}
                ></td>
                <td
                  style={{ borderLeft: "solid white 1px", height: "35px" }}
                  data-column={t("Action")}
                  className="NodataLast"
                ></td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {planList?.subscription.map(
                ({
                  maxUsers,
                  amount,
                  validity,
                  endDate,
                  startDate,
                  planName,
                  subscriptionId,
                  status,
                  visibility,
                }) => {
                  return (
                    <tr key={subscriptionId}>
                      <td data-column={t("Plan_Name")}>{planName}</td>
                      <td data-column={t("Start_Date")}>
                        {moment(startDate.toLocaleString()).format(
                          "YYYY-MM-DD"
                        )}
                      </td>
                      <td data-column={t("End_Date")}>
                        {moment(endDate.toLocaleString()).format("YYYY-MM-DD")}
                      </td>
                      <td data-column={t("Validity")}>
                        {validity} {t("Days")}
                      </td>
                      <td data-column={t("Cost")}>¥ {amount}</td>
                      <td data-column={t("Max_Users")}>{maxUsers}</td>
                      <td data-column={t("Visiblity")}>
                        {visibility == "ALL ORGANIZATION"
                          ? t("All Organisation")
                          : t("Rotic Team")}
                      </td>
                      <td data-column={t("Status")}>
                        {status === "ACTIVE"
                          ? t("Active")
                          : status === "INACTIVE"
                          ? t("Inactive")
                          : t("Expired")}
                      </td>
                      <td data-column={t("Action")}>
                        {status === "EXPIRED" ? null : (
                          <Tooltip title={t("Edit_Plan")}>
                            <MdModeEdit
                              size={24}
                              id="subscriptionManagementEditIcon"
                              onClick={() => {
                                onChangePageAddEdit(
                                  "EDIT",
                                  subscriptionId,
                                  page,
                                  localStorage.setItem(
                                    "Filter",
                                    JSON.stringify(filter)
                                  )
                                );
                              }}
                              className="tableActionIcon"
                            />
                          </Tooltip>
                        )}
                        <Tooltip title={t("Delete_Plan")}>
                          <MdDelete
                            size={24}
                            id="userManagementDeleteIcon"
                            onClick={() =>
                              handleClickOpenPlanDelete(
                                subscriptionId,
                                planName
                              )
                            }
                            className="tableActionIcon"
                          />
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )}
              {/* DELETE PLAN DIALOG BOX */}
              <Dialog
                open={OpenPlanDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {t("Are_you_sure_you_want_to_delete_this")}{" "}
                    <strong>{delPlanName}</strong>?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    id="subManagementCancelPlanButton"
                    onClick={() => setOpenPlanDelete(false)}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    id="subManagementDeletePlanButton"
                    style={{ color: "red" }}
                    onClick={() => onClickDelSub(delSubId)}
                    color="error"
                  >
                    {t("Delete")}
                  </Button>
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
                    setPageSize(e.target.value, sortBy), setPageUseEffect(true);
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

export default SubscriptionManagement;
