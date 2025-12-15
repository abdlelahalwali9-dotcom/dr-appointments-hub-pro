import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, TrendingUp, Users, Calendar } from "lucide-react";

// Sample data
const appointmentData = [
  { name: "السبت", completed: 12, cancelled: 2, noShow: 1 },
  { name: "الأحد", completed: 15, cancelled: 1, noShow: 2 },
  { name: "الاثنين", completed: 18, cancelled: 3, noShow: 0 },
  { name: "الثلاثاء", completed: 14, cancelled: 2, noShow: 1 },
  { name: "الأربعاء", completed: 16, cancelled: 1, noShow: 2 },
  { name: "الخميس", completed: 19, cancelled: 2, noShow: 1 },
];

const revenueData = [
  { name: "يناير", revenue: 45000 },
  { name: "فبراير", revenue: 52000 },
  { name: "مارس", revenue: 48000 },
  { name: "أبريل", revenue: 61000 },
  { name: "مايو", revenue: 55000 },
  { name: "يونيو", revenue: 67000 },
];

const doctorPerformance = [
  { name: "د. أحمد", patients: 120, revenue: 45000 },
  { name: "د. فاطمة", patients: 95, revenue: 38000 },
  { name: "د. محمد", patients: 110, revenue: 42000 },
  { name: "د. نور", patients: 85, revenue: 35000 },
];

const patientDistribution = [
  { name: "جديد", value: 35 },
  { name: "منتظم", value: 55 },
  { name: "معاود", value: 10 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export default function Reports() {
  const [dateRange, setDateRange] = useState("month");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                التقارير والإحصائيات
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                تحليل شامل لأداء المركز
              </p>
            </div>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              تحميل التقرير
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Date Range Selector */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={dateRange === "week" ? "default" : "outline"}
                onClick={() => setDateRange("week")}
              >
                أسبوع
              </Button>
              <Button
                variant={dateRange === "month" ? "default" : "outline"}
                onClick={() => setDateRange("month")}
              >
                شهر
              </Button>
              <Button
                variant={dateRange === "quarter" ? "default" : "outline"}
                onClick={() => setDateRange("quarter")}
              >
                ربع سنة
              </Button>
              <Button
                variant={dateRange === "year" ? "default" : "outline"}
                onClick={() => setDateRange("year")}
              >
                سنة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">إجمالي المواعيد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">94</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                +12% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">328,000 ر.س</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                +8% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">عدد المرضى</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">245</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                +5% مرضى جدد
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">نسبة الحضور</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">94.7%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                -2% عن الشهر الماضي
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
            <TabsTrigger value="performance">الأداء</TabsTrigger>
          </TabsList>

          {/* Appointments Chart */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>تحليل المواعيد</CardTitle>
                <CardDescription>
                  توزيع المواعيد حسب الحالة خلال الأسبوع الماضي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10b981" name="مكتملة" />
                    <Bar dataKey="cancelled" fill="#ef4444" name="ملغاة" />
                    <Bar dataKey="noShow" fill="#f59e0b" name="لم تحضر" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Chart */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>تحليل الإيرادات</CardTitle>
                <CardDescription>
                  الإيرادات الشهرية خلال آخر 6 أشهر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      name="الإيرادات"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Chart */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>أداء الأطباء</CardTitle>
                <CardDescription>
                  عدد المرضى والإيرادات لكل طبيب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={doctorPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="patients" fill="#3b82f6" name="عدد المرضى" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="الإيرادات" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع المرضى</CardTitle>
                <CardDescription>
                  تصنيف المرضى حسب النوع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={patientDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {patientDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
