import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "./LandingPage.css";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import logo from "../../images/LOGO.png";
import HIW1 from "../../images/HIW1.png";
import HIW2 from "../../images/HIW2.jpg";
import frame from "../../images/karutawebsite3.png";
import HIW3 from "../../images/HIW3.png";
import paperplane from "../../images/telegram-2.png";
import rocket from "../../images/rocket-2.png";
import plane from "../../images/plane.png";
import IconButton from "@mui/material/IconButton";
import { MdLanguage } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import { BsFacebook } from "react-icons/bs";
import MenuItem from "@mui/material/MenuItem";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Scroll from "react-scroll";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { PATHS } from "routes";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useHistory, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import useInterval from "components/Polling";

import LanguageSelect from "components/LanguageSelectAdmin";

import { fade, withStyles, makeStyles } from "@material-ui/core/styles";

import InputBase from "@material-ui/core/InputBase";

import { actions as websiteActions } from "store/module/WebsiteModule";
import StaticContent from "components/StaticContent";
import splitter from "./Newlinesplit";

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
function ScrollTop(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}
ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};
HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    color: "black",
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 14,
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: ["Noto Sans JP", "sans-serif"].join(","),
    "&:focus": {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  webcontainer: {
    display: "flex",
    flexWrap: "wrap",
  },
  borderinput: {
    margin: theme.spacing(1),
  },
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: "50%",
    width: 16,
    height: 16,
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#3980F6",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
}));

const LandingPage = (props) => {
  var Link = Scroll.Link;
  const ScrollLink = Scroll.ScrollLink;
  const { t } = useTranslation();
  const location = useLocation();
  const [Country, setCountry] = React.useState("1");
  const [page, setpage] = React.useState(1);
  const dispatch = useDispatch();
  const WebsiteState = useSelector((state) => state.website);
  const classes = useStyles();
  const [count, setCount] = useState(0);

  const [testimoniallist, settestimoniallist] = React.useState([]);
  const [eventlist, seteventlist] = React.useState(null);

  const [testimonial_page, settestimonial_page] = React.useState({
    first: 0,
    second: 1,
  });
  const [event_page, setevent_page] = React.useState({ first: 0, second: 1 });
  const [orderedSubscriptionPlanList, setOrderedSubscriptionPlanList] =
    React.useState([{}]);
  const History = useHistory();

  const isTestimonialPreview = localStorage.getItem("isPreviewingTestimonial")
    ? localStorage.getItem("isPreviewingTestimonial")
    : "0";
  const isPreviewingevent = localStorage.getItem("isPreviewingevent")
    ? localStorage.getItem("isPreviewingevent")
    : "0";

  var lang = sessionStorage.getItem("i18nextLng");
  if (lang == "en") lang = "1";
  else lang = "2";

  var Element = Scroll.Element;
  const pages = ["Products", "Pricing", "Blog"];
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    setpage(1);
    const Plan_Payload = {
      END_POINT1: "country",
      END_POINT2: "plans",
      Query: {
        list: "All_Plans",
        countryId: event.target.value,
        page: 1,
        size: 3,
      },
    };
    dispatch(websiteActions.getWebsiteAllPlans(Plan_Payload));
  };
  React.useEffect(async () => {
    const GET_Country_Payload = {
      END_POINT1: "country",
    };
    await dispatch(websiteActions.getCountrylist(GET_Country_Payload));

    const Event_Payload = {
      END_POINT1: "events",
      Query: {
        preview: isPreviewingevent,
        languageId: lang,
      },
    };
    await dispatch(websiteActions.getevents(Event_Payload));
    const Testimonial_Payload = {
      END_POINT1: "testimonial",
      Query: {
        preview: isTestimonialPreview,
        languageId: lang,
      },
    };
    await dispatch(websiteActions.gettestimonial(Testimonial_Payload));

    const Plan_Payload = {
      END_POINT1: "country",
      END_POINT2: "plans",
      Query: {
        list: "All_Plans",
        countryId: 1,
        page: page,
        size: 3,
      },
    };
    await dispatch(websiteActions.getWebsiteAllPlans(Plan_Payload));
  }, []);
  const onPressNextButton = () => {
    setpage(page + 1);
    const Plan_Payload = {
      END_POINT1: "country",
      END_POINT2: "plans",
      Query: {
        list: "All_Plans",
        countryId: Country,
        page: page + 1,
        size: 3,
      },
    };
    dispatch(websiteActions.getWebsiteAllPlans(Plan_Payload));
  };

  const onpresspreviousbutton = () => {
    setpage(page - 1);
    const Plan_Payload = {
      END_POINT1: "country",
      END_POINT2: "plans",
      Query: {
        list: "All_Plans",
        countryId: Country,
        page: page - 1,
        size: 3,
      },
    };
    dispatch(websiteActions.getWebsiteAllPlans(Plan_Payload));
  };

  const eventsPrevioushandler = async () => {
    if (event_page.first != 0) {
      setevent_page({
        first: event_page.first - 1,
        second: event_page.second - 1,
      });
      var result =
        WebsiteState.event_res?.data[event_page.first - 1]?.eventDescription;
      if (result != undefined) {
        result = splitter(result.split("\n"), function (part) {
          return [part, <br />];
        });
        seteventlist(result);
      }
    } else {
      var result = WebsiteState.event_res?.data[0]?.eventDescription;
      result = splitter(result.split("\n"), function (part) {
        return [part, <br />];
      });
      seteventlist(result);

      setevent_page({ first: 0, second: 1 });
    }
  };

  const eventsNexthandler = async () => {
    if (
      WebsiteState &&
      event_page.second != WebsiteState.event_res?.data.length
    ) {
      setevent_page({
        first: event_page.first + 1,
        second: event_page.second + 1,
      });
      var result =
        WebsiteState.event_res?.data[event_page.first + 1]?.eventDescription;
      if (result != undefined) {
        result = splitter(result.split("\n"), function (part) {
          return [part, <br />];
        });
        seteventlist(result);
      }
    } else {
      setevent_page({ first: 0, second: 1 });
      var result = WebsiteState.event_res?.data[0]?.eventDescription;
      if (result != undefined) {
        result = splitter(result.split("\n"), function (part) {
          return [part, <br />];
        });
        seteventlist(result);
      }
    }
  };

  const testimonialPrevioushandler = async () => {
    settestimonial_page(testimonial_page - 1);
    const Testimonial_Payload = {
      END_POINT1: "testimonial",
      Query: {
        preview: isTestimonialPreview,
        languageId: lang,
      },
    };
    await dispatch(websiteActions.gettestimonial(Testimonial_Payload));
  };

  const testimonialNexthandler = async () => {
    if (WebsiteState && testimonial_page.second != testimoniallist.length - 1) {
      settestimonial_page({
        first: testimonial_page.first + 1,
        second: testimonial_page.second + 1,
      });
    } else {
      settestimonial_page({ first: 0, second: 1 });
    }
  };

  React.useEffect(() => {
    if (WebsiteState && WebsiteState.event_res?.statusCode == "200") {
      var result = WebsiteState.event_res?.data[0]?.eventDescription;
      if (result != undefined) {
        result = splitter(result.split("\n"), function (part) {
          return [part, <br />];
        });
        seteventlist(result);
        setevent_page({ first: 0, second: 1 });
      } else {
        seteventlist(null);
      }
    }
  }, [WebsiteState.event_res]);
  useInterval(async () => {
    await eventsNexthandler();
  }, 5000);
  useInterval(async () => {
    await testimonialNexthandler();
  }, 25000);

  React.useEffect(() => {
    if (WebsiteState && WebsiteState.testimonial_res) {
      settestimoniallist(WebsiteState.testimonial_res?.data);
      settestimonial_page({ first: 0, second: 1 });
    }
  }, [WebsiteState.testimonial_res]);

  React.useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      localStorage.clear();
      return "";
    };

    window.addEventListener("unload", unloadCallback);
    return () => window.removeEventListener("unload", unloadCallback);
  }, []);

  React.useEffect(() => {
    return () => {
      localStorage.clear();
    };
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <html translate="no"></html>
        <meta name="google" content="notranslate" />
        <html lang="en" class="notranslate"></html>
        <meta http-equiv="content-language" content="en" />
      </Helmet>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar
          position="static"
          id="footerHome"
          style={{ backgroundColor: "#e0f2f6" }}
        >
          <Container id="homelink" maxWidth="xl">
            <Toolbar
              disableGutters
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Typography sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
                <img src={logo} className="landingPageLogo" />
              </Typography>

              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                  justifyContent: "flex-end",
                }}
              >
                <img src={logo} className="landingPageLogo" />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LanguageSelect user={"website"} />
                </div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon style={{ color: "#05396b" }} />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  <MenuItem className="menu">
                    <Link
                      activeClass="active"
                      to="homelink"
                      spy={true}
                      smooth={true}
                      duration={10}
                    >
                      {t("Home1")}
                    </Link>
                    <Link
                      activeClass="active"
                      to="eventLink"
                      spy={true}
                      smooth={true}
                      duration={10}
                    >
                      {t("Events")}
                    </Link>
                    <Link
                      activeClass="active"
                      to="testimonialsLink"
                      spy={true}
                      smooth={true}
                      duration={10}
                    >
                      {t("Testimonials")}
                    </Link>
                    <Link
                      activeClass="active"
                      to="HIWLink"
                      spy={true}
                      smooth={true}
                      duration={10}
                    >
                      {t("How_it_Works")}
                    </Link>
                    <Link
                      activeClass="active"
                      to="planLink"
                      spy={true}
                      smooth={true}
                      duration={10}
                    >
                      {t("Plan1")}
                    </Link>
                    <Link onClick={() => History.push(PATHS.LOGIN)}>
                      {t("Login")}
                    </Link>
                  </MenuItem>
                </Menu>
              </Box>

              <Box
                sx={{
                  flexGrow: 0.5,
                  display: { xs: "none", md: "flex" },
                  justifyContent: "flex-end",
                }}
              >
                <Grid sx={{ my: 2, mr: 2 }} className="appBarMenu">
                  <Link
                    activeClass="active"
                    to="homelink"
                    spy={true}
                    smooth={true}
                    duration={10}
                  >
                    {t("Home1")}
                  </Link>
                </Grid>
                <Grid sx={{ my: 2, mr: 2 }} className="appBarMenu">
                  <Link
                    activeClass="active"
                    to="eventLink"
                    spy={true}
                    smooth={true}
                    duration={10}
                  >
                    {t("Events")}
                  </Link>
                </Grid>
                <Grid sx={{ my: 2, mr: 2 }} className="appBarMenu">
                  <Link
                    activeClass="active"
                    to="testimonialsLink"
                    spy={true}
                    smooth={true}
                    duration={10}
                  >
                    {t("Testimonials")}
                  </Link>
                </Grid>
                <Grid sx={{ my: 2, mr: 2 }} className="appBarMenu">
                  <Link
                    activeClass="active"
                    to="HIWLink"
                    spy={true}
                    smooth={true}
                    duration={10}
                  >
                    {t("How_it_Works")}
                  </Link>
                </Grid>
                <Grid sx={{ my: 2, mr: 2 }} className="appBarMenu">
                  <Link
                    activeClass="active"
                    to="planLink"
                    spy={true}
                    smooth={true}
                    duration={10}
                  >
                    {t("Plan1")}
                  </Link>
                </Grid>
                <Grid sx={{ my: 2, mr: 2 }} className="appBarMenu">
                  <LanguageSelect />
                </Grid>
                <Grid
                  sx={{ my: 2, mr: 2 }}
                  onClick={() => History.push(PATHS.LOGIN)}
                  className="appBarloginBtn"
                >
                  {t("Login")}
                </Grid>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <Grid className="landingPageMargin">
        <Grid container xs={12} className="topImage">
          <Grid xs={12} className="imageOverlayerDiv">
            <div className="imageOverlayers">
              <Grid xs={12} className="topText">
                KARUTAP
              </Grid>
              <Grid xs={12} className="topText1">
                {t("Landing_page_top_text")}
              </Grid>
            </div>
            <Link
              activeClass="active"
              to="planLink"
              spy={true}
              smooth={true}
              duration={10}
            >
              <Grid className="getStartBtn">{t("Get_Started")}</Grid>
            </Link>
          </Grid>
        </Grid>
        <hr></hr>
        <Grid
          container
          id="eventLink"
          className="landingpageEventMainContainer"
        >
          <Grid xs={12} className="eventHeading1">
            <div>{t("Events")}</div>
          </Grid>
          <Grid xs={12} className="eventHeading2">
            <div className="EventTitle" style={{ fontWeight: "600" }}>
              {WebsiteState &&
                WebsiteState.event_res?.data[event_page.first]?.eventName}
            </div>
          </Grid>
          <Grid xs={12} className="eventHeading2">
            <Grid className="EventTitle1">{eventlist && eventlist}</Grid>
          </Grid>
          <Grid xs={12} className="eventHeading2">
            <div>
              {WebsiteState &&
                WebsiteState.event_res?.data[event_page.first]?.eventUrlLink}
            </div>
          </Grid>
          <Grid container xs={12} className="eventSubContainer">
            <Grid
              onClick={() => {
                eventsPrevioushandler();
              }}
              xs={1}
              sm={1}
              md={1}
              lg={1}
              xl={1}
              className="eventSubContainer1"
            >
              <FaChevronLeft className="backIcon" />
            </Grid>
            {WebsiteState.event_res?.data[event_page.first]?.eventDocUrl ? (
              <Grid
                xs={10}
                sm={10}
                md={10}
                lg={10}
                xl={10}
                className="eventSubContainer2"
              >
                <img
                  src={
                    WebsiteState &&
                    StaticContent.Card_Url +
                      WebsiteState.event_res?.data[event_page.first]
                        ?.eventDocUrl
                  }
                  className={
                    WebsiteState.event_res?.data[event_page.first]
                      ?.eventImageSizeType == 0
                      ? "eventImage"
                      : "eventImage_actual"
                  }
                />
              </Grid>
            ) : (
              <div>
                {t("No_event_data_available_for_the_selected_language")}
              </div>
            )}
            <Grid
              onClick={() => {
                eventsNexthandler();
              }}
              xs={1}
              sm={1}
              md={1}
              lg={1}
              xl={1}
              className="eventSubContainer1"
            >
              <FaChevronRight className="backIcon" />
            </Grid>
          </Grid>
        </Grid>
        <hr style={{ marginTop: "20px" }}></hr>
        <Grid
          container
          id="testimonialsLink"
          className="landingpageTestimonialsMainContainer"
        >
          <Grid xs={12} className="eventHeading1">
            <div>{t("Testimonials")}</div>
          </Grid>
          <Grid xs={12} className="eventHeading2">
            <div>{t("Event_text_2")}</div>
          </Grid>

          {testimoniallist.length > 0 ? (
            <Grid container xs={12} className="testimonials">
              <Grid container xs={12} md={12} className="testimonialsContants">
                <Grid xs={12} md={6} className="testimonialsContants1">
                  <Grid xs={12} md={12} className="testimonialsText">
                    {testimoniallist.length > 0
                      ? testimoniallist[testimonial_page.first]
                          ?.testimonialDescription
                      : null}{" "}
                  </Grid>
                </Grid>
                <Grid xs={12} md={6} className="testimonialsContants1">
                  <Grid xs={12} md={12} className="testimonialsText">
                    {testimoniallist.length > 0
                      ? testimoniallist[testimonial_page.second]
                          ?.testimonialDescription
                      : null}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid container xs={12} className="testimonials">
              <Grid container xs={12} className="testimonialsContants">
                <Grid xs={12} className="testimonialsContants1">
                  <Grid xs={12} className="testimonialsText">
                    <div>
                      {t(
                        "No_testimonial_data_available_for_the_selected_language"
                      )}{" "}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
        <hr></hr>

        <Grid container id="HIWLink" className="landingpageHowItsWorkContainer">
          <Grid xs={12} className="eventHeading1">
            <div>{t("How_it_Works")}</div>
          </Grid>
          <Grid xs={12} className="eventHeading2">
            <div style={{ whiteSpace: "pre-line" }}>{t("Event_text_1")}</div>
          </Grid>
          <hr></hr>
          <Grid container xs={12}>
            <Container maxWidth="md">
              <div class="left-half">
                <article>
                  <img src={HIW1} className="howItsWorkImage" />
                </article>
              </div>
              <div class="right-half startContent">
                <article>
                  <div className="subHeading">{t("Create")}</div>
                  <div className="howItsWorkTexts">
                    {t("Create_text_line1")}
                    {t("Create_text_line2")}
                    {t("Create_text_line3")}
                    {t("Create_text_line4")}
                    {t("Create_text_line5")}
                    {t("Create_text_line6")}
                  </div>
                </article>
              </div>
            </Container>
            <Container maxWidth="md">
              <div class="laptopView right-half rightContent">
                <article>
                  <img src={HIW3} className="howItsWorkImage" />
                </article>
              </div>
              <div class="left-half startContent ">
                <article>
                  <div className="subHeading">{t("Play")}</div>
                  <div className="howItsWorkTexts ">
                    {t("Game_text_line1")}
                    {t("Game_text_line2")}
                    {t("Game_text_line3")}
                    {t("Game_text_line4")}
                    {t("Game_text_line5")}
                    {t("Game_text_line6")}
                    {t("Game_text_line7")}
                  </div>
                </article>
              </div>
              <div class="mobileViewImage right-half rightContent">
                <article>
                  <img src={HIW3} className="howItsWorkImage" />
                </article>
              </div>
            </Container>
            <Container maxWidth="md">
              <div class="left-half">
                <article>
                  <img src={HIW2} className="howItsWorkImage" />
                </article>
              </div>
              <div class="right-half startContent">
                <article>
                  <div className="subHeading">{t("Learn_by_heart")}</div>
                  <div className="howItsWorkTexts">
                    {t("Learning_text1")}
                    {t("Learning_text2")}
                    {t("Learning_text3")}
                    {t("Learning_text4")}
                    {t("Learning_text5")}
                  </div>
                </article>
              </div>
            </Container>
          </Grid>
        </Grid>
        <hr></hr>

        <Grid container id="planLink" xs={12}>
          <Grid xs={12} className="eventHeading1">
            <div>{t("Plan1")}</div>
          </Grid>
          <Grid xs={12} className="planHeading2">
            <div>{t("Plan_text1")}</div>
          </Grid>
          <Grid xs={12} className="planHeading2">
            <div>{t("Plan_text2")}</div>
          </Grid>
          <Grid xs={12} container justifyContent="center" marginTop="50px">
            <FormControl className={classes.margin}>
              <InputLabel shrink htmlFor="bootstrap-prefectureinput">
                {t("Country")}
              </InputLabel>
              <Select
                labelId="bootstrap-prefectureinput"
                id="bootstrap-prefectureinput"
                value={Country}
                onChange={handleCountryChange}
                input={<BootstrapInput style={{ width: "25vw" }} />}
                defaultValue={1}
              >
                {WebsiteState.countrylist &&
                  WebsiteState.countrylist?.data
                    .filter((e) => e.countryName != "GLOBAL")
                    .map(({ countryId, countryName }) => {
                      return (
                        <MenuItem value={countryId}>{countryName}</MenuItem>
                      );
                    })}
              </Select>
            </FormControl>
          </Grid>
          {/* Plan List Section  */}
          <Grid container xs={12} className="planMainContainer">
            {/* Left Side Arrow  */}
            {page === 1 ? null : (
              <Grid
                onClick={() => {
                  onpresspreviousbutton();
                }}
                xs={1}
                sm={0.5}
                md={1}
                lg={1}
                xl={1}
                className="backIconDiv"
              >
                <FaChevronLeft className="backIcon" />
              </Grid>
            )}
            {/* plan Container Section  */}
            <Grid
              container
              justifyContent="center"
              xs={10}
              sm={11}
              md={10}
              lg={10}
              xl={10}
            >
              {WebsiteState.getAllPlansWeb?.data?.subscription.map((el, i) => {
                if (i == 0) {
                  orderedSubscriptionPlanList[0] = el;
                } else if (i == 1) {
                  if (el.cost > orderedSubscriptionPlanList[0].cost) {
                    orderedSubscriptionPlanList[1] = el;
                  } else {
                    orderedSubscriptionPlanList[1] =
                      orderedSubscriptionPlanList[0];
                    orderedSubscriptionPlanList[0] = el;
                  }
                } else if (i == 2) {
                  if (el.cost <= orderedSubscriptionPlanList[1].cost) {
                    orderedSubscriptionPlanList[2] = el;
                  } else {
                    orderedSubscriptionPlanList[2] =
                      orderedSubscriptionPlanList[1];
                    orderedSubscriptionPlanList[1] = el;
                  }
                }
              })}
              {orderedSubscriptionPlanList.map(
                (
                  {
                    planName,
                    maxNoOfKaruta,
                    cost,
                    subPlanId,
                    planType,
                    currency,
                    category,
                    currencySymbol,
                    duration,
                    notes,
                  },
                  i
                ) => {
                  return (
                    <Grid
                      id={subPlanId}
                      xs={10}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      className="planContainer"
                    >
                      <Grid
                        className={i == 1 ? "yearlyPlanContent" : "planContent"}
                      >
                        <Grid
                          className="planContents"
                          style={{
                            fontWeight: "600",
                            fontSize: "1.3rem",
                            padding: "30px 12px 12px 12px",
                          }}
                        >
                          {planName}
                        </Grid>
                        <Grid
                          className="planContents"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {notes}
                        </Grid>

                        <Grid className="planContents">
                          <span
                            style={{ fontWeight: "600", fontSize: "1.3rem" }}
                          >
                            {cost?.toLocaleString("ja-JP") +
                              (currencySymbol == "¥" ? "円" : currencySymbol)}
                          </span>{" "}
                          {t("Tax_included")}
                          <Grid>
                            <span>
                              {cost == 0 ? t("Free") : t("Organization")}
                            </span>
                          </Grid>
                        </Grid>

                        <Grid className="planContents">
                          <Button
                            onClick={() =>
                              History.push({
                                pathname: PATHS.SIGNUP,
                                search: `?${
                                  Country == 1
                                    ? "JAPAN"
                                    : Country == 2
                                    ? "INDIA"
                                    : "null"
                                }/${planType}`,
                                state: {
                                  country: Country,
                                  planDetails: JSON.stringify(
                                    WebsiteState.getAllPlansWeb?.data
                                      ?.subscription[i]
                                  ),
                                },
                              })
                            }
                            style={{
                              color: "#05386b",
                              fontWeight: "600",
                              fontSize: "0.8rem",
                              borderRadius: "7px",
                              height: "auto",
                              border: "2px solid",
                              wordBreak: "break-word",
                            }}
                          >
                            {t("get_started_now")}
                          </Button>
                        </Grid>
                        {/* Limit Of Karuta   */}
                        <Grid
                          className="planContents"
                          style={{
                            padding: "0px 0px 30px 12px",
                            textAlign: "start",
                            fontSize: "0.8rem",
                          }}
                        >
                          <div>
                            {t("no_of_karutaset")}
                            {maxNoOfKaruta} {t("Karuta1")}
                          </div>
                          <div>
                            ・{t("duration")}：
                            {duration == 1
                              ? duration + " " + t("month")
                              : duration + " " + t("months")}
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                }
              )}
            </Grid>
            {/* Right Side Arrow */}
            {WebsiteState.getAllPlansWeb?.data?.totalNoOfPages === page ||
            WebsiteState.getAllPlansWeb?.data?.totalNoOfPages === 0 ? null : (
              <Grid
                onClick={() => {
                  onPressNextButton();
                }}
                xs={1}
                sm={0.5}
                md={1}
                lg={1}
                xl={1}
                className="backIconDiv"
              >
                <FaChevronRight className="backIcon" />
              </Grid>
            )}
          </Grid>
          <Grid
            xs={12}
            container
            className="planMainContainer"
            style={{
              padding: "0% 0% 2% 8%",
              justifyContent: "start",
              color: "red",
            }}
          >
            <div>＊{t("pay_info1")}</div>
            <div>＊{t("pay_info2")}</div>
          </Grid>
        </Grid>
      </Grid>
      <Grid container xs={12} className="footerContainer">
        <Grid xs={12} sm={2} md={2} className="footerLogoDiv">
          <Link
            activeClass="active"
            to="homelink"
            spy={true}
            smooth={true}
            duration={10}
          >
            <img src={logo} className="footerLogo" />
          </Link>
        </Grid>
        <Grid xs={12} sm={3} md={3} className="footerText">
          <div className="footerHeadings">{t("Site_map")}</div>
          <div>
            <Link
              activeClass="active"
              to="homelink"
              spy={true}
              smooth={true}
              duration={25}
              style={{ cursor: "pointer" }}
            >
              {t("Home1")}
            </Link>
          </div>
          <div>
            <Link
              activeClass="active"
              to="eventLink"
              spy={true}
              smooth={true}
              duration={25}
              style={{ cursor: "pointer" }}
            >
              {t("Events")}
            </Link>
          </div>
          <div>
            <Link
              activeClass="active"
              to="testimonialsLink"
              spy={true}
              smooth={true}
              duration={25}
              style={{ cursor: "pointer" }}
            >
              {t("Testimonials")}
            </Link>
          </div>
          <div>
            <Link
              activeClass="active"
              to="HIWLink"
              spy={true}
              smooth={true}
              duration={25}
              style={{ cursor: "pointer" }}
            >
              {t("How_it_Works")}
            </Link>
          </div>
          <div>
            <Link
              activeClass="active"
              to="planLink"
              spy={true}
              smooth={true}
              duration={25}
              style={{ cursor: "pointer" }}
            >
              {t("Plan1")}
            </Link>
          </div>
        </Grid>
        <Grid xs={12} sm={3} md={3} className="footerText">
          <div className="footerHeadings">{t("Contact_us")}</div>

          <div>
            <a
              href="https://geoglyph.net/"
              target="_blank"
              style={{ textDecoration: "none", color: "#dddddd" }}
            >
              {t("operating_company")}
            </a>
          </div>
          <div>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSf-zom1-xH78xEofjvhUFPoEQfUGBStdV8yWMoKWrQQCYqN_g/viewform"
              target="_blank"
              style={{ textDecoration: "none", color: "#dddddd" }}
            >
              {t("enquiry")}
            </a>
          </div>
        </Grid>
        <Grid xs={12} sm={2} md={2} className="footerText">
          <div className="footerHeadings">{t("Privacy_policy")}</div>
        </Grid>
        <Grid
          xs={12}
          sm={2}
          md={2}
          className="footerText socialMediaIconsFooter"
        >
          <div className="footerIconsDiv">
            <a
              href="https://www.facebook.com/KaruTap-100145319188906/?ref=page_internal"
              target="_blank"
            >
              <BsFacebook className="footerIcons" />
            </a>
          </div>
          <div className="footerIconsDiv">
            <a href="https://twitter.com/KARUTAP_learn" target="_blank">
              <FaTwitter className="googleIcon" />
            </a>
          </div>
          <div className="footerIconsDiv">
            <a
              href="https://instagram.com/k_a_r_u_t_a_p?utm_medium=copy_link"
              target="_blank"
            >
              <FaInstagram className="instaIcon" />
            </a>
          </div>
        </Grid>
      </Grid>

      <ScrollTop {...props}>
        <Link
          activeClass="active"
          to="footerHome"
          spy={true}
          smooth={true}
          duration={25}
        >
          <Fab
            style={{ backgroundColor: "#e0f2f6" }}
            size="small"
            aria-label="scroll back to top"
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Link>
      </ScrollTop>
    </React.Fragment>
  );
};

export default LandingPage;
