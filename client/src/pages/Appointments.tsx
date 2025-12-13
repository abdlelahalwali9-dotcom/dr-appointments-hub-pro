import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, User } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  // Get appointments for selected date
  const { data: appointments } = trpc.appointment.getByDate.useQuery({
    date: selectedDate,
  });

  // Get upcoming appointments
  const { data: upcomingAppointments } = trpc.appointment.getUpcoming.useQuery({
    days: 7,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "badge-scheduled";
      case "waiting":
        return "badge-waiting";
      case "completed":
        return "badge-completed";
      case "cancelled":
        return "badge-cancelled";
      case "follow_up":
        return "badge-follow-up";
      default:
        return "badge-scheduled";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "مجدول";
      case "waiting":
        return "في الانتظار";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      case "follow_up":
        return "عودة";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              إدارة المواعيد
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              جدولة وإدارة مواعيد المرضى
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            موعد جديد
          </Button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar and Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>التاريخ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "day" ? "default" : "outline"}
                    onClick={() => setViewMode("day")}
                    size="sm"
                  >
                    يوم
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    onClick={() => setViewMode("week")}
                    size="sm"
                  >
                    أسبوع
                  </Button>
                  <Button
                    variant={viewMode === "month" ? "default" : "outline"}
                    onClick={() => setViewMode("month")}
                    size="sm"
                  >
                    شهر
                  </Button>
                </div>

                <div>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium mb-2">التاريخ المختار:</p>
                  <p>
                    {selectedDate.toLocaleDateString("ar-SA", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">المواعيد القادمة</CardTitle>
                <CardDescription>
                  {upcomingAppointments?.length || 0} موعد
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {upcomingAppointments?.slice(0, 5).map((apt) => (
                    <div
                      key={apt.id}
                      className="p-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        #{apt.id}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(apt.appointmentDate).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>المواعيد</CardTitle>
                <CardDescription>
                  {appointments?.length || 0} موعد في هذا التاريخ
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments && appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              موعد #{apt.id}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>
                                {apt.startTime} - {apt.endTime}
                              </span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(apt.status)}>
                            {getStatusLabel(apt.status)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              مريض #{apt.patientId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              طبيب #{apt.doctorId}
                            </span>
                          </div>
                        </div>

                        {apt.notes && (
                          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            {apt.notes}
                          </p>
                        )}

                        {apt.fee && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600 flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              الرسم:
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {(apt.fee / 100).toFixed(2)} ر.س
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      لا توجد مواعيد في هذا التاريخ
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
