import React, { useState } from "react";
import "../CartStyles/Shipping.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";

function Shipping() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [pincode, setPincode] = useState(shippingInfo.pincode || "");
  const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || "");

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10) {
      toast.error("Phone number must be exactly 10 digits", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(
      saveShippingInfo({
        address,
        city,
        state,
        country,
        pincode: Number(pincode),
        phoneNumber: Number(phoneNumber),
      })
    );

    navigate("/order/confirm");
  };

  return (
    <>
      <PageTitle title="Shipping Details" />
      <Navbar />

      <CheckoutSteps activeStep={0} />

      <div className="shipping-form-container">
        <h2 className="shipping-form-header">Shipping Details</h2>

        <form className="shipping-form" onSubmit={shippingSubmit}>
          <div className="shipping-section">
            <div className="shipping-form-group">
              <label>
                <HomeIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
                Address
              </label>
              <input
                type="text"
                placeholder="Enter street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="shipping-form-group">
              <label>
                <LocationCityIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="shipping-form-group">
              <label>
                <PinDropIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
                Pin Code
              </label>
              <input
                type="number"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="shipping-section">
            <div className="shipping-form-group">
              <label>
                <PhoneIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
                Phone Number
              </label>
              <input
                type="number"
                placeholder="Enter 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="shipping-form-group">
              <label>
                <PublicIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Choose Country</option>
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>

            <div className="shipping-form-group">
              <label>
                <TransferWithinAStationIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
                State
              </label>
              <input
                type="text"
                placeholder="Enter state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="shipping-submit-btn">
            Continue
          </button>
        </form>
      </div>
    </>
  );
}

export default Shipping;
