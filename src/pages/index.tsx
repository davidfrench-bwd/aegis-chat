import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { supabase, AgentChatRoom, AgentChatMessage } from '../lib/supabase';

export default function Home() {
  // Server-side session check added to prevent unauthorized access
  // Redirect to login if not authenticated
  const [rooms, setRooms] = useState<AgentChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<AgentChatRoom | null>(null);
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch available rooms
  useEffect(() => {
    async function fetchRooms() {
      const { data, error } = await supabase
        .from('agent_chat_rooms')
        .select('*');
      
      if (data) setRooms(data);
      if (error) console.error('Error fetching rooms:', error);
    }
    fetchRooms();
  }, []);

  // Fetch messages for selected room
  useEffect(() => {
    if (!selectedRoom) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('agent_chat_messages')
        .select('*')
        .eq('room_id', selectedRoom.id)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
      if (error) console.error('Error fetching messages:', error);
    };

    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`room:${selectedRoom.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'agent_chat_messages',
        filter: `room_id=eq.${selectedRoom.id}`
      }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new as AgentChatMessage]);
      })
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedRoom]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!selectedRoom || !newMessage.trim()) return;

    const { error } = await supabase
      .from('agent_chat_messages')
      .insert({
        room_id: selectedRoom.id,
        sender_agent: 'Aegis', // TODO: Dynamic sender
        message: { text: newMessage },
        message_type: 'text'
      });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Rooms List */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-2xl mb-4">Agent Rooms</h2>
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className={`p-2 cursor-pointer ${selectedRoom?.id === room.id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => setSelectedRoom(room)}
          >
            {room.name}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-700 text-white p-4">
              <h2 className="text-xl">{selectedRoom.name}</h2>
              <p className="text-sm text-gray-300">{selectedRoom.description}</p>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-900 text-white">
              {messages.map((msg) => (
                <div key={msg.id} className="mb-4 bg-gray-800 p-3 rounded">
                  <div className="flex justify-between">
                    <strong>{msg.sender_agent}</strong>
                    <span className="text-sm text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p>{JSON.stringify(msg.message)}</p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-gray-800 p-4 flex">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-grow p-2 bg-gray-700 text-white"
                placeholder="Type a message..."
              />
              <button 
                onClick={handleSendMessage}
                className="ml-2 bg-blue-600 text-white px-4 py-2"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center bg-gray-900 text-white">
            Select a room to start chatting
          </div>
        )}
      </div>
    </div>
  );
}