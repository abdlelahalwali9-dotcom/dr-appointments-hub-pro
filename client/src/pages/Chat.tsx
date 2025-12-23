import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Plus, Search } from "lucide-react";

interface ChatMessage {
  id: number;
  sender: string;
  senderId: number;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Conversation {
  id: number;
  name: string;
  type: "direct" | "group";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  participants: string[];
  messages: ChatMessage[];
}

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: "فاطمة الاستقبال",
    type: "direct",
    lastMessage: "تم تحديث جدول المواعيد",
    lastMessageTime: new Date(Date.now() - 300000),
    unreadCount: 2,
    participants: ["فاطمة الاستقبال"],
    messages: [
      {
        id: 1,
        sender: "أنت",
        senderId: 1,
        content: "السلام عليكم",
        timestamp: new Date(Date.now() - 600000),
        isOwn: true,
      },
      {
        id: 2,
        sender: "فاطمة الاستقبال",
        senderId: 2,
        content: "وعليكم السلام",
        timestamp: new Date(Date.now() - 500000),
        isOwn: false,
      },
      {
        id: 3,
        sender: "فاطمة الاستقبال",
        senderId: 2,
        content: "تم تحديث جدول المواعيد",
        timestamp: new Date(Date.now() - 300000),
        isOwn: false,
      },
    ],
  },
  {
    id: 2,
    name: "فريق الاستقبال",
    type: "group",
    lastMessage: "الموعد التالي في الساعة 3 عصراً",
    lastMessageTime: new Date(Date.now() - 900000),
    unreadCount: 0,
    participants: ["فاطمة", "محمد", "سارة"],
    messages: [
      {
        id: 1,
        sender: "محمد",
        senderId: 3,
        content: "السلام عليكم جميعاً",
        timestamp: new Date(Date.now() - 1200000),
        isOwn: false,
      },
      {
        id: 2,
        sender: "أنت",
        senderId: 1,
        content: "وعليكم السلام",
        timestamp: new Date(Date.now() - 1100000),
        isOwn: true,
      },
      {
        id: 3,
        sender: "سارة",
        senderId: 4,
        content: "الموعد التالي في الساعة 3 عصراً",
        timestamp: new Date(Date.now() - 900000),
        isOwn: false,
      },
    ],
  },
];

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>(
    SAMPLE_CONVERSATIONS
  );
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: ChatMessage = {
      id: Math.max(...selectedConversation.messages.map((m) => m.id), 0) + 1,
      sender: "أنت",
      senderId: 1,
      content: messageInput,
      timestamp: new Date(),
      isOwn: true,
    };

    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageInput,
              lastMessageTime: new Date(),
            }
          : conv
      )
    );

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
    });

    setMessageInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                الدردشة الفورية
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                التواصل مع فريق العمل
              </p>
            </div>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              محادثة جديدة
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 container py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">المحادثات</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col gap-3 pb-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ابحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-right p-3 rounded-lg transition ${
                    selectedConversation?.id === conv.id
                      ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-600"
                      : "bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {conv.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge className="bg-red-600 text-white">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {conv.lastMessageTime.toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        {selectedConversation ? (
          <Card className="lg:col-span-2 flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b border-gray-200 dark:border-slate-700 pb-3">
              <div>
                <CardTitle>{selectedConversation.name}</CardTitle>
                <CardDescription>
                  {selectedConversation.type === "group"
                    ? `${selectedConversation.participants.length} أعضاء`
                    : "محادثة مباشرة"}
                </CardDescription>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? "bg-blue-600 text-white rounded-bl-none"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-br-none"
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {message.sender}
                    </p>
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isOwn
                          ? "text-blue-100"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("ar-SA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-slate-700 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="اكتب رسالة..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                  إرسال
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="lg:col-span-2 flex items-center justify-center">
            <CardContent className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                اختر محادثة لبدء الدردشة
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
