import React, { useState, useEffect } from 'react';
import { UserProfile, Booking, Message } from '../types';
import { MessageSquare, Search, Send, MoreVertical, Phone } from 'lucide-react';
import { db } from '../services/db';

interface MessagesProps {
  user: UserProfile;
  bookings: Booking[];
}

const Messages: React.FC<MessagesProps> = ({ user, bookings }) => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  
  // Filter bookings to finding chat-able contacts
  // A chat exists for every booking
  const myChats = bookings.filter(b => 
    b.customerId === user.id || b.providerId === user.id
  ).map(b => {
    const isImCustomer = b.customerId === user.id;
    const partnerName = isImCustomer ? b.providerName : (b.customerName || `Customer #${b.customerId.slice(0,5)}`);
    const partnerId = isImCustomer ? b.providerId : b.customerId;
    const partnerAvatar = `https://ui-avatars.com/api/?name=${partnerName}&background=random`;
    
    // Get last message for this booking
    const msgs = db.getMessages(b.id);
    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

    return {
      bookingId: b.id,
      partnerName,
      partnerId,
      partnerAvatar,
      service: b.serviceCategory,
      lastMessage: lastMsg ? lastMsg.content : 'Chat started',
      time: lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date(b.scheduledAt).toLocaleDateString(),
      unread: 0 // Todo: implement unread logic
    };
  });

  // Load active messages when chat selected
  useEffect(() => {
    if (selectedBookingId) {
      // Poll or reload messages
      const load = () => {
        const msgs = db.getMessages(selectedBookingId);
        setActiveMessages(msgs);
      };
      load();
      // Simple polling for "realtime" feel
      const interval = setInterval(load, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedBookingId]);

  // Handle URL param selection if needed (not implemented in this simplified view, relies on state)

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!messageInput.trim() || !selectedBookingId) return;
      
      const newMessage: Message = {
          id: `msg_${Date.now()}`,
          bookingId: selectedBookingId,
          senderId: user.id,
          content: messageInput,
          timestamp: new Date().toISOString(),
          isRead: false
      };
      
      db.sendMessage(newMessage);
      setActiveMessages([...activeMessages, newMessage]);
      setMessageInput('');
  };

  const selectedChatInfo = myChats.find(c => c.bookingId === selectedBookingId);

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] flex flex-col md:flex-row bg-white border-x border-slate-200 shadow-sm mt-0 md:mt-4 overflow-hidden rounded-lg">
       {/* Sidebar List */}
       <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${selectedBookingId !== null ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-200 bg-slate-50">
             <h2 className="text-xl font-bold text-slate-900 mb-4">Messages</h2>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search chats..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
             </div>
          </div>
          <div className="flex-grow overflow-y-auto">
             {myChats.length > 0 ? myChats.map((chat) => (
               <div 
                 key={chat.bookingId} 
                 onClick={() => setSelectedBookingId(chat.bookingId)}
                 className={`flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition-colors ${selectedBookingId === chat.bookingId ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
               >
                  <img src={chat.partnerAvatar} alt={chat.partnerName} className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                     <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-semibold text-slate-900 truncate">{chat.partnerName}</h4>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{chat.time}</span>
                     </div>
                     <p className="text-xs text-blue-600 mb-1 font-medium">{chat.service}</p>
                     <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
                  </div>
               </div>
             )) : (
                 <div className="p-8 text-center text-slate-500">
                     No active bookings found. Book a service to start chatting.
                 </div>
             )}
          </div>
       </div>

       {/* Chat Area */}
       <div className={`flex-grow flex flex-col bg-white ${selectedBookingId === null ? 'hidden md:flex' : 'flex'}`}>
           {selectedBookingId && selectedChatInfo ? (
               <>
                 {/* Chat Header */}
                 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedBookingId(null)} className="md:hidden text-slate-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden">
                            <img src={selectedChatInfo.partnerAvatar} alt="Avatar" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{selectedChatInfo.partnerName}</h3>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                {selectedChatInfo.service} • Booking ID #{selectedBookingId.slice(-4)}
                            </span>
                        </div>
                    </div>
                 </div>

                 {/* Messages List */}
                 <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {activeMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                                msg.senderId === user.id 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : (msg.senderId === 'system' ? 'bg-slate-200 text-slate-600 text-center w-full rounded-full text-xs py-1' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none')
                            }`}>
                                <p className="text-sm">{msg.content}</p>
                                <span className={`text-[10px] block text-right mt-1 ${msg.senderId === user.id ? 'text-blue-200' : 'text-slate-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    ))}
                 </div>

                 {/* Input Area */}
                 <div className="p-4 bg-white border-t border-slate-200">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-grow bg-slate-50 border border-slate-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={!messageInput.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-3 rounded-full transition-colors flex items-center justify-center shadow-md"
                        >
                            <Send size={20} className={messageInput.trim() ? 'ml-1' : ''} />
                        </button>
                    </form>
                 </div>
               </>
           ) : (
               <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-slate-50">
                   <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                      <MessageSquare className="h-12 w-12 text-slate-300" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Your Messages</h3>
                   <p className="text-slate-500 max-w-xs">
                     Select a conversation from the left to chat with your service partners.
                   </p>
               </div>
           )}
       </div>
    </div>
  );
};

export default Messages;