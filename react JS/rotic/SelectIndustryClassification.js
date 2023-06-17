import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NavigationHeader from "../../components/NavigationHeader";
import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { Grid } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { MdOutlineNavigateNext } from "react-icons/md";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { useTranslation } from "react-i18next";
import { useOperation } from "../../redux/operations";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { orgSessionStorage } from "../../utility/validation";
import { toast } from "react-hot-toast";

const SelectIndustryClassification = () => {
  const History = useNavigate();
  const { t } = useTranslation();
  const operation = useOperation();
  const dispatch = useDispatch();
  const [response, setResponse] = useState([]);
  const type = sessionStorage.getItem("type");
  const [industry, setIndustry] = useState([]);
  const [industryData, setIndustryData] = useState([]);

  useEffect(() => {
    const INDUSTRY_CLASSIFICATION_PAYLOAD = {
      status: "ACTIVE",
      page: 1,
      size: 100,
    };
    dispatch(
      operation.user.getIndustryClassification(INDUSTRY_CLASSIFICATION_PAYLOAD)
    )
      .then((res) => {
        setResponse(res?.data?.data?.industryClassificationlsList);
      })
      .catch(() => {});

    const data = orgSessionStorage("industry", "GET");
    if (data) {
      let list = [];
      data?.industry.forEach((ele) => {
        list.push(ele?.classificationId);
      });
      setIndustryData([...data.industry] ?? []);
      setIndustry([...list]);
    }
  }, []);

  const notify = () =>
    toast.error(t("Please_select_Industry_Classification"), {
      duration: 4000,
      position: "top-center",
    });

  const onSubmit = () => {
    if (!isEmpty(industry)) {
      orgSessionStorage("industry", "SAVE", { industry: industryData });
      History(PATHS.SELECTINDUSTRYSUBCLASSCIFICATION);
    } else {
      notify();
    }
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      id="selectIndustrialClassificationBreadcrumbId1"
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
      id="selectIndustrialClassificationBreadcrumbId2"
      key="2"
      color="inherit"
      onClick={() => {
        History(PATHS.ADDORG);
      }}
    >
      {type === "ADD" ? t("Add_Organisation") : t("Edit_Organisation")}
    </Link>,
    <Typography underline="hover" key="3" color="text.primary" href="/">
      {t("Industrial_Classification")}
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
        {response && (
          <Grid
            className="selectIndustrialclassificationSubContainer"
            style={{
              display: "grid",
              padding: "10px 0px 0px 20px",
              height: "100%",
            }}
            xs={6}
            lg={4}
          >
            {response
              ?.filter((ele) => ele.status != "INACTIVE")
              .map((ele, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={industry.includes(ele?.classificationId)}
                      onClick={() => {
                        if (!industry.includes(ele?.classificationId)) {
                          setIndustry([...industry, ele?.classificationId]);
                          setIndustryData([...industryData, ele]);
                        } else {
                          const i = industry.indexOf(ele?.classificationId);
                          industry.splice(i, 1);
                          industryData.splice(i, 1);
                          setIndustry([...industry]);
                          setIndustryData([...industryData]);
                        }
                      }}
                    />
                  }
                  label={ele?.classificationName}
                />
              ))}
          </Grid>
        )}
      </Grid>
      <Grid xs={12} className="buttonDiv lastBtnUp">
        <button
          id="industryClassificationBackBtnId"
          style={{ marginRight: "10px" }}
          onClick={() => History(PATHS.ADDORG)}
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
      <Footer />
    </>
  );
};

export default SelectIndustryClassification;
