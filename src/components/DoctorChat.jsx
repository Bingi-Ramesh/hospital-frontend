// src/pages/DoctorChat.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

const SOCKET_SERVER_URL =
  import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:5000";

let socket;

const DoctorChat = () => {
  const location = useLocation();
  const doctor = location.state?.user || null;

  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");



// Global socket connection on mount
useEffect(() => {
  if (!doctor || !doctor._id) return;

  socket = io(SOCKET_SERVER_URL, { query: { senderId: doctor._id } });

  // Join doctor's personal room so they get all messages
  socket.emit("joinRoom", { receiverId: doctor._id, senderId: doctor._id });

  socket.on("receiveMessage", (data) => {
    // If message is for the currently open chat
    if (selectedPerson && data.senderId === selectedPerson.senderId) {
      setMessages((prev) => [...prev, data]);
    }

    // Update contacts if new sender not already in list
    setContacts((prev) => {
      if (!prev.find((p) => p.senderId === data.senderId)) {
        return [
          ...prev,
          {
            senderId: data.senderId,
            senderName: data.senderName,
            receiverId: data.senderId,
            receiverModel: data.senderModel,
          },
        ];
      }
      return prev;
    });
  });

  return () => {
    socket.disconnect();
  };
}, [doctor, selectedPerson]);

// Fetch messages when selecting a person (unchanged logic)
useEffect(() => {
  if (!doctor || !selectedPerson) return;

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${SOCKET_SERVER_URL}/api/messages/history`, {
        params: { user1: doctor._id, user2: selectedPerson.senderId },
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  fetchMessages();
}, [doctor, selectedPerson]);



  // Fetch all contacts
  useEffect(() => {
    if (!doctor || !doctor._id) {
      setError("No doctor found");
      return;
    }

    const fetchContacts = async () => {
      try {
        const res = await axios.get(
          `${SOCKET_SERVER_URL}/api/messages/doctor-chat`,
          { params: { doctorId: doctor._id } }
        );
        const allMessages = res.data.messages || [];
        const uniqueSenders = allMessages.reduce((acc, msg) => {
          if (!acc.find((m) => m.senderId === msg.senderId)) {
            acc.push({
              senderId: msg.senderId,
              senderName: msg.senderName,
              receiverId: msg.senderId,
              receiverModel: msg.senderModel,
            });
          }
          return acc;
        }, []);
        setContacts(uniqueSenders);
      } catch {
        setError("Failed to fetch contacts");
      }
    };

    fetchContacts();
  }, [doctor]);

  // Fetch messages & connect socket when a person is selected
  useEffect(() => {
    if (!doctor || !selectedPerson) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${SOCKET_SERVER_URL}/api/messages/history`,
          {
            params: {
              user1: doctor._id,
              user2: selectedPerson.senderId,
            },
          }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    // Connect to socket
    socket = io(SOCKET_SERVER_URL, {
      query: { receiverId: selectedPerson.senderId, senderId: doctor._id },
    });

    socket.emit("joinRoom", {
      receiverId: selectedPerson.senderId,
      senderId: doctor._id,
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [doctor, selectedPerson]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedPerson) return;

    const newMessage = {
      senderId: doctor._id,
      receiverId: selectedPerson.senderId,
      text: message,
      time: new Date().toLocaleTimeString(),
      senderModel: "Doctor",
      receiverModel: "Patient",
    };

    socket.emit("sendMessage", newMessage);

    try {
      await axios.post(
        `${SOCKET_SERVER_URL}/api/messages/register`,
        newMessage
      );
    } catch (err) {
      console.error("Error saving message:", err);
    }

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  if (!doctor) return <div>No doctor found</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f9f9f9" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          borderRight: "1px solid #ccc",
          backgroundColor: "#fff",
          padding: "10px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Contacts</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {contacts.map((person) => (
            <li
              key={person.senderId}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderRadius: "6px",
                marginBottom: "5px",
                backgroundColor:
                  selectedPerson?.senderId === person.senderId
                    ? "#e3f2fd"
                    : "transparent",
              }}
              onClick={() => setSelectedPerson(person)}
            >
              {person.senderName || "No fullname"}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat window */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {selectedPerson ? (
          <div
            style={{
              border: "1px solid #ccc",
              width: "400px",
              borderRadius: "10px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              height: "500px",
              backgroundColor: "white",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                padding: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Chat with {selectedPerson.senderName}
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                padding: "10px",
                overflowY: "auto",
                backgroundColor: "#f5f5f5",
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.senderId === doctor._id
                        ? "flex-end"
                        : "flex-start",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "8px 12px",
                      borderRadius: "15px",
                      backgroundColor:
                        msg.senderId === doctor._id ? "#1976d2" : "#e0e0e0",
                      color: msg.senderId === doctor._id ? "white" : "black",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                    <div
                      style={{
                        fontSize: "0.7rem",
                        marginTop: "3px",
                        textAlign: "right",
                        opacity: 0.7,
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                display: "flex",
                padding: "10px",
                borderTop: "1px solid #ccc",
                backgroundColor: "white",
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  flex: 1,
                  marginRight: "5px",
                  padding: "8px",
                  borderRadius: "20px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  padding: "8px 15px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "18px", color: "#888" }}>
            Select a person to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;
