'use client';

import { useState, useEffect } from 'react';

interface SocialProps {
  onSelectFriend: (friend: { name: string; status: string; image: string }) => void;
}

const Social = ({ onSelectFriend }: SocialProps) => {
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  useEffect(() => {
    // Load user status from localStorage if available
    const storedStatus = localStorage.getItem('userStatus');
    if (storedStatus) {
      setSavedStatus(storedStatus);
    }
  }, []);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserStatus(event.target.value);
  };

  const saveStatus = () => {
    // Save user status to localStorage and update savedStatus
    if (userStatus) {
      localStorage.setItem('userStatus', userStatus);
      setSavedStatus(userStatus);
    }
  };

  const friendStatuses = [
    { name: 'Brian', status: "I love Caltrain", image: "/Brian.webp" },
    { name: 'Alice', status: "Boring", image: "/Alice.webp" },
  ];

  const nearbyUsers = [
    { name: 'Samuel', image: 'Samuel.jpeg' },
    { name: 'Sherry', image: 'Sherry.jpg' },
  ];

  const handleNearbyUserClick = (userName: string) => {
    console.log(`Nearby user clicked: ${userName}`);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h3 className="text-lg font-semibold mb-3">Your Status</h3>
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={userStatus ?? ''}
          onChange={handleStatusChange}
          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
          placeholder="What's on your mind?"
        />
        <button onClick={saveStatus} className="p-2 bg-blue-500 text-white rounded-lg">
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
            <img className="w-10 h-10 bg-gray-300 rounded-full bg-white" src={friend.image} alt={friend.name} />
            <div>
              <strong className="block">{friend.name}</strong>
              <p className="text-sm text-gray-600">{getLastMessage(friend.name)}</p>
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
            onClick={() => handleNearbyUserClick(user.name)}
          >
            <img className="w-10 h-10 bg-gray rounded-full" src={user.image} alt={user.name} />
            <span className="text-base font-medium">{user.name}</span>
          </div>
        ))}
      </section>
    </div>
  );
};

const getLastMessage = (friendName: string) => {
  const storedMessages = localStorage.getItem(`chatMessages_${friendName}`);
  if (storedMessages) {
    const messages = JSON.parse(storedMessages);
    return messages[messages.length - 1].text;
  } else {
    // Default last message if no messages in localStorage
    const initialMessages = {
      Brian: 'I might join you. Let me know when you are about to leave!',
      Alice: 'I was thinking of checking out the new art gallery.',
    };
    return initialMessages[friendName];
  }
};

interface Friend {
  name: string;
  status: string;
  image: string;
}

const ChatRoom = ({ friend, onBack }: { friend: Friend; onBack: () => void }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem(`chatMessages_${friend.name}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      const initialMessages = {
        Brian: [
          { sender: 'friend', text: 'Hey Tommy! When will you go to MTV station?' },
          { sender: 'friend', text: "I'm planning to leave around 5 PM. What about you?" },
          { sender: 'me', text: 'I might join you. Let me know when you are about to leave!' },
        ],
        Alice: [
          { sender: 'friend', text: 'Hi Tommy, are you free this weekend?' },
          { sender: 'me', text: 'Hey Alice, I might be free on Sunday. What do you have in mind?' },
          { sender: 'friend', text: 'I was thinking of checking out the new art gallery.' },
        ],
      };
      setMessages(initialMessages[friend.name] || []);
    }
  }, [friend]);

  // Update localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chatMessages_${friend.name}`, JSON.stringify(messages));
    }
  }, [messages, friend]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const updatedMessages = [...messages, { sender: 'me', text: newMessage }];
      setMessages(updatedMessages);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <button className="text-sm absolute left-4" onClick={onBack}>&lt;</button>
        <h2 className="text-lg font-bold mx-auto">{friend.name}</h2>
        <span className="text-xs text-gray-500 mx-auto mt-1">You have the same schedule with {friend.name}!</span>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        <p className="text-center text-sm text-gray-500 mb-4">Today</p>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'me' ? 'justify-end' : ''} items-start gap-3 mb-4`}>
            {message.sender !== 'me' && (
              <img className="w-10 h-10 rounded-full" src={friend.image} alt={friend.name} />
            )}
            <div
              className={`p-3 rounded-lg text-sm ${message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
            >
              {message.text}
            </div>
            {message.sender === 'me' && (
              <img className="w-10 h-10 rounded-full" alt="Tommy" src="Tommy_Flanagan.webp" />
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
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="p-3 bg-yellow-500 text-white rounded-full" onClick={handleSendMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </footer>
    </div>
  );
};

export default function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const handleBack = () => {
    setSelectedFriend(null);
  };

  return (
    <div className="flex flex-col h-full">
      {selectedFriend ? (
        // Full-screen chat room without footer navigation
        <ChatRoom friend={selectedFriend} onBack={handleBack} />
      ) : (
        <>
          <header className="flex justify-between items-center p-4 bg-white border-b">
            <h2 className="text-lg font-bold mx-auto">Friend</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <Social onSelectFriend={handleSelectFriend} />
          </main>
        </>
      )}
    </div>
  );
}

export { Social };
