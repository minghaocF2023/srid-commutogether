'use client';

import { useState } from 'react';
import Link from 'next/link';

const Social = ({ onSelectFriend }) => {
  const friendStatuses = [
    { name: 'Brian', status: "I love Caltrain", image: "/Brian.webp" },
    { name: 'Alice', status: "Boring", image: "/Alice.webp" },
  ];

  return (
    <div className="flex flex-col h-full p-4">
      <h3 className="text-lg font-semibold mb-3">Friend Status</h3>
      <div className="flex gap-4 overflow-x-auto mb-6">
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
        <div
          className="flex items-center gap-3 p-3 border-b border-gray-200 cursor-pointer"
          onClick={() => onSelectFriend(friendStatuses[0])}
        >
          <img className="w-10 h-10 bg-gray-300 rounded-full bg-white" src="/Brian.webp" alt="Brian" />
          <div>
            <strong className="block">Brian</strong>
            <p className="text-sm text-gray-600">Hey Tommy! When will u go MTV station?</p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Nearby Users</h3>
        <div className="flex items-center gap-3 p-3 border-b border-gray-200">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <span className="text-base font-medium">More nearby users &gt;</span>
        </div>
      </section>
    </div>
  );
};

const ChatRoom = ({ friend, onBack }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <button className="text-sm absolute left-4" onClick={onBack}>&lt;</button>
        <h2 className="text-lg font-bold mx-auto">{friend.name}</h2>
        <span className="text-xs text-gray-500 mx-auto mt-1">You have the same schedule with {friend.name}!</span>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        <p className="text-center text-sm text-gray-500 mb-4">Today</p>
        <div className="flex items-start gap-3 mb-4">
          <img className="w-10 h-10 rounded-full" src={friend.image} alt={friend.name} />
          <div className="bg-gray-200 p-3 rounded-lg text-sm text-gray-800">Hey Tommy! When will you go to MTV station?</div>
        </div>
        <div className="flex items-start gap-3 mb-4">
          <img className="w-10 h-10 rounded-full" src={friend.image} alt={friend.name} />
          <div className="bg-gray-200 p-3 rounded-lg text-sm text-gray-800">I'm planning to leave around 5 PM. What about you?</div>
        </div>
        <div className="flex items-end justify-end gap-3 mb-4">
          <div className="bg-blue-500 text-white p-3 rounded-lg text-sm">I might join you. Let me know when you are about to leave!</div>
          <img className="w-10 h-10 rounded-full" alt="Tommy" src="Tommy_Flanagan.webp" />
        </div>
      </main>
      <footer className="p-4 bg-white border-t flex items-center gap-2">
        <input type="text" className="flex-1 p-3 border border-gray-300 rounded-full text-sm" placeholder="Write something here..." />
        <button className="p-3 bg-yellow-500 text-white rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </footer>
    </div>
  );
};

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('social');
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleSelectFriend = (friend) => {
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
            <button className="text-sm absolute left-4">&lt; Back</button>
            <h2 className="text-lg font-bold mx-auto">Friend</h2>
          </header>

          <main className="flex-1 overflow-auto">
            {activeTab === 'social' ? (
              <Social onSelectFriend={handleSelectFriend} />
            ) : (
              <></>
            )}
          </main>
        </>
      )}
    </div>
  );
}

export { Social };
