import * as React from "react";
import { useDispatch } from "react-redux";
import { actions } from "../../store/module/Bookingmodule"
import { Grid } from "@mui/material";
import "../NewBookings.css";
import { PATHS } from "../../routes/index";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { TiArrowBack } from "react-icons/ti";
import MemberNavbar from "./MemberNavbar";
import StaticContent from "../StatisContent";
import Loader from '../Loader';
import moment from "moment";
import { toast } from "react-hot-toast";
import { postBooking } from "../../api/Api";
import MemberHeader from "./MemberHeader";


const MemberNewBooking = () => {
  const History = useNavigate();
  const [bookingType, setBookingType] = React.useState("")
  const [bookingFor, setBookingFor] = React.useState("")
  const [memberName, setMemberName] = React.useState('')
  const [checkIn, setCheckIn] = React.useState('')
  const [checkOut, setCheckOut] = React.useState('')
  const [paymentType, setPaymentType] = React.useState('')
  const [numberOfAdults, setNumberOfAdults] = React.useState('0')
  const [numberOfChildren, setNumberOfChildren] = React.useState('0')
  const [numberOfRooms, setNumberOfRooms] = React.useState('1')
  const [notes, setNotes] = React.useState('')
  const [loading, setloading] = React.useState(false)
  const [errorStatus, setErrorStatus] = React.useState([]);
  const dispatch = useDispatch();
  const bookingState = useSelector((state) => state.booking);

  const userData = JSON.parse(sessionStorage.getItem('userData'))
  const handleBookingSubmit = () => {
    setErrorStatus([]);
    setloading(true)
    const Booking_Payload = {
      END_POINT: "bookings",
      PAYLOAD_DATA: JSON.stringify({
        "bookingFor": bookingFor,
        "bookingType": bookingType,
        "checkInDate": checkIn,
        "checkOutDate": checkOut,
        "guestName": bookingFor == "Self" ? userData.firstName : memberName,
        "memberId": userData.userId,
        "numOfAdults": parseInt(numberOfAdults),
        "numOfChildren": parseInt(numberOfChildren),
        "numOfRooms": parseInt(numberOfRooms),
        "remarks": notes,
        "paymentType": paymentType,

      }),
    };
    postBooking(Booking_Payload)
      .then(res => {
        History(PATHS.MEMBERBOOKINGMANAGEMENT)
        notify()
      })
      .catch(e => {
        setErrorStatus([...e?.status?.errorMessage]);
        setloading(false)
      });
  }
  const notify = () => toast.success(("Successfully booked the room"), {
    duration: 4000,
    position: "top-center"
  });

  useEffect(() => {
    if (bookingState.newBookingData?.statusCode == StaticContent.Status201) {
      History(PATHS.MEMBERBOOKINGMANAGEMENT);
      notify()
      dispatch(actions.resetState())
    }
    if (bookingState.newBookingData?.statusCode == StaticContent.Status403) {
    }
  }, [bookingState.newBookingData])

  useEffect(() => {
    if (bookingState.newBookingData?.statusCode == StaticContent.Status403) {
      History(PATHS.MEMBERBOOKINGMANAGEMENT);
      dispatch(actions.resetState())
    }
  }, [bookingState.newBookingData])


  return (
    <div>

      <MemberNavbar />
      <MemberHeader />
      <Loader load={loading} />
      <Grid container>
        <div className="newBookingsMainContainer">

          <Grid
            container
            style={{ padding: "20px" }}
            className="newBookingsContainer"
          >
            <Grid xs={5} className="backIconDiv">
              <TiArrowBack onClick={() => History(PATHS.MEMBERBOOKINGMANAGEMENT)} id="memberNewBookingsBackBtnId" size={30} />
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

                  <select id="memberNewBookingsBookingTypeId" onChange={(event) => setBookingType(event.target.value)}>
                    <option value="" diabled selected hidden >---Select---</option>
                    <option value="Room" id="memberNewBookingsRoomBookingID" name="bookingTypename">Room Booking</option>
                    <option value="Day" id="memberNewBookingsSpecialBookingId" name="bookingTypename">Special Day Booking</option>
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
                <div className="customSelect typesOfPayment" id="memberNewBookingsTypeOfPaymentId" >
                  <select onChange={(event) => setPaymentType(event.target.value)}>
                    <option value="" diabled selected hidden >---Select---</option>
                    <option value="Points" id="memberNewBookingsFreeBookingsId">Points</option>
                    <option value="Direct Payment" id="memberNewBookingsCoinId">Direct Payment</option>

                  </select>
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                <div className="customSelect bookingType" >
                  <label htmlFor="bookingfor">Booking For<span className="required">*</span></label>

                  <select id="memberNewBookingsBookingForId" onChange={(event) => setBookingFor(event.target.value)}>
                    <option value="" diabled selected hidden >---Select---</option>
                    <option value="Self" id="memberNewBookingsSelfId">Self</option>

                    <option value="Non-Member" id="memberNewBookingsNonmemberId">Non-Member</option>
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
              >{bookingFor == "Self" ? <label htmlFor="membername">Guest Name<span className="required">*</span> </label> : <label htmlFor="membername">Guest Name<span className="required">*</span></label>}
                {bookingFor == "Self" ?

                  <input
                    type="text"
                    className="member"
                    id="memberNewBookingsMemberNameId"
                    autoComplete="on"
                    value={userData?.firstName + " " + userData?.lastName}
                    readOnly
                  />
                  :
                  <input
                    type="text"
                    className="member"
                    id="memberNewBookingsMemberNameId"
                    value={memberName}

                    onChange={(event) => { setMemberName(event.target.value) }}

                  />}



              </Grid>
            </Grid>
            <Grid container className="bookingRowAlign">
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5}>
                <label htmlFor="bookingfrom">Check In<span className="required">*</span></label>

                <input
                  type="date"
                  name="bookingfrom"
                  id="bookingfrom"
                  className='formdatepicker'
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
                  className='formdatepicker'
                  onChange={event => setCheckOut(moment(event.target.value).format('YYYY-MM-DD'))}
                ></input>
              </Grid>
              <Grid xs={0} sm={1.5} md={1.5} lg={1.5} xl={1.5}></Grid>
            </Grid>
            <Grid container className="bookingRowAlign">
              <Grid
                xs={6}
                sm={3}
                md={3}
                lg={3}
                xl={3}
                className="adults"
              >
                {bookingType === "Day" ? <div className="adultsDiv">
                  <label htmlFor="numberofadults">No of Adults <span className="required">*</span></label>
                  <input
                    type="number"
                    id="number1"
                    className="numOfAdults"
                    min="1"
                    value={numberOfAdults}
                    readOnly
                    disabled
                    onChange={event => setNumberOfAdults(event.target.value)}
                    style={{ width: "74%" }}
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
                      style={{ width: "74%" }}
                    />
                  </div>}
              </Grid>
              <Grid
                xs={6}
                sm={3}
                md={3}
                lg={3}
                xl={3}
                className="children"
              >
                {bookingType == "Day" ? <div className="childrenDiv">
                  <label htmlFor="numberofchildren">No of Children</label>
                  <input
                    type="number"
                    id="number1"
                    className="numOfChildren"
                    min="0"
                    value={numberOfChildren}
                    readOnly
                    disabled
                    onChange={event => setNumberOfChildren(event.target.value)}
                    style={{ width: "74%" }}
                  />
                </div> :
                  <div className="childrenDiv">
                    <label htmlFor="numberofchildren">No of Children</label>
                    <input
                      type="number"
                      id="number1"
                      className="numOfChildren"
                      min="0"
                      value={numberOfChildren}
                      onChange={event => setNumberOfChildren(event.target.value)}
                      style={{ width: "74%" }}
                    />
                  </div>}
              </Grid>
              <Grid xs={0} sm={0.5} md={0.5} lg={0.5} xl={0.5}></Grid>
              <Grid xs={12} sm={5.5} md={5.5} lg={5.5} xl={5.5} className="room">
                {bookingType == "Day" ?
                  <div>
                    <label htmlFor="numberofrooms">Number of Rooms <span className="required">*</span></label>
                    <input type="text" className="addUserInputField" value="0" readOnly disabled></input>
                  </div>
                  :
                  <div>
                    <label htmlFor="numberofrooms">Number of Rooms <span className="required">*</span></label>

                    <select id="memberNewBookinsNumberOfRoomsId" onChange={(event) => setNumberOfRooms(event.target.value)}>
                      <option value="1" id="memberNewBookingsRoom1Id">1</option>
                      <option value="2" id="memberNewBookingsRoom2Id">2</option>
                      <option value="3" id="memberNewBookingsRoom3Id">3</option>
                      <option value="4" id="memberNewBookingsRoom4Id">4</option>
                    </select>
                  </div>
                }
              </Grid>
            </Grid>
            {bookingType === "Room" ? <div className="notesAlertDiv">*Maximum 3 adults or Maximum 2 adults and 2 children per room</div> : <div></div>}

            <Grid container className="bookingRowAlign notesGrid" >
              <label htmlFor="notes">Remarks</label>
              <textarea
                className="notes"
                id="memberNewBookingsNotesBtnId"
                value={notes}
                onChange={event => setNotes(event.target.value)}
              ></textarea>
            </Grid>
            <Grid xs={12} className="bookButtonDiv">
              <div onClick={() => History(PATHS.MEMBERBOOKINGMANAGEMENT)} id="memberNewBackBtnId" className="pointDetails_Previous">Back
              </div>
              <div onClick={() => { handleBookingSubmit() }} id="memberNewBookingsBookBtnId" className="pointDetails_Next">Book</div>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </div>
  );
};

export default MemberNewBooking;
