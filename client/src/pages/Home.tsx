import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Calendar, Users, TrendingUp, AlertCircle } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch statistics
  const { data: dailyStats } = trpc.statistics.getDailyStats.useQuery(
    { date: new Date() },
    { enabled: isAuthenticated }
  );

  const { data: activeUsers } = trpc.statistics.getActiveUsers.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: upcomingAppointments } = trpc.appointment.getUpcoming.useQuery(
    { days: 7 },
    { enabled: isAuthenticated }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              مركز د. أحمد قايد سالم
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              نظام إدارة وحجز المواعيد الطبية
            </p>
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            مرحباً، {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            لوحة التحكم الرئيسية
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Quick Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>البحث السريع</CardTitle>
            <CardDescription>ابحث عن مريض أو موعد بسرعة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="ابحث بالاسم أو رقم الهاتف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Button>بحث</Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Appointments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                المواعيد اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {dailyStats?.totalAppointments || 0}
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {dailyStats?.completedAppointments || 0} مكتملة
              </p>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                الإيرادات اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {(dailyStats?.totalRevenue || 0) / 100} ر.س
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                إجمالي الإيرادات
              </p>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                المستخدمون النشطون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {activeUsers || 0}
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                آخر 24 ساعة
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                المواعيد القادمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {upcomingAppointments?.length || 0}
                </div>
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                خلال 7 أيام
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments List */}
        {upcomingAppointments && upcomingAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>المواعيد القادمة</CardTitle>
              <CardDescription>
                المواعيد المجدولة والقيد الانتظار
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        موعد #{apt.id}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(apt.appointmentDate).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                    <Badge
                      className={
                        apt.status === "scheduled"
                          ? "badge-scheduled"
                          : apt.status === "waiting"
                            ? "badge-waiting"
                            : "badge-completed"
                      }
                    >
                      {apt.status === "scheduled"
                        ? "مجدول"
                        : apt.status === "waiting"
                          ? "في الانتظار"
                          : "مكتمل"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
