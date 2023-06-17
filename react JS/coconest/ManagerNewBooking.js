import * as React from "react";
import { useState } from "react";
import { Grid } from "@mui/material";
import "../NewBookings.css";
import { PATHS } from "../../routes/index";
import { useNavigate } from "react-router-dom";
import ManagerNavbar from "./ManagerNavbar";
import { TiArrowBack } from "react-icons/ti";
import { actions } from "../../store/module/Bookingmodule";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import moment from "moment";
import StaticContent from "../StatisContent";
import { toast } from "react-hot-toast";
import { httpService } from "../../api/Request/service"
import MANAGERHEADER from './ManagerAllScreenHeader';



const ManagerNewBooking = () => {
  const History = useNavigate();
  const [bookingType, setBookingType] = React.useState("")
  const [bookingFor, setBookingFor] = React.useState("")
  const [memberName, setMemberName] = useState('')
  const [checkIn, setCheckIn] = React.useState('')
  const [checkOut, setCheckOut] = React.useState('')
  const [paymentType, setPaymentType] = React.useState("")
  const [numberOfAdults, setNumberOfAdults] = React.useState('0')
  const [numberOfChildren, setNumberOfChildren] = React.useState('0')
  const [numberOfRooms, setNumberOfRooms] = React.useState('1')
  const [notes, setNotes] = React.useState('')
  const [name, setname] = useState('');
  const namelist = JSON.parse(sessionStorage.getItem('nameList'))
  const [errorStatus, setErrorStatus] = React.useState([]);
  const dispatch = useDispatch();
  const bookingState = useSelector((state) => state.booking);
  const userData = JSON.parse(sessionStorage.getItem('userData'))
  const hadleBookingSubmit = () => {
    setErrorStatus([]);
    let Booking_Payload = {
      "bookingFor": bookingFor,
      "bookingType": bookingType,
      "checkInDate": checkIn,
      "checkOutDate": checkOut,
      "guestName": bookingFor == "Self" ? userData.firstName : bookingFor == "Member" ? namelist.filter(ele => { if (ele?.userId == name) { return ele.firstName } })[0]?.firstName : memberName,
      "memberId": bookingFor == "Self" ? userData?.userId : bookingFor == "Member" ? name : name,
      "numOfAdults": numberOfAdults,
      "numOfChildren": numberOfChildren,
      "numOfRooms": numberOfRooms,
      "paymentType": paymentType,
      "remarks": notes
    };
    httpService({ url: "/bookings", data: Booking_Payload, method: "POST", })
      .then((res) => {
        console.log(res)
        notify();
        History(PATHS.MANAGERBOOKINGMANAGEMENT);
      })
      .catch(e => {
        setErrorStatus([...e?.error?.response?.data?.data]);
      })
  };

  const notify = () => toast.success(("Successfully booked the room"), {
    duration: 4000,
    position: "top-center"
  });
  useEffect(() => {
    console.log("---------------------", paymentType);
  })
  useEffect(() => {
    if (bookingState.newBookingData?.statusCode == StaticContent.Status201) {
      History(PATHS.MANAGERBOOKINGMANAGEMENT);
      notify()
      dispatch(actions.resetState())
    }
    if (bookingState.newBookingData?.statusCode == StaticContent.Status403) {
      console.log("====>")
    }
  }, [bookingState.newBookingData])

  useEffect(() => {
    if (bookingState.newBookingData?.statusCode == StaticContent.Status403) {
      History(PATHS.MANAGERBOOKINGMANAGEMENT);
      dispatch(actions.resetState())
    }
  }, [bookingState.newBookingData])



  return (
    <div>
      <ManagerNavbar />
      <MANAGERHEADER />
      <Grid container>

        <Grid container>
          <div className="newBookingsMainContainer">

            <Grid
              container
              style={{ padding: "20px" }}
              className="newBookingsContainer"
            >
              <Grid xs={5} className="backIconDiv">
                <TiArrowBack onClick={() => History(PATHS.MANAGERBOOKINGMANAGEMENT)} id="newBookingsBackBtnId" size={30} />
              </Grid>
              <Grid xs={6}
                style={{
                  textAlign: "start",
                  fontWeight: "900",
                  fontSize: 18,
                }}
              >
                New Bookings
              </Grid>
              <Grid>
                <ul>
                  {errorStatus.map((ele) => (
                    <li key={ele} style={{ color: "red" }}>
                      {'\u2022'}{'  '}{ele}
                    </li>
                  ))}
                </ul>
              </Grid>
            </Grid>
            <Grid container className="formContainer">
              <Grid container>
                <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                  <div className="customSelect bookingType">
                    <label htmlFor="bookingtype">Booking Type<span className="required">*</span></label>

                    <select id="newBookingsBookingTypeId" onChange={(event) => setBookingType(event.target.value)}>
                      <option value="" diabled selected hidden >---Select---</option>
                      <option value="Room" id="newBookingsRoomBookingID">Room Booking</option>
                      <option value="Day" id="newBookingsSpecialBookingId">Special Day Booking</option>
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
                  <label htmlFor="paymentdetails">Payment Type <span className="required">*</span> </label>
                  <div className="customSelect typesOfPayment" id="newBookingsTypeOfPaymentId" >
                    <select onChange={(event) => setPaymentType(event.target.value)}>
                      <option value="" diabled selected hidden >---Select---</option>
                      <option value="Points" id="newBookingsFreeBookingsId">Points</option>
                      <option value="Direct Payment" id="newBookingsCoinId">Direct Payment</option>

                    </select>
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                  <div className="customSelect bookingType" >
                    <label htmlFor="bookingfor">Booking For<span className="required">*</span></label>

                    <select id="newBookingsBookingForId" onChange={(event) => setBookingFor(event.target.value)}>
                      <option value="" diabled selected hidden >---Select---</option>
                      <option value="Member" id="newBookingOnBehalfOfAnotherMemberId">On behalf of another member</option>
                      <option value="Non-member" id="newBookingsNon-memberId">Non-Member</option>
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
                >{bookingFor == "Non-member" ? <label htmlFor="membername">Guest Name<span className="required">*</span> </label> : <label htmlFor="membername">Guest Name<span className="required">*</span></label>}
                  {bookingFor == "Self" ?
                    <input
                      type="text"
                      className="member"
                      id="newBookingsMemberNameId"
                      value={userData.firstName + " " + userData.lastName}
                      readOnly
                      disabled
                    />
                    :
                    bookingFor == "Member" ?
                      <select onChange={(event) => { setname(event.target.value) }}>
                        <option value="" selected disabled>---Select---</option>
                        {namelist && namelist.map((name) => {
                          return (
                            <option key={name} value={name.userId}>{name.firstName} {name.lastName}</option>
                          )
                        })}
                      </select> :

                      <input
                        type="text"
                        className="member"
                        id="newBookingsMemberNameId"
                        value={memberName}

                        onChange={(event) => { setMemberName(event.target.value) }}

                      />}



                </Grid>
              </Grid>
              <Grid container className="bookingRowAlign notesGrid" >
                <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} className="room">
                  <label htmlFor="membername">Billing Member Name </label>
                  {bookingFor == "Non-member" ?
                    <select onChange={(event) => { setname(event.target.value) }}>
                      <option value="" disabled selected hidden>---Selected---</option>
                      {namelist && namelist.map((name) => {
                        return (
                          <option key={name} value={name.userId}>{name.firstName} {name.lastName}</option>
                        )
                      })}
                    </select>
                    :
                    bookingFor == "Member" ?
                      <input
                        type="text"
                        className="member"
                        id="newBookingsMemberNameId"
                        value={namelist.filter(ele => { if (ele?.userId == name) { return ele.firstName } })[0]?.firstName + " " + namelist.filter(ele => { if (ele?.userId == name) { return ele.firstName } })[0]?.lastName}
                        readOnly
                        disabled
                      /> :
                      bookingFor == "Self" ?
                        <input
                          type="text"
                          className="member"
                          id="newBookingsMemberNameId"
                          value={userData.firstName + " " + userData.lastName}
                          readOnly
                          disabled
                        />
                        :
                        <input
                          type="text"
                          className="member"
                          id="newBookingsMemberNameId"
                          disabled
                          readOnly
                        />
                  }
                </Grid>
                <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} className="room">
                  {bookingType == "Day" ?
                    <div>
                      <label htmlFor="numberofrooms">Number of Rooms <span className="required">*</span></label>
                      <input type="text" className="addUserInputField" value="0" readOnly disabled></input>
                    </div>
                    :
                    <div>
                      <label htmlFor="numberofrooms">Number of Rooms <span className="required">*</span></label>

                      <select id="newBookinsNumberOfRoomsId" onChange={(event) => setNumberOfRooms(event.target.value)}>
                        <option value="1" id="newBookingsRoom1Id">1</option>
                        <option value="2" id="newBookingsRoom2Id">2</option>

                        <option value="3" id="newBookingsRoom3Id">3</option>
                        <option value="4" id="newBookingsRoom4Id">4</option>
                      </select>
                    </div>
                  }
                </Grid>
              </Grid>
              <Grid container className="bookingRowAlign">
                <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                  <label htmlFor="bookingfrom">Check In<span className="required">*</span></label>

                  <input
                    type="date"
                    name="bookingfrom"
                    id="bookingfrom"
                    className="formdatepicker"
                    onChange={event => setCheckIn(moment(event.target.value).format('YYYY-MM-DD'))}
                  ></input>
                </Grid>
                <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} className="checkOut">
                  <label htmlFor="bookingto">Check Out<span className="required">*</span></label>
                  <input
                    type="date"
                    name="bookingto"
                    id="bookingto"
                    className="formdatepicker"
                    onChange={event => setCheckOut(moment(event.target.value).format('YYYY-MM-DD'))}
                  ></input>
                </Grid>
                <Grid xs={0} sm={1.5} md={1.5} lg={1.5} xl={1.5}></Grid>
              </Grid>
              <Grid container className="bookingRowAlign">
                <Grid
                  xs={12}
                  sm={5.5}
                  md={5.5}
                  lg={5.5}
                  xl={5.5}
                  className="adults"
                >
                  {bookingType == "Day" ? <div className="adultsDiv">
                    <label htmlFor="numberofadults">No of Adults <span className="required">*</span></label>
                    <input
                      type="number"
                      id="number1"
                      className="numOfAdults"
                      min="1"
                      value={numberOfAdults}
                      disabled
                      readOnly
                      onChange={event => setNumberOfAdults(event.target.value)}
                      style={{ width: "95%" }}
                    />
                  </div> :
                    <div className="adultsDiv">
                      <label htmlFor="numberofadults">No of Adults <span className="required">*</span></label>
                      <input
                        type="number"
                        id="number1"
                        className="numOfAdults"
                        min="1"
                        value={numberOfAdults}
                        onChange={event => setNumberOfAdults(event.target.value)}
                        style={{ width: "95%" }}
                      />
                    </div>
                  }
                </Grid>

                <Grid xs={0} sm={1} md={1} lg={1} xl={1}></Grid>
                <Grid
                  xs={12}
                  sm={5.5}
                  md={5.5}
                  lg={5.5}
                  xl={5.5}
                  className="children"
                >
                  {bookingType == "Day" ? <div className="childrenDiv">
                    <label htmlFor="numberofchildren">No of Children</label>
                    <input
                      type="number"
                      id="number1"
                      className="numOfAdults"
                      min="0"
                      value={numberOfChildren}
                      disabled
                      readOnly
                      onChange={event => setNumberOfChildren(event.target.value)}
                      style={{ width: "95%" }}
                    />
                  </div> :
                    <div className="childrenDiv">
                      <label htmlFor="numberofchildren">No of Children</label>
                      <input
                        type="number"
                        id="number1"
                        className="numOfAdults"
                        min="0"
                        value={numberOfChildren}
                        onChange={event => setNumberOfChildren(event.target.value)}
                        style={{ width: "95%" }}
                      />
                    </div>}
                </Grid>
              </Grid>
              {bookingType === "Room" ? <div className="notesAlertDiv">*Maximum 3 adults or Maximum 2 adults and 2 children per room</div> : <div></div>}

              <Grid container className="bookingRowAlign notesGrid" >
                <label htmlFor="notes">Remarks</label>
                <textarea
                  className="notes"
                  id="editBookingsNotesBtnId"
                  value={notes}
                  onChange={event => setNotes(event.target.value)}
                ></textarea>
              </Grid>
              <Grid xs={12} className="bookButtonDiv">
                <div onClick={() => History(PATHS.MANAGERBOOKINGMANAGEMENT)} id="newBookingBackBtnId" className="pointDetails_Previous">Back
                </div>
                <div id="newBookingBookBtnId" onClick={() => { hadleBookingSubmit() }} className="pointDetails_Next">Book</div>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ManagerNewBooking;
