import React from "react";
import "./SuperButton.css";

export default function SuperButton({ buttonText = "HOVER ME" }) {
  return <button className="opt1">{buttonText}</button>;
}
