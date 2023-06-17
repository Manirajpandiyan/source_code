import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import "./NewBookings.css";
import { PATHS } from "../routes/index";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { TiArrowBack } from "react-icons/ti";
import { actions as Bookingactions } from "../store/module/Bookingmodule";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import StaticContent from "./StatisContent";
import { toast } from "react-hot-toast";
import { httpService } from "../api/Request/service";
import Header from "../components/AllScreenHeader";

const EditBookings = () => {
  const History = useNavigate();
  const dispatch = useDispatch();
  const Location = useLocation();
  const BookingState = useSelector((state) => state.booking);

  const [bookingType, setBookingType] = React.useState("");
  const [bookingFor, setBookingFor] = React.useState("");
  const [nonMemberName, setNonMemberName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [checkIn, setCheckIn] = React.useState("");
  const [checkOut, setCheckOut] = React.useState("");
  const [paymentType, setPaymentType] = React.useState("");
  const [numberOfAdults, setNumberOfAdults] = React.useState("");
  const [numberOfChildren, setNumberOfChildren] = React.useState("");
  const [numberOfRooms, setNumberOfRooms] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [errorStatus, setErrorStatus] = useState([]);
  const [mebmerlistData, setMebmerlistData] = useState({});

  const handleBookingSubmit = async () => {
    let data = {
      bookingFor: bookingFor,
      bookingType: bookingType,
      checkInDate: checkIn,
      checkOutDate: moment(checkOut).format("YYYY-MM-DD"),
      guestName: memberName,
      memberId: mebmerlistData?.memberId,
      numOfAdults: numberOfAdults,
      numOfChildren: numberOfChildren,
      numOfRooms: numberOfRooms,
      paymentType: paymentType,
      remarks: notes,
    };

    console.log("", data);

    httpService({
      url: `/bookings/${Location.state.bookingId}`,
      data: data,
      method: "PUT",
    })
      .then((res) => {
        notify();
        History(PATHS.BOOKINGLIST);
      })
      .catch((e) => {
        setErrorStatus([...e?.error?.response?.data?.data]);
      });
  };

  useEffect(() => {
    const BOOKING_PAYLOAD = {
      END_POINT1: "bookings",
      END_POINT2: Location.state.bookingId,
    };
    console.log("BOOKING_PAYLOAD ===>", BOOKING_PAYLOAD);
    dispatch(Bookingactions.fetchbooking(BOOKING_PAYLOAD));
  }, []);

  useEffect(() => {
    if (BookingState.viewbooking?.data.statusCode == StaticContent.Status200) {
      console.log("BOOKING_PAYLOAD ===>", BookingState.viewbooking.data);
      setMebmerlistData(BookingState.viewbooking.data.data);
      setBookingType(BookingState.viewbooking.data.data.bookingType);
      setBookingFor(BookingState.viewbooking.data.data.bookingFor);
      setNonMemberName(BookingState.viewbooking.data.data.guestName);
      setMemberName(BookingState.viewbooking.data.data.guestName);
      setCheckIn(
        moment(BookingState.viewbooking.data.data.checkInDate).format(
          "YYYY-MM-DD"
        )
      );
      setCheckOut(
        moment(BookingState.viewbooking.data.data.checkOutDate).format(
          "YYYY-MM-DD"
        )
      );
      setNumberOfAdults(BookingState.viewbooking.data.data.numOfAdults);
      setNumberOfChildren(BookingState.viewbooking.data.data.numOfChildren);
      setPaymentType(BookingState.viewbooking.data.data.paymentType);
      setNumberOfRooms(
        BookingState.viewbooking.data.data.numOfRooms.toString()
      );
      setNotes(BookingState.viewbooking.data.data.remarks);
    }
  }, [BookingState.viewbooking]);

  const notify = () =>
    toast.success("Successfully updated the booking", {
      duration: 4000,
      position: "top-center",
    });

  useEffect(() => {
    console.log("update response>>>", BookingState.updateBookingResonse);
    if (
      BookingState.updateBookingResonse?.statusCode == StaticContent.Status201
    ) {
      dispatch(Bookingactions.resetState());
      History(PATHS.BOOKINGLIST);
      notify();
    }
    if (
      BookingState.updateBookingResonse?.statusCode == StaticContent.Status403
    ) {
      console.log("00", Error);
    }
  }, [BookingState.updateBookingResonse]);

  return (
    <div>
      <Navbar />
      <Header />
      <Grid container>
        <div className="newBookingsMainContainer">
          <Grid
            container
            style={{ padding: "20px" }}
            className="newBookingsContainer"
          >
            <Grid xs={3} className="backIconDiv">
              <TiArrowBack
                onClick={() => History(PATHS.BOOKINGLIST)}
                size={30}
                id="editBookingsBackBtnid"
              />
            </Grid>
            <Grid
              xs={6}
              style={{
                textAlign: "center",
                fontWeight: "900",
                fontSize: 18,
              }}
            >
              Edit Bookings
            </Grid>
            <Grid>
              <ul>
                {errorStatus.map((ele) => (
                  <li key={ele} style={{ color: "red", paddingTop: "15px" }}>
                    {"\u2022"}
                    {"  "}
                    {ele}
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
          <Grid container className="formContainer">
            <Grid container>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                <div
                  className="customSelect bookingType"
                  id="editBookingBookingTypeDropdownId"
                >
                  <label htmlFor="bookingtype">Booking Type</label>{" "}
                  <span className="required">*</span>
                  <select
                    id="editBookingTypeId"
                    onChange={(event) => setBookingType(event.target.value)}
                    value={bookingType}
                    disabled
                  >
                    <option value="Room" id="editRoomBookingID">
                      Room Booking
                    </option>
                    <option value="Day" id="editSpecialBookingId">
                      Special Day Booking
                    </option>
                  </select>
                </div>
              </Grid>
              <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
              <Grid
                xs={12}
                sm={5.5}
                md={5.5}
                lg={5.5}
                xl={5.5}
                className="paymentDetails"
              >
                <label htmlFor="paymentdetails">Payment Type </label>
                <div
                  className="customSelect typesOfPayment"
                  id="editBookingPaymentTypeId"
                >
                  <input
                    type="text"
                    className="addUserInputField"
                    id="editPayemntType"
                    value={paymentType}
                    readOnly
                    disabled
                  ></input>
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                <div
                  className="customSelect bookingType"
                  id="editBookingBookingForDropdownId"
                >
                  <label htmlFor="bookingfor">Booking For</label>{" "}
                  <span className="required">*</span>
                  <select
                    id="editBookingsBookingForId"
                    onChange={(event) => setBookingFor(event.target.value)}
                    value={bookingFor}
                    disabled
                  >
                    <option value="Self" id="editBookingsSelfId">
                      Self
                    </option>
                    <option value="Member" id="editBookingsMemberId">
                      On behalf of another member
                    </option>
                    <option value="Non-Member" id="editBookingsNon-memberId">
                      Non-Member
                    </option>
                  </select>
                </div>
              </Grid>
              <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
              <Grid
                xs={12}
                sm={5.5}
                md={5.5}
                lg={5.5}
                xl={5.5}
                style={{ marginTop: "15px" }}
              >
                <label htmlFor="membername">Guest Name </label>
                <input
                  type="text"
                  className="member"
                  id="editBookingsMemberNameId"
                  value={memberName}
                  disabled
                  onChange={(event) => {
                    setMemberName(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container className="bookingRowAlign">
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                <label htmlFor="bookingfrom">Check In</label>
                <span className="required">*</span>
                <input
                  type="date"
                  name="bookingfrom"
                  id="bookingfrom"
                  className="formdatepicker"
                  value={checkIn}
                  onChange={(event) =>
                    setCheckIn(moment(event.target.value).format("YYYY-MM-DD"))
                  }
                ></input>
              </Grid>

              <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
              <Grid
                xs={12}
                sm={5.5}
                md={5.5}
                lg={5.5}
                xl={5.5}
                className="checkOut"
              >
                <label htmlFor="bookingto">Check Out</label>
                <span className="required">*</span>
                <input
                  type="date"
                  name="bookingto"
                  id="bookingto"
                  className="formdatepicker"
                  onChange={(event) =>
                    setCheckOut(moment(event.target.value).format("YYYY-MM-DD"))
                  }
                  value={checkOut}
                ></input>
              </Grid>
              <Grid xs={0} sm={1.5} md={1.5} lg={1.5} xl={1.5}></Grid>
            </Grid>
            <Grid container className="bookingRowAlign">
              <Grid xs={6} sm={3} md={3} lg={3} xl={3} className="adults">
                <div className="adultsDiv">
                  <label htmlFor="numberofadults">No of Adults</label>
                  <span className="required">*</span>
                  <input
                    type="number"
                    id="number1"
                    className="numOfAdults"
                    min="0"
                    value={numberOfAdults}
                    onChange={(event) => setNumberOfAdults(event.target.value)}
                    style={{ width: "80%" }}
                  />
                </div>
              </Grid>
              <Grid xs={6} sm={3} md={3} lg={3} xl={3} className="children">
                <div className="childrenDiv">
                  <label htmlFor="numberofchildren">No of Children</label>
                  <input
                    type="number"
                    id="number1"
                    className="numOfChildren"
                    min="0"
                    value={numberOfChildren}
                    style={{ width: "80%" }}
                    onChange={(event) =>
                      setNumberOfChildren(event.target.value)
                    }
                  />
                </div>
              </Grid>
              <Grid xs={0} sm={0.5} md={0.5} lg={0.5} xl={0.5}></Grid>
              <Grid
                xs={12}
                sm={5.5}
                md={5.5}
                lg={5.5}
                xl={5.5}
                className="room"
              >
                <label htmlFor="numberofrooms">Number of Rooms</label>
                <span className="required">*</span>

                <select
                  id="newBookinsNumberOfRoomsId"
                  onChange={(event) => setNumberOfRooms(event.target.value)}
                  value={numberOfRooms}
                >
                  <option value="1" id="newBookingsRoom1Id">
                    1
                  </option>
                  <option value="2" id="newBookingsRoom2Id">
                    2
                  </option>
                  <option value="3" id="newBookingsRoom3Id">
                    3
                  </option>
                  <option value="4" id="newBookingsRoom4Id">
                    4
                  </option>
                </select>
              </Grid>
            </Grid>
            <Grid container className="bookingRowAlign notesGrid">
              <label htmlFor="notes">Remarks</label>
              <textarea
                className="notes"
                id="editBookingsRemarksBtnId"
                value={notes}
                maxLength={1024}
                onChange={(event) => setNotes(event.target.value)}
              ></textarea>
            </Grid>
            <Grid container>
              <Grid xs={12} className="bookButtonDiv">
                <div
                  onClick={() => History(PATHS.BOOKINGLIST)}
                  id="editBookingBackBtnId"
                  className="pointDetails_Previous"
                >
                  Back
                </div>
                <div
                  onClick={() => handleBookingSubmit()}
                  id="editBookingSaveBtnId"
                  className="pointDetails_Next"
                >
                  Save
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </div>
  );
};

export default EditBookings;
