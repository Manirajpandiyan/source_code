import * as React from "react";
import { Grid } from "@mui/material";
import "./BookingList.css";
import { PATHS } from "../routes/index";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { RiHotelFill } from "react-icons/ri";
import { GrLinkPrevious } from "react-icons/gr";
import { GrLinkNext } from "react-icons/gr";
import { ImCancelCircle } from "react-icons/im";
import {
  MdEdit,
  MdFilterAlt,
  MdOutlineFirstPage,
  MdOutlineLastPage,
} from "react-icons/md";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Header from "../components/AllScreenHeader";
import { FaRegEye } from "react-icons/fa";
import { BsFillCalendar2CheckFill } from "react-icons/bs";
import { actions as Bookingaction } from "../store/module/Bookingmodule";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import StaticContent from "./StatisContent";
import moment from "moment";
import { toast } from "react-hot-toast";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { GiMoneyStack } from "react-icons/gi";
import { FilterStorage, httpService } from "../api/Request/service";

const BookingList = () => {
  const History = useNavigate();
  const [errorGetStatus, setGetErrorStatus] = useState([]);
  const [bookingcancelopen, setBookingCancelOpen] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [cancelBookingId, setCancelBookingId] = useState("");
  const [openbookingFilter, setOpenBookingFilter] = React.useState(false);
  const [Canceldate, setCanceldate] = useState("");

  const handleBookingCancel = () => {
    setBookingCancelOpen(false);

    httpService({
      url: `/bookings/${cancelBookingId}`,
      method: "DELETE",
      params: { description: description },
    })
      .then((res) => {
        console.log(res);
        notify();

        setBookingCancelOpen(false);
        const BOOKINGLIST_PAYLOAD = {
          END_POINT1: "bookings",
          Query: {
            page: 1,
            size: 10,
            ...filter,
          },
        };
        setpageNo(1);
        dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const dispatch = useDispatch();
  const [pageNo, setpageNo] = useState(1);
  const BookingListState = useSelector((state) => state.booking);
  const [bookinglist, setbookinglist] = useState([]);
  const [statusfilter, setstatusfilter] = useState([]);

  const [filter, setFilter] = useState({
    memberId: "",
    bookedFor: "",
    bookingType: "",
    paymentType: "",
    status: "",
    endDate: "",
    startDate: "",
  });

  const [avlDateFilter, setAvlDateFilter] = useState({
    date: "",
  });

  useEffect(() => {
    let data = JSON.parse(sessionStorage.getItem(FilterStorage.BOOKING));
    if (data) {
      setFilter({
        memberId: data?.memberId,
        bookedFor: data.bookedFor,
        bookingType: data.bookingType,
        paymentType: data.paymentType,
        status: data.status,
        endDate: data.endDate,
        startDate: data.startDate,
      });
      BookingListAPI({ ...data, page: data.page });
    } else {
      BookingListAPI({ page: pageNo });
    }
  }, []);

  const BookingListAPI = (filtersparams) => {
    const BOOKINGLIST_PAYLOAD = {
      END_POINT1: "bookings",
      Query: {
        size: 10,
        ...filtersparams,
      },
    };
    dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD));
    sessionStorage.setItem(
      FilterStorage.BOOKING,
      JSON.stringify({ ...filter, page: filtersparams.page })
    );
  };

  const notify = () =>
    toast.success("Successfully cancelled the booking", {
      duration: 4000,
      position: "top-center",
    });

  useEffect(() => {
    if (
      BookingListState.cancelBookingReponse?.statusCode ==
      StaticContent.Status200
    ) {
      const BOOKINGLIST_PAYLOAD = {
        END_POINT1: "bookings",
        Query: {
          page: pageNo,
          size: 10,
          ...filter,
        },
      };
      dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD));
      notify();
      dispatch(Bookingaction.resetState());
    }
  }, [BookingListState.cancelBookingReponse]);

  const handleClickFilterOpen = () => {
    setOpenBookingFilter(true);
  };

  const handleFilterClose = (type) => {
    setOpenBookingFilter(false);
    let BOOKINGLIST_PAYLOAD = {};
    if (type === "OK") {
      BOOKINGLIST_PAYLOAD = {
        END_POINT1: "bookings",
        Query: {
          page: 1,
          size: 10,
          ...filter,
        },
      };
    } else if (type === "RESET") {
      BOOKINGLIST_PAYLOAD = {
        END_POINT1: "bookings",
        Query: {
          page: 1,
          size: 10,
        },
      };
      setFilter({
        memberId: "",
        bookedFor: "",
        bookingType: "",
        paymentType: "",
        status: "",
        endDate: "",
        startDate: "",
      });
    }
    if (type !== "CANCEL") {
      setpageNo(1);
      dispatch(Bookingaction.bookinglist(BOOKINGLIST_PAYLOAD));
    }
    sessionStorage.setItem(
      FilterStorage.BOOKING,
      JSON.stringify({ ...filter, page: 1 })
    );
  };

  const getPanaltymsg = () => {
    var given = moment(Canceldate, "YYYY-MM-DD");
    var current = moment().startOf("day");

    return moment.duration(given.diff(current)).asDays() === 1
      ? "If you cancel the booking after 24 hours(calculated from when you're booked) you'll be charged penalty"
      : "";
  };

  const namelist = JSON.parse(sessionStorage.getItem("nameList"));

  const datefind = (startdate, enddate, status) => {
    if (status === "CANCELLED") {
      return false;
    } else {
      let endDate1 = moment(enddate, "YYYY-MM-DD").add("days", 2);
      return moment().isBetween(
        moment(startdate).format("YYYY-MM-DD"),
        moment(endDate1).format("YYYY-MM-DD")
      );
    }
  };

  const [openBookingStatus, setopenBookingStatus] = useState(false);
  const [availability, setAvailability] = useState([]);
  const handleClickBookingOpen = () => {
    setopenBookingStatus(true);
    clearData1();
  };

  const handleBookingClose = () => {
    setAvlDateFilter({
      date: "",
    });
    setAvailability([]);
    setopenBookingStatus(false);
  };

  const onClickAvailability = () => {
    setGetErrorStatus([]);
    httpService({
      url: `/bookingdetails`,
      method: "GET",
      params: { ...avlDateFilter },
    })
      .then((res) => {
        setAvailability([...res?.data?.data?.data]);
        clearData1();
      })
      .catch((e) => {
        setGetErrorStatus([...e?.error?.response?.data?.data]);
      });
  };

  const clearData1 = () => {
    setGetErrorStatus([]);
  };

  const onCancelChange = (status, checkin) => {
    if (status === "CANCELLED") {
      return true;
    } else {
      return moment(moment().format("YYYY-MM-DD")).isAfter(
        moment(checkin).format("YYYY-MM-DD")
      );
    }
  };

  return (
    <div>
      <Navbar />
      <Header />
      <div className="BookingList_MainContainer">
        <Grid xs={12} container>
          <Grid xs={3} md={5} className="BookingList_Section_Text">
            Booking List
          </Grid>
          <Grid
            xs={9}
            sm={12}
            md={6}
            container
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid className="filterDiv" xs={4} sm={3} md={1}>
              <div
                className="dropdown"
                id="bookingListFilterId"
                onClick={handleClickFilterOpen}
              >
                <button className="bookingFilter">
                  <MdFilterAlt size="20" />
                  Filter
                </button>
              </div>
              <Dialog open={openbookingFilter}>
                <DialogTitle>Booking filter</DialogTitle>
                <DialogContent>
                  <Grid container>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Member name</label>
                      <div
                        className="customSelect typesOfPayment"
                        id="bookingListMemberNameId"
                      >
                        <select
                          onChange={(e) => {
                            setFilter({
                              ...filter,
                              memberId: e.target.value,
                            });
                          }}
                          value={filter?.memberId}
                        >
                          <option value="" diabled selected hidden>
                            ---Select---
                          </option>
                          {namelist &&
                            namelist.map((name) => {
                              return (
                                <option key={name} value={name.userId}>
                                  {name.firstName} {name.lastName}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Bookings</label>
                      <div
                        className="customSelect typesOfPayment"
                        id="bookingListFilterBookingsId"
                      >
                        <select
                          onChange={(e) => {
                            setFilter({
                              ...filter,
                              status: e.target.value,
                            });
                          }}
                          value={filter?.status}
                        >
                          <option value="" diabled selected hidden>
                            ---Select---
                          </option>
                          <option
                            value="CONFIRMED"
                            id="newBookingsFreeBookingsId"
                          >
                            Confirmed bookings
                          </option>
                          <option value="CANCELLED" id="newBookingsCoinId">
                            {" "}
                            Cancelled bookings
                          </option>
                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Payment method</label>
                      <div
                        className="customSelect typesOfPayment"
                        id="bookingListFilerPaymentMethodId"
                      >
                        <select
                          onChange={(e) => {
                            setFilter({
                              ...filter,
                              paymentType: e.target.value,
                            });
                          }}
                          value={filter?.paymentType}
                        >
                          <option value="" diabled selected hidden>
                            ---Select---
                          </option>
                          <option value="Points" id="newBookingsFreeBookingsId">
                            Points
                          </option>
                          <option value="Direct Payment" id="newBookingsCoinId">
                            Direct payment
                          </option>
                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Booking type</label>
                      <div
                        className="customSelect typesOfPayment"
                        id="bookingListFilterBookingTypeId"
                      >
                        <select
                          onChange={(e) => {
                            setFilter({
                              ...filter,
                              bookingType: e.target.value,
                            });
                          }}
                          value={filter?.bookingType}
                        >
                          <option value="" diabled selected hidden>
                            ---Select---
                          </option>
                          <option value="Room" id="newBookingsFreeBookingsId">
                            Room booking
                          </option>
                          <option value="Day" id="newBookingsCoinId">
                            {" "}
                            Special day booking
                          </option>
                        </select>
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      <label htmlFor="paymentdetails">Booking For</label>
                      <div
                        className="customSelect typesOfPayment"
                        id="bookingListFilterBookingForId"
                      >
                        <select
                          onChange={(e) => {
                            setFilter({
                              ...filter,
                              bookedFor: e.target.value,
                            });
                          }}
                          value={filter?.bookedFor}
                        >
                          <option diabled selected hidden>
                            ---Select---
                          </option>
                          <option value="Self" id="newBookingsFreeBookingsId">
                            Self
                          </option>
                          <option value="Member" id="newBookingsCoinId">
                            {" "}
                            Member
                          </option>
                          <option value="Non-Member" id="newBookingsCoinId">
                            {" "}
                            Non- Member
                          </option>
                        </select>
                      </div>
                    </Grid>
                    <Grid xs={5}>
                      <label htmlFor="filterstartdate">Start date</label>
                      <input
                        type="date"
                        name="filterstartdate"
                        id="filterstartdate"
                        onChange={(e) => {
                          setFilter({
                            ...filter,
                            startDate: e.target.value,
                          });
                        }}
                        value={filter?.startDate}
                        className="dialogueboxdatepicker"
                      />
                    </Grid>
                    <Grid xs={2}></Grid>
                    <Grid xs={5}>
                      <label htmlFor="filterenddate">End date</label>
                      <input
                        type="date"
                        name="filterenddate"
                        id="filterenddate"
                        onChange={(e) => {
                          setFilter({
                            ...filter,
                            endDate: e.target.value,
                          });
                        }}
                        value={filter?.endDate}
                        className="dialogueboxdatepicker"
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    id="bookingListFilterResetBtnId"
                    onClick={() => {
                      handleFilterClose("RESET");
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    id="bookingListFilterCancelBtnId"
                    onClick={() => {
                      handleFilterClose("CANCEL");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    id="bookingListFilterOkBtnId"
                    onClick={() => {
                      handleFilterClose("OK");
                    }}
                    variant="contained"
                    color="success"
                  >
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid xs={4} sm={5} md={4}>
              <div
                className="BookingList_Availability"
                onClick={handleClickBookingOpen}
                id="bookingListBookingStatusId"
              >
                <BsFillCalendar2CheckFill
                  size={20}
                  style={{ padding: "5px" }}
                />{" "}
                <div className="bookingText">Booking Status</div>
              </div>
              <Dialog open={openBookingStatus}>
                <DialogTitle>Booking status</DialogTitle>
                <DialogContent>
                  <Grid container>
                    <Grid xs={12}>
                      <ul>
                        {errorGetStatus.map((ele) => (
                          <li
                            key={ele}
                            style={{ color: "red", paddingTop: "15px" }}
                          >
                            {"\u2022"}
                            {"  "}
                            {ele}
                          </li>
                        ))}
                      </ul>
                    </Grid>
                    <Grid
                      xs={12}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                      }}
                    >
                      <label style={{ fontWeight: "bold", width: "150px" }}>
                        Availability date
                      </label>
                      <input
                        type="date"
                        name="availabilitydate"
                        id="availabilitydate"
                        className="formdatepicker"
                        onChange={(e) => {
                          setAvlDateFilter({
                            ...avlDateFilter,
                            date: e.target.value,
                          });
                        }}
                      ></input>
                    </Grid>
                    <Grid xs={12}>
                      <div
                        className="customSelect typesOfPayment"
                        id="newBookingsTypeOfPaymentId"
                      >
                        {availability?.length == 0 ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              margin: "10%",
                              fontWeight: "900",
                            }}
                          >
                            There are no bookings on selected date
                          </div>
                        ) : (
                          <table>
                            <thead>
                              <tr>
                                <th>Number of rooms</th>
                                <th>Booking type</th>
                                <th>Check in</th>
                                <th>People count</th>
                              </tr>
                            </thead>

                            <tbody>
                              {(availability ?? []).map((ele) => {
                                return (
                                  <tr key={ele?.lastname}>
                                    <td data-column="No of Rooms">
                                      {ele?.numOfRooms}
                                    </td>
                                    <td data-column="Type">
                                      {ele?.bookingType}
                                    </td>
                                    <td data-column="Check In">
                                      {moment(ele?.date).format("DD-MM-YYYY")}
                                    </td>
                                    <td data-column="People Count">
                                      {ele?.numOfAdults} adult{" "}
                                      {ele?.numOfChildren} kid
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    id="bookingListAvailabilityCheckCancelBtnId"
                    onClick={handleBookingClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    id="bookingListAvailabiltycheckOkBtnId"
                    variant="contained"
                    onClick={() => {
                      onClickAvailability();
                    }}
                    color="success"
                  >
                    Search
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid xs={4} sm={3} md={1}>
              <div
                className="bookingNewBookingDiv"
                onClick={() => History(PATHS.NEWBOOKINGS)}
                id="bookingListNewBookingsBtnId"
              >
                <RiHotelFill size={25} style={{ padding: "5px" }} />{" "}
                <div className="bookingText">New Booking</div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className="BookingList_Section">
        <Grid xs={12}>
          {bookinglist?.data?.data?.bookingDetailsList.length == 0 ? (
            <Grid className="no_data_found">No bookings available</Grid>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Booked date</th>
                  <th>Guest name</th>
                  <th>Type</th>
                  <th>Check in</th>
                  <th>Check out</th>
                  <th>Number of rooms</th>
                  <th>Payment type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {BookingListState.bookinglist?.data?.data?.bookingDetailsList &&
                  BookingListState.bookinglist?.data?.data?.bookingDetailsList.map(
                    ({
                      numOfRooms,
                      memberName,
                      bookingId,
                      bookingType,
                      checkInDate,
                      checkOutDate,
                      paymentType,
                      status,
                      createdDate,
                      guestName,
                      memberId,
                    }) => {
                      return (
                        <tr key={bookingId}>
                          <td data-column="Booked date">
                            {moment(createdDate).format("DD-MM-YYYY")}
                          </td>
                          <td data-column="Name">{guestName}</td>
                          <td data-column="Type">
                            {bookingType == "Room"
                              ? "Room Booking"
                              : "Special Day Booking"}
                          </td>
                          <td data-column="Check in">
                            {moment(checkInDate).format("DD-MM-YYYY")}
                          </td>
                          <td data-column="Check out">
                            {moment(checkOutDate).format("DD-MM-YYYY")}
                          </td>
                          <td data-column="Number of rooms">{numOfRooms}</td>
                          <td data-column="Payment type">
                            {paymentType == "Points"
                              ? "Points"
                              : "Direct Payment"}
                          </td>
                          <td data-column="Status">
                            {status == "CANCELLED" ? (
                              <div style={{ color: "red" }}>CANCELLED</div>
                            ) : (
                              <div style={{ color: "green" }}>CONFIRMED</div>
                            )}
                          </td>
                          <td
                            data-column="Action"
                            className="BookingListAction"
                          >
                            <Tooltip title="View booking">
                              <IconButton>
                                <FaRegEye
                                  onClick={() =>
                                    History(PATHS.VIEWBOOKINGS, {
                                      state: {
                                        bookingId: bookingId,
                                        memberName: memberName,
                                        statusfilter: statusfilter,
                                      },
                                    })
                                  }
                                  id="bookingListViewBookingBtnId"
                                  className="actionIcons"
                                  size="22"
                                />
                              </IconButton>
                            </Tooltip>
                            {onCancelChange(status, checkOutDate) ? null : (
                              <Tooltip title="Edit booking">
                                <IconButton>
                                  <MdEdit
                                    onClick={() =>
                                      History(PATHS.EDITBOOKING, {
                                        state: { bookingId: bookingId },
                                      })
                                    }
                                    id="bookingListEditBookingBtnId"
                                    className="BookingListActions_eyeIcon"
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            {datefind(checkInDate, checkOutDate, status) ? (
                              <Tooltip title="Expenses">
                                <IconButton>
                                  <GiMoneyStack
                                    onClick={() =>
                                      History(PATHS.EXPENSES, {
                                        state: {
                                          bookingId: bookingId,
                                          memberId: memberId,
                                          bookingType: bookingType,
                                          checkindate: checkInDate,
                                        },
                                      })
                                    }
                                    id="bookingListAddExpenseBtnId"
                                    className="BookingListActions_eyeIcon"
                                  />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                            {onCancelChange(status, checkInDate) ? null : (
                              <Tooltip title="Cancel Booking">
                                <IconButton>
                                  <ImCancelCircle
                                    onClick={() => {
                                      setBookingCancelOpen(true);
                                      setCancelBookingId(bookingId);
                                      setCanceldate(
                                        moment(checkInDate).format("YYYY-MM-DD")
                                      );
                                    }}
                                    id="bookingListCancleBtnId"
                                    className="BookingListActions_eyeIcon"
                                    size={22}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Dialog
                              open={bookingcancelopen}
                              onClose={() => setBookingCancelOpen(true)}
                            >
                              <DialogTitle>
                                Are you sure you want to cancel?
                              </DialogTitle>
                              <DialogContent>
                                <Grid container>
                                  <Grid xs={12}>
                                    <label
                                      style={{
                                        textAlign: "start",
                                        width: "100%",
                                      }}
                                      htmlFor="address"
                                    >
                                      Reason
                                    </label>

                                    <textarea
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                    ></textarea>
                                    <div style={{ color: "red" }}>
                                      If you cancel the booking after 24
                                      hours(calculated from when you're booked)
                                      you'll be charged penalty
                                    </div>
                                  </Grid>
                                </Grid>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  id="bookingListCancelNoBtnId"
                                  onClick={() => setBookingCancelOpen(false)}
                                >
                                  No
                                </Button>
                                <Tooltip title={getPanaltymsg()}>
                                  <Button
                                    id="bookingListCancelYesBtnId"
                                    onClick={() => handleBookingCancel()}
                                    variant="contained"
                                    color="success"
                                  >
                                    Yes
                                  </Button>
                                </Tooltip>
                              </DialogActions>
                            </Dialog>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          )}

          <Grid className="Pagination_BookingList_Section">
            {BookingListState.bookinglist?.data?.data?.pageNo > 1 ? (
              <div
                onClick={() => {
                  setpageNo(1);
                  BookingListAPI({ ...filter, page: 1 });
                }}
                className="paginationBtn"
                id="bookingListFirstPageBtnId"
              >
                <MdOutlineFirstPage size="20" style={{ padding: "5px" }} />
              </div>
            ) : null}
            {BookingListState.bookinglist?.data?.data?.pageNo == 1 ? null : (
              <div
                onClick={() => {
                  setpageNo(
                    BookingListState.bookinglist?.data?.data?.pageNo - 1
                  );
                  BookingListAPI({
                    ...filter,
                    page: BookingListState.bookinglist?.data?.data?.pageNo - 1,
                  });
                }}
                className="paginationBtn"
                id="bookingListPrevBtnId"
              >
                <GrLinkPrevious size="20" style={{ padding: "5px" }} />
              </div>
            )}
            {BookingListState.bookinglist?.data?.data?.pageNo !==
              BookingListState.bookinglist?.data?.data?.totalNoOfPages && (
              <div
                onClick={() => {
                  setpageNo(
                    BookingListState.bookinglist?.data?.data?.pageNo + 1
                  );
                  BookingListAPI({
                    ...filter,
                    page: BookingListState.bookinglist?.data?.data?.pageNo + 1,
                  });
                }}
                className="paginationBtn"
                id="bookingListNextBtnId"
              >
                <GrLinkNext size="20" style={{ padding: "5px" }} />
              </div>
            )}
            {BookingListState.bookinglist?.data?.data?.totalNoOfRecords > 10 &&
            BookingListState.bookinglist?.data?.data?.pageNo !==
              BookingListState.bookinglist?.data?.data?.totalNoOfPages ? (
              <div
                onClick={() => {
                  setpageNo(
                    BookingListState.bookinglist?.data?.data?.totalNoOfPages
                  );
                  BookingListAPI({
                    ...filter,
                    page: BookingListState.bookinglist?.data?.data
                      ?.totalNoOfPages,
                  });
                }}
                className="paginationBtn"
                id="bookingListLastPageBtnId"
              >
                <MdOutlineLastPage size="20" style={{ padding: "5px" }} />
              </div>
            ) : null}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default BookingList;
