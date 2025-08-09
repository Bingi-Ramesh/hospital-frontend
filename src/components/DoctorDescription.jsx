// DoctorDescription.jsx

import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const DoctorDescription = () => {
  const { id } = useParams();
  const location = useLocation();
  const apiBase = import.meta.env.VITE_BACKEND_URL?.trim();

  const [doctor, setDoctor] = useState(location.state?.doctor || null);

  useEffect(() => {
    if (!doctor) {
      axios.get(`${apiBase}/api/doctors/${id}`)
        .then(res => setDoctor(res.data))
        .catch(err => console.error(err));
    }
  }, [doctor, id, apiBase]);

  if (!doctor) return <p>Loading...</p>;

  return (
    <div
    style={{
      maxWidth: "400px",
      margin: "20px auto",
      padding: "20px",
      borderRadius: "12px",
      border: "3px solid #ccc", // thick border
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <img
      src={
        doctor.profileImg
          ? `${apiBase}${doctor.profileImg}`
          : "/default-profile.jpg"
      }
      alt={doctor.fullname || "Doctor"}
      style={{
        width: 110,
        height: 110,
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #888",
        marginBottom: "15px",
      }}
    />
    <h2 style={{ margin: "10px 0", fontSize: "1.4rem" }}>
     Dr. {doctor.fullname}
    </h2>
    <h4 style={{ margin: "5px 0",  }}>
       <span style={{ fontWeight: "normal" }}>{doctor.specializations}</span>
    </h4>
    <p style={{ margin: "5px 0", fontWeight: "bold" }}>
      Age: <span style={{ fontWeight: "normal" }}>{doctor.age}</span>
    </p>
    <p style={{ margin: "5px 0", fontWeight: "bold" }}>
      Email: <span style={{ fontWeight: "normal" }}>{doctor.email}</span>
    </p>
    <p style={{ margin: "5px 0", fontWeight: "bold" }}>
      Experience:{" "}
      <span style={{ fontWeight: "normal" }}>{doctor.experience} </span>
    </p>
    <p
      style={{
        marginTop: "15px",
        fontStyle: "italic",
        color: "#555",
        whiteSpace: "pre-line",
        textAlign:"justify"
      }}
    >
        Dr. {doctor.fullname} has a specialization in {doctor.specializations} and having more than {doctor.experience} of experience in our Hospital.
      {doctor.description}
    </p>
  </div>
  );
};

export default DoctorDescription;

