import React from "react";
import { useParams } from "react-router-dom";

export default function BookingPage() {
  const { id } = useParams();
  return <div>single page: {id}</div>;
}
