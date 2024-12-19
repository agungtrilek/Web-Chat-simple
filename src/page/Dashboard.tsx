import React from "react";
import { auth } from "../firebase/firebase";

import useHooks from "../useState/useHooks";
import AvatarChat from "../components/AvatarChat";
import { Button, Label, TextInput } from "flowbite-react";

const Dashboard: React.FC = () => {
  const {
    handleLogout,
    message,
    userAuth,
    messages,
    setMessage,
    handleSend,
    loading,
  } = useHooks();

  return (
    <div className="w-2/4">
      <div>
        <div className="shadow-sm bg-slate-300 flex justify-between">
          <AvatarChat email={auth?.currentUser?.email!} index={5} url="" />
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      {/* chat */}
      <div>
        <div className="bg-white shadow-sm ">
          <div className="chat-box ">
            {messages.map((msg, index) => (
              <div key={index} className={""}>
                <div
                  className={
                    msg.sender === auth?.currentUser?.email! ? `text-end` : ""
                  }
                >
                  <p className="px-3 py-1 ">
                    <span className="px-3">{msg.timestamp}</span>
                    {msg.text}
                  </p>
                  <span>{msg.sender}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex ">
            <TextInput
              type="text"
              className="flex-auto"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message"
            />

            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
