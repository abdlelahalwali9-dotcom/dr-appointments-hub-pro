import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface QueueItem {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentTime: Date;
  waitingTime: number;
  status: "waiting" | "in_progress" | "completed";
  position: number;
}

const SAMPLE_QUEUE: QueueItem[] = [
  {
    id: 1,
    patientName: "علي محمد",
    doctorName: "د. أحمد قايد سالم",
    appointmentTime: new Date(),
    waitingTime: 15,
    status: "in_progress",
    position: 1,
  },
  {
    id: 2,
    patientName: "نور أحمد",
    doctorName: "د. أحمد قايد سالم",
    appointmentTime: new Date(Date.now() + 900000),
    waitingTime: 0,
    status: "waiting",
    position: 2,
  },
  {
    id: 3,
    patientName: "محمد علي",
    doctorName: "د. أحمد قايد سالم",
    appointmentTime: new Date(Date.now() + 1800000),
    waitingTime: 0,
    status: "waiting",
    position: 3,
  },
  {
    id: 4,
    patientName: "سارة خالد",
    doctorName: "د. فاطمة علي",
    appointmentTime: new Date(Date.now() + 600000),
    waitingTime: 5,
    status: "waiting",
    position: 1,
  },
];

export default function WaitingQueue() {
  const [queue, setQueue] = useState<QueueItem[]>(SAMPLE_QUEUE);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "قيد الفحص";
      case "completed":
        return "مكتمل";
      default:
        return "في الانتظار";
    }
  };

  const markAsCompleted = (id: number) => {
    setQueue(
      queue.map((item) =>
        item.id === id ? { ...item, status: "completed" as const } : item
      )
    );
  };

  const startAppointment = (id: number) => {
    setQueue(
      queue.map((item) =>
        item.id === id ? { ...item, status: "in_progress" as const } : item
      )
    );
  };

  // Group by doctor
  const groupedByDoctor = queue.reduce(
    (acc, item) => {
      if (!acc[item.doctorName]) {
        acc[item.doctorName] = [];
      }
      acc[item.doctorName].push(item);
      return acc;
    },
    {} as Record<string, QueueItem[]>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              قائمة الانتظار
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              إدارة المرضى في قائمة الانتظار
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {queue.filter((q) => q.status === "waiting").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">قيد الفحص</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {queue.filter((q) => q.status === "in_progress").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">مكتمل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {queue.filter((q) => q.status === "completed").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                متوسط الانتظار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(
                  queue.reduce((sum, q) => sum + q.waitingTime, 0) /
                    queue.length
                )}{" "}
                دقيقة
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queue by Doctor */}
        {Object.entries(groupedByDoctor).map(([doctorName, items]) => (
          <Card key={doctorName} className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{doctorName}</CardTitle>
              <CardDescription>
                {items.length} مريض في الانتظار
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Position */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold">
                        {item.position}
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {item.patientName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          الموعد:{" "}
                          {item.appointmentTime.toLocaleTimeString("ar-SA")}
                        </p>
                      </div>

                      {/* Waiting Time */}
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          وقت الانتظار
                        </p>
                        <p className="text-lg font-bold text-orange-600">
                          {item.waitingTime} دقيقة
                        </p>
                      </div>

                      {/* Status */}
                      <Badge
                        variant={
                          item.status === "completed" ? "default" : "secondary"
                        }
                        className="flex gap-1"
                      >
                        {getStatusIcon(item.status)}
                        {getStatusLabel(item.status)}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      {item.status === "waiting" && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => startAppointment(item.id)}
                        >
                          بدء الفحص
                        </Button>
                      )}
                      {item.status === "in_progress" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => markAsCompleted(item.id)}
                        >
                          إنهاء الفحص
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
