import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

interface Notification {
  id: number;
  userId: number;
  title: string;
  content: string | null;
  type: "message" | "system" | "follow_up" | "appointment_reminder" | "alert";
  relatedId: number | null;
  isRead: boolean;
  readAt: Date | null;
  sentVia: "email" | "sms" | "whatsapp" | "in_app";
  createdAt: Date;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch unread notifications
  const { data: unreadNotifications } = trpc.notification.getUnread.useQuery();

  useEffect(() => {
    if (unreadNotifications) {
      setNotifications(unreadNotifications);
    }
  }, [unreadNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment_reminder":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "follow_up":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "appointment_reminder":
        return "bg-green-50 dark:bg-green-900/20";
      case "alert":
        return "bg-red-50 dark:bg-red-900/20";
      case "follow_up":
        return "bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Notification Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              الإشعارات
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                مسح الكل
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>لا توجد إشعارات جديدة</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-slate-700 last:border-b-0 ${getBackgroundColor(
                    notification.type
                  )}`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString("ar-SA")}
                      </p>
                    </div>
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <Button
                variant="outline"
                className="w-full text-center"
                onClick={() => setOpen(false)}
              >
                عرض جميع الإشعارات
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
