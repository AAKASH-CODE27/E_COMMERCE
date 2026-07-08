import React from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import PaymentIcon from "@mui/icons-material/Payment";
import Typography from "@mui/material/Typography";
import "../CartStyles/CheckoutPath.css";

function CheckoutSteps({ activeStep }) {
  const steps = [
    {
      label: <Typography>Shipping Details</Typography>,
      icon: <LocalShippingIcon />,
    },
    {
      label: <Typography>Confirm Order</Typography>,
      icon: <LibraryAddCheckIcon />,
    },
    {
      label: <Typography>Payment</Typography>,
      icon: <PaymentIcon />,
    },
  ];

  return (
    <div className="checkoutPath">
      {steps.map((item, index) => (
        <div
          key={index}
          className="checkoutPath-step"
          active={index === activeStep ? "true" : "false"}
          completed={index < activeStep ? "true" : "false"}
        >
          <div className="checkoutPath-icon">{item.icon}</div>
          <div className="checkoutPath-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default CheckoutSteps;
