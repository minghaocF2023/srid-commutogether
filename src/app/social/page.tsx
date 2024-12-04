"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter to navigate to other pages

interface SocialProps {
  onSelectFriend: (friend: {
    name: string;
    status: string;
    image: string;
  }) => void;
}

const Social = ({ onSelectFriend }: SocialProps) => {
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [friendStatuses, setFriendStatuses] = useState<
    { name: string; status: string; image: string }[]
  >([
    { name: "Brian", status: "I love Caltrain", image: "/Brian.webp" },
    { name: "Alice", status: "Boring", image: "/Alice.webp" },
  ]);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // Load user status from localStorage if available
    if (typeof window !== "undefined") {
      const storedStatus = localStorage.getItem("userStatus");
      if (storedStatus) {
        setSavedStatus(storedStatus);
      }

      // Load friend acceptance status from localStorage
      const isAccepted = localStorage.getItem(`friendRequestAccepted_Samuel`);

      if (isAccepted && JSON.parse(isAccepted)) {
        setFriendStatuses((prevStatuses) => {
          // Check if Samuel already exists in friendStatuses
          if (!prevStatuses.some((friend) => friend.name === "Samuel")) {
            return [
              ...prevStatuses,
              {
                name: "Samuel",
                status: "Hi I am Samuel!",
                image: "/Samuel.jpeg",
              },
            ];
          }
          return prevStatuses;
        });
      }
    }
  }, []);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserStatus(event.target.value);
  };

  const saveStatus = () => {
    // Save user status to localStorage and update savedStatus
    if (userStatus) {
      if (typeof window !== "undefined") {
        localStorage.setItem("userStatus", userStatus);
      }
      setSavedStatus(userStatus);
    }
  };

  const nearbyUsers = [
    {
      name: "Sherry",
      image: "Sherry.jpg",
      link: "/profile?user=2",
    },
  ];

  const handleNearbyUserClick = (link: string) => {
    router.push(link); // Navigate to the user's profile page
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h3 className="text-lg font-semibold mb-3">Your Status</h3>
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={userStatus ?? ""}
          onChange={handleStatusChange}
          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
          placeholder="What's on your mind?"
        />
        <button
          onClick={saveStatus}
          className="p-2 bg-blue-500 text-white rounded-lg"
        >
          Save
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-3">Friend Status</h3>
      <div className="flex gap-4 overflow-x-auto mb-6">
        {/* Display user status first */}
        <div className="flex-shrink-0 flex flex-col items-center w-20">
          <div className="relative">
            <img
              className="w-16 h-16 rounded-full border-2 border-gray-300"
              src="Tommy_Flanagan.webp" // Replace with user's profile image
              alt="Tommy"
            />
            {savedStatus && (
              <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded-full text-center">
                {savedStatus}
              </div>
            )}
          </div>
          <span className="text-sm mt-3 text-center">You</span>
        </div>

        {/* Display friends' statuses */}
        {friendStatuses.map((friend, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col items-center w-20 cursor-pointer"
            onClick={() => onSelectFriend(friend)}
          >
            <div className="relative">
              <img
                className="w-16 h-16 rounded-full border-2 border-gray-300"
                src={friend.image}
                alt={friend.name}
              />
              <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded-full text-center">
                {friend.status}
              </div>
            </div>
            <span className="text-sm mt-3 text-center">{friend.name}</span>
          </div>
        ))}
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Chats</h3>
        {friendStatuses.map((friend, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 border-b border-gray-200 cursor-pointer"
            onClick={() => onSelectFriend(friend)}
          >
            <img
              className="w-10 h-10 bg-gray-300 rounded-full bg-white"
              src={friend.image}
              alt={friend.name}
            />
            <div>
              <strong className="block">{friend.name}</strong>
              <p className="text-sm text-gray-600">
                {getLastMessage(friend.name)}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Nearby Users</h3>
        {nearbyUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 border-b border-gray-200 cursor-pointer"
            onClick={() => handleNearbyUserClick(user.link)}
          >
            <img
              className="w-10 h-10 bg-gray rounded-full"
              src={user.image}
              alt={user.name}
            />
            <span className="text-base font-medium">{user.name}</span>
          </div>
        ))}
      </section>
    </div>
  );
};

const getLastMessage = (friendName: string) => {
  if (typeof window !== "undefined") {
    const storedMessages = localStorage.getItem(`chatMessages_${friendName}`);
    if (storedMessages) {
      const messages = JSON.parse(storedMessages);
      return messages[messages.length - 1].text;
    } else {
      // Default last message if no messages in localStorage
      const initialMessages = {
        Brian: "I might join you. Let me know when you are about to leave!",
        Alice: "I was thinking of checking out the new art gallery.",
      };
      // @ts-ignore
      return initialMessages[friendName];
    }
  }
};

interface Friend {
  name: string;
  status: string;
  image: string;
}

const FriendRequestList = ({ onBack }: { onBack: () => void }) => {
  const router = useRouter(); // Initialize the router

  const [friendRequests, setFriendRequests] = useState<
    { name: string; image: string; accepted: boolean; link: string }[]
  >([
    {
      name: "Samuel",
      image: "/Samuel.jpeg",
      accepted: false,
      link: "/profile?user=1",
    },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load friend request status from localStorage for Samuel
      const isAccepted = localStorage.getItem(`friendRequestAccepted_Samuel`);
      const isDeclined = localStorage.getItem(`friendRequestDeclined_Samuel`);

      if (isAccepted && JSON.parse(isAccepted)) {
        setFriendRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.name === "Samuel" ? { ...request, accepted: true } : request
          )
        );
      }

      // Filter out Samuel's request if it was declined
      if (isDeclined && JSON.parse(isDeclined)) {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request.name !== "Samuel")
        );
      }
    }
  }, []);

  const handleAccept = (index: number) => {
    // Set the request as accepted by updating its "accepted" property and save it to localStorage
    setFriendRequests((prevRequests) =>
      prevRequests.map((request, i) =>
        i === index ? { ...request, accepted: true } : request
      )
    );
    if (friendRequests[index].name === "Samuel") {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `friendRequestAccepted_Samuel`,
          JSON.stringify(true)
        );
      }
    }
  };

  const handleDecline = (index: number) => {
    // Remove the declined request from the list
    const declinedFriend = friendRequests[index];
    const updatedRequests = friendRequests.filter((_, i) => i !== index);
    setFriendRequests(updatedRequests);

    // Persist the declined state in localStorage
    if (typeof window !== "undefined") {
      if (declinedFriend.name === "Samuel") {
        localStorage.setItem(
          `friendRequestDeclined_Samuel`,
          JSON.stringify(true)
        );
        localStorage.setItem(
          `friendRequestAccepted_Samuel`,
          JSON.stringify(false)
        );
      }
    }
  };

  const handleProfileClick = (link: string) => {
    router.push(link); // Navigate to the user's profile page
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <button className="text-sm absolute left-4" onClick={onBack}>
          &lt; Back
        </button>
        <h2 className="text-lg font-bold mx-auto">Friend Requests</h2>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        {friendRequests.map((friend, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 border-b border-gray-200"
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleProfileClick(friend.link)}
            >
              <img
                className="w-10 h-10 rounded-full"
                src={friend.image}
                alt={friend.name}
              />
              <span className="text-base font-medium">{friend.name}</span>
            </div>
            <div className="ml-auto flex gap-2">
              {friend.accepted ? (
                <button
                  className="p-2 bg-gray-500 text-white rounded-lg cursor-default"
                  disabled
                >
                  Friend
                </button>
              ) : (
                <>
                  <button
                    className="p-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => handleAccept(index)}
                  >
                    Accept
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded-lg"
                    onClick={() => handleDecline(index)}
                  >
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {friendRequests.length === 0 && (
          <p className="text-center text-gray-500">
            No friend requests at the moment.
          </p>
        )}
      </main>
    </div>
  );
};

const ChatRoom = ({
  friend,
  onBack,
}: {
  friend: Friend;
  onBack: () => void;
}) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [newMessage, setNewMessage] = useState("");

  // Load messages from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMessages = localStorage.getItem(
        `chatMessages_${friend.name}`
      );
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        const initialMessages = {
          Brian: [
            {
              sender: "friend",
              text: "Hey Tommy! When will you go to MTV station?",
            },
            {
              sender: "friend",
              text: "I'm planning to leave around 5 PM. What about you?",
            },
            {
              sender: "me",
              text: "I might join you. Let me know when you are about to leave!",
            },
          ],
          Alice: [
            { sender: "friend", text: "Hi Tommy, are you free this weekend?" },
            {
              sender: "me",
              text: "Hey Alice, I might be free on Sunday. What do you have in mind?",
            },
            {
              sender: "friend",
              text: "I was thinking of checking out the new art gallery.",
            },
          ],
        };
        // @ts-ignore
        setMessages(initialMessages[friend.name] || []);
      }
    }
  }, [friend]);

  // Update localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `chatMessages_${friend.name}`,
          JSON.stringify(messages)
        );
      }
    }
  }, [messages, friend]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const updatedMessages = [...messages, { sender: "me", text: newMessage }];
      setMessages(updatedMessages);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <button className="text-sm absolute left-4" onClick={onBack}>
          <h2 className="text-lg font-bold mx-auto">&lt; {friend.name}</h2>
        </button>
        {friend.name === "Brian" && (
          <span className="text-xs text-gray-500 mx-auto mt-1">
            You have the same schedule with {friend.name}!
          </span>
        )}
      </header>
      <main className="flex-1 p-4 overflow-auto">
        <p className="text-center text-sm text-gray-500 mb-4">Today</p>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "me" ? "justify-end" : ""
            } items-start gap-3 mb-4`}
          >
            {message.sender !== "me" && (
              <img
                className="w-10 h-10 rounded-full"
                src={friend.image}
                alt={friend.name}
              />
            )}
            <div
              className={`p-3 rounded-lg text-sm ${
                message.sender === "me"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.text}
            </div>
            {message.sender === "me" && (
              <img
                className="w-10 h-10 rounded-full"
                alt="Tommy"
                src="Tommy_Flanagan.webp"
              />
            )}
          </div>
        ))}
      </main>
      <footer className="p-4 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-full text-sm"
          placeholder="Write something here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="p-3 bg-yellow-500 text-white rounded-full"
          onClick={handleSendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </footer>
    </div>
  );
};

export default function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [viewingFriendRequests, setViewingFriendRequests] = useState(false);

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const handleBack = () => {
    setSelectedFriend(null);
  };

  const handleFriendRequestsClick = () => {
    setViewingFriendRequests(true);
  };

  const handleFriendRequestsBack = () => {
    setViewingFriendRequests(false);
  };

  return (
    <div className="flex flex-col h-full">
      {selectedFriend ? (
        // Full-screen chat room without footer navigation
        <ChatRoom friend={selectedFriend} onBack={handleBack} />
      ) : viewingFriendRequests ? (
        // Friend request list view
        <FriendRequestList onBack={handleFriendRequestsBack} />
      ) : (
        <>
          <header className="flex justify-between items-center p-4 bg-white border-b">
            <h2 className="text-lg font-bold mx-auto">Friend</h2>
            <button
              className="absolute right-4 p-2"
              onClick={handleFriendRequestsClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a7 7 0 00-14 0v2h5m0 0v-2a3 3 0 016 0v2m-6-2a3 3 0 00-6 0v2h6zm8-10a4 4 0 01-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
          </header>

          <main className="flex-1 overflow-auto">
            <Social onSelectFriend={handleSelectFriend} />
          </main>
        </>
      )}
    </div>
  );
}
