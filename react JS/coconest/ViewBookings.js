import * as React from "react";
import { Grid } from "@mui/material";
import { PATHS } from "../routes/index";
import { useNavigate, useLocation } from "react-router-dom";
import { TiArrowBack } from 'react-icons/ti';
import Navbar from "./Navbar";
import { actions as Bookingactions } from "../store/module/Bookingmodule";
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useEffect } from 'react';
import Header from '../components/AllScreenHeader';

const ViewBookings = () => {
  const History = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const BookingState = useSelector(state => state.booking);
  useEffect(() => {
    const VIEWBOOKING_PAYLOAD = {
      END_POINT1: "bookings",
      END_POINT2: location.state.bookingId
    }
    dispatch(Bookingactions.fetchbooking(VIEWBOOKING_PAYLOAD))
    console.log('location', location);
  }, [])

  useEffect(() => {
    console.log('BookingState', BookingState)
  }, [])


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
          <Grid xs={5} sm={5} md={5} lg={5.5} xl={5} className="backIconDiv">
            <TiArrowBack onClick={() => History(PATHS.BOOKINGLIST)} id="viewBookingsBackBtnId" size={30} />
          </Grid>
          <Grid
            xs={7}
            sm={7}
            md={7}
            lg={5.5}
            xl={7}
            style={{
              textAlign: "start",
              fontWeight: "900",
              fontSize: 18,
            }}
          >
            {" "}
            View Bookings
          </Grid>
        </Grid>
        <Grid container className="formContainer">
          <Grid container>
            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
              <div className="customSelect bookingType">
                <label htmlFor="bookingtype">Booking Type</label>
                <input type="text" className="addUserInputField" id="viewBookingsBookingTypeId" value={BookingState.viewbooking?.data.data.bookingType} readOnly></input>
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
              <div className="customSelect typesOfPayment">
                <label htmlFor="paymentdetails">Payment Type </label>
                <input type="text" id="viewBookingsPaymentTypeId" className="addUserInputField" value={BookingState.viewbooking?.data.data.paymentType} readOnly></input>
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
              <div className="customSelect bookingType">
                <label htmlFor="bookingfor">Booking For</label>
                <input type="text" id="viewBookingsBookingForId" className="addUserInputField" value={BookingState.viewbooking?.data.data.bookingFor} readOnly></input>
              </div>
            </Grid>
            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
            <Grid
              xs={12}
              sm={5.5}
              md={5.5}
              lg={5.5}
              xl={5.5}
              style={{ marginTop: "10px" }}
            >
              <label htmlFor="membername">Guest Name</label>
              <input type="text" className="member" id="viewBookingsMemberNameId" value={BookingState.viewbooking?.data.data.guestName}></input>
            </Grid>
          </Grid>
          <Grid container className="bookingRowAlign">
            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
              <label htmlFor="bookingfrom">Check In</label>
              <input
                type="text"
                name="bookingfrom"
                id="viewBookingsBookingFormId"
                value={moment(BookingState.viewbooking?.data.data.checkInDate).format('DD-MM-YYYY')}
                readOnly
                className="addUserInputField"
              ></input>
            </Grid>
            <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} className="checkOut">
              <label htmlFor="bookingto">Check Out</label>
              <input
                type="text"
                name="bookingto"
                id="viewBookingsBookingTOId"
                value={moment(BookingState.viewbooking?.data.data.checkOutDate).format('DD-MM-YYYY')}
                readOnly
                className="addUserInputField"
              ></input>
            </Grid>

          </Grid>
          <Grid container className="bookingRowAlign">
            <Grid
              xs={6} sm={3} md={3} lg={3} xl={3} className="adults"            >
              <label htmlFor="numberofadults">No of Adults</label>
              <input
                type="text"
                value={BookingState.viewbooking?.data.data.numOfAdults}
                id="viewBookingsNumberofAdultsId"
                readOnly
                className="addUserInputField"
                style={{ width: "80%" }}
              ></input>
            </Grid>
            <Grid
              xs={6}
              sm={3}
              md={3}
              lg={3}
              xl={3}
              className="children"
            >
              <label htmlFor="numberofchildren">No of Children</label>
              <input
                type="text"
                value={BookingState.viewbooking?.data.data.numOfChildren}
                id="viewBookingsNumberOfChildrenId"
                className="addUserInputField"
                readOnly
                min="0"
                style={{ width: "80%" }}
              ></input>
            </Grid>
            <Grid xs={0} sm={0.5} md={0.5} lg={0.5} xl={0.5}></Grid>
            <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} className="room">
              <label htmlFor="numberofrooms">Number of Rooms</label>
              <input type="text" className="addUserInputField" id="viewBookingsNumberOfRoomsId" value={BookingState.viewbooking?.data.data.numOfRooms} readOnly></input>
            </Grid>
          </Grid>
          <Grid container className="bookingRowAlign notesGrid">
            <label htmlFor="notes">Remarks</label>
            <textarea className="notes" value={BookingState.viewbooking?.data.data.remarks} id="viewBookingsNotesId" readOnly></textarea>
          </Grid>
          <Grid xs={12} className="bookButtonDiv">
            <div onClick={() => History(PATHS.BOOKINGLIST)} id="viewBookingsBackBtnId" className="pointDetails_Previous">Back</div>
          </Grid>
        </Grid>
      </div>
    </Grid>
    </div>
  );
};
export default ViewBookings;
