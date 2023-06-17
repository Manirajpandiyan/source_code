import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import Grid from "@mui/material/Grid";
import { MdOutlineArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import "../Style.css";
import { useDispatch } from "react-redux";
import "../orgadmin/OrgAdmin.css";
import { useOperation } from "../../redux/operations";
import toast from "react-hot-toast";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useTranslation } from "react-i18next";
import Link from "@mui/material/Link";
import { MdOutlineNavigateNext } from "react-icons/md";
import {
  orgSessionStorage,
  orgSessionStorageEdit,
} from "../../utility/validation";
import Typography from "@mui/material/Typography";
import { PATHS } from "../../routes";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
import "./CreateOrgSelectPlan.css";

const CreateOrgSelectPlan = () => {
  const History = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const operation = useOperation();
  const type = sessionStorage.getItem("type");
  const [page, setPage] = useState(1);
  const [totalNumberOfPage, setTotalNumberOfPage] = useState("");
  const [planData, setPlanData] = useState([]);
  const [savePlan, setSavePlan] = useState({});

  const breadcrumbs = [
    <Link
      underline="hover"
      id="selectIndustrialSubClassificationBreadcrumbId1"
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
      id="selectIndustrialSubClassificationBreadcrumbId2"
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
      id="selectIndustrialSubClassificationBreadcrumbId3"
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
      id="selectIndustrialSubClassificationBreadcrumbId3"
      key="3"
      color="inherit"
      onClick={() => {
        History(PATHS.SELECTINDUSTRYSUBCLASSCIFICATION);
      }}
    >
      {t("Industrial_Sub_Classification")}
    </Link>,
    <Typography key="4" color="text.primary">
      {t("Select_Plan")}
    </Typography>,
  ];

  useEffect(() => {
    dispatch(
      operation.user.SelectPlan({
        pageSize: 3,
        pageNumber: page,
        subscriptionType: "TRIAL",
        status: "ACTIVE",
      })
    ).then((res) => {
      setPlanData(res?.data?.data?.subscription);
      setTotalNumberOfPage(res?.data?.data?.totalNoOfPages);
    });
  }, []);

  useEffect(() => {
    getAPIData();
  }, []);

  useEffect(() => {
    if (planData) {
      const data = orgSessionStorage("plan", "GET");
      const dataEdit = orgSessionStorageEdit("orgEdit")?.subscriptionId ?? null;
      if (data) {
        setSavePlan({ ...data });
      } else if (dataEdit) {
        planData.forEach((ele) => {
          if (ele?.subscriptionId === dataEdit) {
            setSavePlan({ ...ele });
          }
        });
      }
    }
  }, [planData]);

  const getAPIData = () => {
    setPage(page);
    dispatch(
      operation.user.SelectPlan({
        pageSize: 3,
        pageNumber: page,
        subscriptionType: "TRIAL",
        status: "ACTIVE",
      })
    ).then((res) => {
      setPlanData(res?.data?.data?.subscription);
    });
  };
  const onSelectPlan = (data) => {
    setSavePlan(data);
  };
  const notify = () =>
    toast.error(t("Please_select_subscription_plan"), {
      duration: 4000,
      position: "top-center",
    });
  const onSubmit = () => {
    if (!isEmpty(savePlan)) {
      orgSessionStorage("plan", "SAVE", savePlan);
      History(PATHS.ORGANISATIONSUMMARY);
    } else {
      notify();
    }
  };

  const onPressNextButton = () => {
    setPage(page + 1);
    dispatch(
      operation.user.SelectPlan({
        pageSize: 3,
        pageNumber: page + 1,
        subscriptionType: "TRIAL",
        status: "ACTIVE",
      })
    ).then((res) => {
      setPlanData(res?.data?.data?.subscription);
    });
  };

  const onpresspreviousbutton = () => {
    setPage(page - 1);
    dispatch(
      operation.user.SelectPlan({
        pageSize: 3,
        pageNumber: page - 1,
        subscriptionType: "TRIAL",
        status: "ACTIVE",
      })
    ).then((res) => {
      setPlanData(res?.data?.data?.subscription);
    });
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
      <div className="mainContainer">
        <Grid xs={12} container>
          <Grid xs={1}></Grid>
          <Grid xs={1} style={{ justifyContent: "end" }} className="arrowIcons">
            {page === 1 ? null : (
              <MdOutlineArrowBackIos
                style={{ cursor: "pointer" }}
                onClick={() => onpresspreviousbutton()}
                size={30}
              />
            )}
          </Grid>
          <Grid container xs={8} className="planContainer">
            {planData?.map((ele) => {
              return (
                <div
                  key={ele?.subscriptionId}
                  style={{
                    background:
                      ele?.subscriptionId === savePlan?.subscriptionId
                        ? "#A5DB01"
                        : "#67b7e3",
                    color:
                      ele?.subscriptionId === savePlan?.subscriptionId
                        ? "#000000"
                        : "#FFFFFF",
                  }}
                  className="planGrid-1"
                >
                  <Grid>
                    <h2 className="createOrgSelectPlanTitle">
                      {ele?.planName}
                    </h2>
                  </Grid>
                  <Grid>
                    <h4>
                      {t("Max_No_of_Users")}: {ele?.maxUsers}
                    </h4>
                  </Grid>
                  <Grid>
                    <h4>
                      {t("Cost")}: ¥ {ele?.amount}
                    </h4>
                  </Grid>
                  <Grid>
                    <h4>
                      {t("Validity")}: {ele?.validity}
                    </h4>
                  </Grid>
                  <Grid>
                    <div
                      className="addUserButton"
                      onClick={() => {
                        onSelectPlan(ele);
                      }}
                    >
                      <div>{t("Select")}</div>
                    </div>
                  </Grid>
                </div>
              );
            })}
          </Grid>
          <Grid
            xs={1}
            style={{ justifyContent: "start" }}
            className="arrowIcons"
          >
            {totalNumberOfPage === page || totalNumberOfPage === 0 ? null : (
              <MdArrowForwardIos
                style={{ cursor: "pointer" }}
                onClick={() => onPressNextButton()}
                size={30}
              />
            )}
          </Grid>
          <Grid xs={1}></Grid>
          <Grid xs={12} className="buttonDiv" style={{ marginTop: "30px" }}>
            <button
              id="industryClassificationBackBtnId"
              style={{ marginRight: "10px" }}
              onClick={() => {
                History(PATHS.SELECTINDUSTRYSUBCLASSCIFICATION);
              }}
              className="logOutNoBtn"
            >
              {t("Back")}
            </button>
            <button
              id="industryClassificationNextBtnId"
              className="logOutYesBtn"
              onClick={() => {
                onSubmit();
              }}
            >
              {t("Next")}
            </button>
          </Grid>
        </Grid>
      </div>
      <Footer />
    </>
  );
};

export default CreateOrgSelectPlan;
