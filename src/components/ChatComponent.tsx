import React, { useState, useEffect, useRef } from 'react';
import { useApp } from './AppContext';
import { Message } from '../types';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Smile, 
  AlertTriangle, 
  CheckCheck, 
  Loader2, 
  ShieldAlert, 
  File, 
  Image,
  Sparkles,
  Volume2
} from 'lucide-react';

export default function ChatComponent({ taskId }: { taskId: string }) {
  const { currentUser } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  
  // Scams alerts
  const [scamAlert, setScamAlert] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  // Real-time messages listener
  useEffect(() => {
    if (!taskId) return;
    const q = query(collection(db, 'tasks', taskId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          taskId: data.taskId,
          senderId: data.senderId,
          senderName: data.senderName,
          senderPhotoURL: data.senderPhotoURL,
          text: data.text,
          isRead: data.isRead,
          isScam: data.isScam,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          isVoice: data.isVoice,
          fileURL: data.fileURL,
          fileName: data.fileName,
          fileType: data.fileType,
          scamAlertReason: data.scamAlertReason,
        } as Message;
      });
      setMessages(loadedMessages);
    }, (err) => {
      console.warn("Firestore messages snapshot failed:", err);
    });

    return () => unsubscribe();
  }, [taskId]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, scamAlert]);

  // Handle send message with scam scanning
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessageText = inputText;
    setInputText('');
    setSending(true);
    setScamAlert(null);

    let isScam = false;
    let scamReason = undefined;

    try {
      // Call Gemini Server Endpoint for Fraud/Bypass Scanning
      const response = await fetch('/api/gemini/scam-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentMessage: userMessageText })
      });
      const data = await response.json();
      
      if (data.isScam) {
        isScam = true;
        scamReason = data.scamAlertReason;
        setScamAlert(scamReason);
      }
    } catch (err) {
      console.error("Chat scan error:", err);
    }

    try {
      if (!isScam) {
        setTyping(true);
        setTimeout(() => setTyping(false), 1500); // UI feedback
      }
      
      await addDoc(collection(db, 'tasks', taskId, 'messages'), {
        taskId,
        senderId: currentUser.uid,
        senderName: currentUser.name,
        senderPhotoURL: currentUser.photoURL,
        text: userMessageText,
        isRead: false,
        isScam,
        scamAlertReason: scamReason,
        createdAt: serverTimestamp()
      });

    } catch (err) {
      console.error("Chat send error:", err);
    } finally {
      setSending(false);
    }
  };

  // Simulated Voice Note Attachment
  const handleVoiceNoteSimulate = () => {
    setRecording(true);
    setTimeout(async () => {
      setRecording(false);
      try {
        await addDoc(collection(db, 'tasks', taskId, 'messages'), {
          taskId,
          senderId: currentUser.uid,
          senderName: currentUser.name,
          senderPhotoURL: currentUser.photoURL,
          text: '🎤 Voice Note (0:12s)',
          isVoice: true,
          isRead: false,
          isScam: false,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Voice note send error:", err);
      }
    }, 2000);
  };

  // Simulated File Attachment
  const handleAttachmentSimulate = async (type: 'pdf' | 'img') => {
    try {
      await addDoc(collection(db, 'tasks', taskId, 'messages'), {
        taskId,
        senderId: currentUser.uid,
        senderName: currentUser.name,
        senderPhotoURL: currentUser.photoURL,
        text: type === 'pdf' ? '📄 Lecture_Slides_Printed_Receipt.pdf' : '🖼️ Delivery_Proof_Hostel_MainDoor.png',
        fileURL: '#',
        fileName: type === 'pdf' ? 'Lecture_Slides_Printed_Receipt.pdf' : 'Delivery_Proof_Hostel_MainDoor.png',
        fileType: type,
        isRead: false,
        isScam: false,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("File attachment send error:", err);
    }
  };

  return (
    <div className="flex flex-col h-96 bg-black rounded-md border border-zinc-800 overflow-hidden">
      
      {/* Top chat status bar */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-white">Direct Chat</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-zinc-700 text-[9px] font-medium">
          <Sparkles className="h-2.5 w-2.5" />
          <span>AI Guard Live</span>
        </div>
      </div>

      {/* Message Thread list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map(msg => {
          const isMe = msg.senderId === currentUser.uid;
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <img 
                  src={msg.senderPhotoURL} 
                  alt={msg.senderName} 
                  className="w-7 h-7 rounded-lg object-cover border border-gray-850 shrink-0 self-end"
                />
              )}
              
              <div className="max-w-[75%] space-y-1">
                <div className={`p-3 rounded-md text-xs leading-relaxed ${
                  msg.isScam 
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
                    : isMe 
                      ? 'bg-white text-black' 
                      : 'bg-zinc-900 text-white'
                }`}>
                  
                  {/* Scam header if flagged */}
                  {msg.isScam && (
                    <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-rose-400 border-b border-rose-500/20 pb-1.5">
                      <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 animate-bounce" />
                      <span>SECURE SCAN TRIGGERED</span>
                    </div>
                  )}

                  {/* Render content */}
                  {msg.isVoice ? (
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <Volume2 className="h-4 w-4 shrink-0" />
                      <span>{msg.text}</span>
                      <div className="h-3 w-12 bg-black/10 rounded relative overflow-hidden shrink-0">
                        <div className="absolute inset-y-0 left-0 bg-black/30 w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ) : msg.fileURL ? (
                    <div className="flex items-center gap-2">
                      {msg.fileType === 'pdf' ? <File className="h-4 w-4" /> : <Image className="h-4 w-4" />}
                      <span className="font-medium underline cursor-pointer">{msg.fileName}</span>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}

                  {/* Scam warning detail */}
                  {msg.isScam && msg.scamAlertReason && (
                    <p className="mt-1.5 text-[9px] text-rose-500 italic font-mono bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                      Reason: {msg.scamAlertReason}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-center px-1 text-[8px] text-zinc-500 font-mono">
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && <CheckCheck className="h-3.5 w-3.5 text-zinc-400 inline ml-1" />}
                </div>
              </div>

              {isMe && (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-lg object-cover border border-gray-850 shrink-0 self-end"
                />
              )}
            </div>
          );
        })}

        {/* Typing and scams warnings */}
        {typing && (
          <div className="flex gap-2.5 items-center">
            <div className="h-6 w-12 bg-zinc-900 rounded-md flex items-center justify-center gap-1">
              <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {scamAlert && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-500 text-[10px] flex gap-2 items-start shadow-sm animate-pulse">
            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">SECURE WALLET SAFEGUARD TRIGGERED</span>
              <p className="text-zinc-400 mt-0.5 leading-relaxed">
                TaskLink blocks external sharing or offline payments to prevent student fraud. Please complete transactions inside the built-in Escrow Wallet to protect your money.
              </p>
            </div>
          </div>
        )}

        <div ref={threadEndRef} />
      </div>

      {/* Input panel bar */}
      <form onSubmit={handleSend} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2 items-center">
        
        {/* Attachment menu */}
        <div className="flex gap-1.5">
          <button 
            type="button" 
            onClick={() => handleAttachmentSimulate('pdf')}
            className="p-1.5 rounded-md bg-black hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
            title="Attach PDF"
          >
            <Paperclip className="h-3.5 w-3.5" />
          </button>
          
          <button 
            type="button" 
            onClick={() => handleAttachmentSimulate('img')}
            className="p-1.5 rounded-md bg-black hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
            title="Attach Image"
          >
            <Image className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Input box */}
        <input 
          type="text" 
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={recording ? "Recording audio..." : "Type chat (try typing 'Whatsapp me' to test Scam Guard)..."}
          className="flex-1 px-3 py-1.5 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
        />

        {/* Audio Mic Button */}
        <button
          type="button"
          onClick={handleVoiceNoteSimulate}
          className={`p-1.5 rounded-md transition ${recording ? 'bg-rose-600 text-white animate-pulse' : 'bg-black border border-zinc-800 text-zinc-400 hover:text-white'}`}
          title="Voice Note"
        >
          <Mic className="h-3.5 w-3.5" />
        </button>

        {/* Send Button */}
        <button 
          type="submit" 
          className="p-1.5 rounded-md bg-white hover:bg-zinc-200 text-black transition flex items-center justify-center"
        >
          <Send className="h-3.5 w-3.5" />
        </button>

      </form>

    </div>
  );
}
