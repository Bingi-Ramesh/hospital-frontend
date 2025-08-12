// src/components/Chat.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL?.trim();
let socket;

const Chat = () => {
  const location = useLocation();
  const { doctor, user } = location.state || {}; // user = patient

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!doctor || !user) return;

    // 1️⃣ Fetch previous chat messages
  // inside useEffect → fetchMessages()
const fetchMessages = async () => {
    try {
      let params;
      if (user.role === "Doctor") {
        // Doctor — show all messages sent *to* this doctor
        params = { receiverId: user._id };
      } else {
        // Patient — normal chat with selected doctor
        params = { user1: doctor._id, user2: user._id };
      }
  
      const res = await axios.get(`${SOCKET_SERVER_URL}/api/messages/history`, {
        params,
      });
  
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };
  
    fetchMessages();

    // 2️⃣ Connect to socket
    socket = io(SOCKET_SERVER_URL, {
      query: { receiverId: doctor._id, senderId: user._id },
    });

    // Join room
    socket.emit("joinRoom", { receiverId: doctor._id, senderId: user._id });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [doctor, user]);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        senderId: user._id,
        receiverId: doctor._id,
        text: message,
        time: new Date().toLocaleTimeString(),
        senderModel: "Patient",
        receiverModel: "Doctor"
      };

      // Emit real-time
      socket.emit("sendMessage", newMessage);

      // Save to DB
      try {
        console.log(newMessage)
       const res= await axios.post(`${SOCKET_SERVER_URL}/api/messages/register`, newMessage);
       console.log(res.data)
      } catch (err) {
        console.error("Error saving message:", err);
      }

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  if (!doctor || !user) {
    return <div>Missing chat data</div>;
  }

  return (
    <div style={{
      border: "1px solid #ccc",
      width: "400px",
      borderRadius: "10px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      height: "500px"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#1976d2",
        color: "white",
        padding: "10px",
        fontWeight: "bold",
        textAlign: "center"
      }}>
        Chat with Dr. {doctor.fullname}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: "10px",
        overflowY: "auto",
        backgroundColor: "#f5f5f5"
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.senderId === user._id ? "flex-end" : "flex-start",
              marginBottom: "5px"
            }}
          >
            <div style={{
              maxWidth: "70%",
              padding: "8px 12px",
              borderRadius: "15px",
              backgroundColor: msg.senderId === user._id ? "#1976d2" : "#e0e0e0",
              color: msg.senderId === user._id ? "white" : "black",
              wordBreak: "break-word"
            }}>
              {msg.text}
              <div style={{
                fontSize: "0.7rem",
                marginTop: "3px",
                textAlign: "right",
                opacity: 0.7
              }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display: "flex",
        padding: "10px",
        borderTop: "1px solid #ccc",
        backgroundColor: "white"
      }}>
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
            outline: "none"
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
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
