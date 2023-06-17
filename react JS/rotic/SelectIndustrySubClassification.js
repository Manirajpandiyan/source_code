import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import NavigationHeader from "../../components/NavigationHeader";
import Footer from "../../components/Footer";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { MdOutlineNavigateNext } from "react-icons/md";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { useTranslation } from "react-i18next";
import { useOperation } from "../../redux/operations";
import { useDispatch } from "react-redux";
import { orgSessionStorage } from "../../utility/validation";
import { toast } from "react-hot-toast";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";

const SelectIndustrySubClassification = () => {
  const History = useNavigate();
  const { t } = useTranslation();
  const operation = useOperation();
  const dispatch = useDispatch();
  const type = sessionStorage.getItem("type");
  const [classification, setClassification] = useState([]);
  const [classificationFilter, setClassificationFilter] = useState({});
  const [error, setError] = useState("");
  const subscriptionStatus = sessionStorage.getItem("subscriptionStatus");
  const [openUpdation, setOpenUpdation] = useState(false);
  const openSubscriptionUpdation = () => {
    setOpenUpdation(true);
  };

  useEffect(() => {
    const classificationData = orgSessionStorage("classification", "GET");
    if (classification) {
      const data = orgSessionStorage("industry", "GET");
      const dataEdit = getSelectedData(classificationData);
      const value = {};
      classification.forEach((ele) => {
        let industryname = data?.industry.filter(
          (ind) => ind?.classificationId === ele?.classificationId
        )[0]?.classificationName;
        if (value[ele?.classificationId]) {
          value[ele?.classificationId] = [
            ...value[ele?.classificationId],
            {
              ...ele,
              industryname: industryname,
              checkStatus: dataEdit.includes(ele?.subClassificationId),
            },
          ];
        } else {
          value[ele?.classificationId] = [
            {
              ...ele,
              industryname: industryname,
              checkStatus: dataEdit.includes(ele?.subClassificationId),
            },
          ];
        }
      });
      setClassificationFilter({ ...value });
    }
  }, [classification]);

  useEffect(() => {
    let id = "";
    const data = orgSessionStorage("industry", "GET");
    if (data) {
      data?.industry.forEach((ele) => {
        id += `classificationId=${ele?.classificationId}&`;
      });
      id += "page=1&size=5";
      dispatch(operation.user.createOrgSubClassification(id))
        .then((res) => {
          setClassification(res?.data?.data);
        })
        .catch((e) => {
          setError(e?.message);
        });
    }
  }, []);

  const onSelectIndustry = (key, index, value) => {
    classificationFilter[key][index]["checkStatus"] = value;
    setClassificationFilter({ ...classificationFilter });
  };

  const notify = () =>
    toast.error(
      t("Please_select_sub_classification_for_each_industry_classification"),
      {
        duration: 4000,
        position: "top-center",
      }
    );

  const getSelectedData = (data) => {
    if (data) {
      let list = [];
      Object.keys(data).forEach((e) => {
        data?.[e].map((ele) => {
          if (ele?.checkStatus) {
            list.push(ele?.subClassificationId);
          }
        });
      });
      return list;
    }
    return [];
  };

  const getValidation = () => {
    Object.keys(classificationFilter).forEach((e) => {
      let checkcount = 0;
      classificationFilter?.[e].map((ele) => {
        if (ele?.checkStatus) {
          checkcount += 1;
        }
      });
      if (checkcount === 0) {
        throw notify();
      }
    });
  };

  const onSubmit = async () => {
    try {
      await getValidation();
      orgSessionStorage("classification", "SAVE", classificationFilter);
      History(PATHS.CREATEORGSELECTPLAN);
    } catch (e) {
      console.log(e);
    }
  };

  const onChangePlan = async () => {
    setOpenUpdation(false);
    try {
      await getValidation();
      orgSessionStorage("classification", "SAVE", classificationFilter);
      History(PATHS.CREATEORGSELECTPLAN);
    } catch (e) {
      console.log(e);
    }
  };

  const onContinue = async () => {
    setOpenUpdation(false);
    try {
      await getValidation();
      orgSessionStorage("classification", "SAVE", classificationFilter);
      History(PATHS.ORGANISATIONSUMMARY);
    } catch (e) {
      console.log(e);
    }
  };
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
    <Typography key="4" color="text.primary">
      {t("Industrial_Sub_Classification")}
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
      {error == "" ? null : (
        <div
          style={{
            color: "red",
            display: "flex",
            padding: "20px",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          {error}
        </div>
      )}
      {Object.keys(classificationFilter).map((e, i) => (
        <>
          <Grid
            xs={4}
            className="selectIndustryclassificationHeaderDiv"
            key={i}
          >
            {" "}
            <p>{classificationFilter?.[e][0]?.industryname ?? "No Data"}</p>
          </Grid>
          {classificationFilter?.[e].map((ele, index) => (
            <Grid
              container
              className="selectIndustrialclassificationContainer"
              key={index}
            >
              <Grid
                className="selectIndustrialclassificationSubContainer"
                xs={6}
                lg={4}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      id="industryClassificationCheckboxId"
                      checked={ele?.checkStatus}
                      onClick={() => {
                        onSelectIndustry(e, index, !ele?.checkStatus);
                      }}
                    />
                  }
                  label={ele?.subClassificationName}
                />
              </Grid>
            </Grid>
          ))}
        </>
      ))}
      {type != "ADD" && subscriptionStatus === "VERIFIED" ? (
        <Grid xs={4} className="buttonDiv lastBtnUp">
          <button
            id="industryClassificationBackBtnId"
            style={{ marginRight: "10px" }}
            onClick={() => History(PATHS.SELECTINDUSTRYCLASSCIFICATION)}
            className="logOutNoBtn"
          >
            {t("Back")}
          </button>
          {error == "" ? (
            <button
              id="industryClassificationNextBtnId"
              className="logOutYesBtn"
              onClick={() => openSubscriptionUpdation()}
            >
              {t("Next")}
            </button>
          ) : (
            <button
              id="industryClassificationNextBtnId"
              disabled
              className="logOutYesBtn"
            >
              {t("Next")}
            </button>
          )}
        </Grid>
      ) : (
        <Grid xs={4} className="buttonDiv lastBtnUp">
          <button
            id="industryClassificationBackBtnId"
            style={{ marginRight: "10px" }}
            onClick={() => History(PATHS.SELECTINDUSTRYCLASSCIFICATION)}
            className="logOutNoBtn"
          >
            {t("Back")}
          </button>
          {error == "" ? (
            <button
              id="industryClassificationNextBtnId"
              className="logOutYesBtn"
              onClick={() => {
                onSubmit();
              }}
            >
              {t("Next")}
            </button>
          ) : (
            <button
              id="industryClassificationNextBtnId"
              disabled
              className="logOutYesBtn"
            >
              {t("Next")}
            </button>
          )}
        </Grid>
      )}
      <Dialog
        open={openUpdation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("Do_you_want_to_change_subscription_plan")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onChangePlan();
            }}
            id="deleteUserCancelBtnId"
          >
            {t("Yes")}
          </Button>
          <Button
            onClick={() => {
              onContinue();
            }}
            id="deleteUserDeleteBtnId"
          >
            {t("No")}
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
};

export default SelectIndustrySubClassification;
