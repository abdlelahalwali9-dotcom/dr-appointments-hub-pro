import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter } from "lucide-react";

interface AuditLogEntry {
  id: number;
  timestamp: Date;
  user: string;
  action: string;
  entity: string;
  entityId: number;
  changes: string;
  ipAddress: string;
  status: "success" | "failed";
}

const SAMPLE_LOGS: AuditLogEntry[] = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 300000),
    user: "محمد الإدارة",
    action: "إضافة",
    entity: "مريض",
    entityId: 1,
    changes: 'اسم: "علي محمد"، هاتف: "0501234567"',
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 600000),
    user: "فاطمة الاستقبال",
    action: "تعديل",
    entity: "موعد",
    entityId: 5,
    changes: 'الحالة: "مجدول" -> "مكتمل"',
    ipAddress: "192.168.1.101",
    status: "success",
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 900000),
    user: "د. أحمد قايد سالم",
    action: "عرض",
    entity: "سجل طبي",
    entityId: 3,
    changes: "تم عرض السجل الطبي",
    ipAddress: "192.168.1.102",
    status: "success",
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 1200000),
    user: "محمد الإدارة",
    action: "حذف",
    entity: "مستخدم",
    entityId: 10,
    changes: 'تم حذف المستخدم: "test@clinic.com"',
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 1500000),
    user: "فاطمة الاستقبال",
    action: "تعديل",
    entity: "مريض",
    entityId: 2,
    changes: 'الهاتف: "0501234567" -> "0509876543"',
    ipAddress: "192.168.1.101",
    status: "failed",
  },
];

const ACTION_COLORS: Record<string, string> = {
  إضافة: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  تعديل: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  حذف: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  عرض: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(SAMPLE_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("الكل");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.changes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterAction === "الكل" || log.action === filterAction;

    return matchesSearch && matchesFilter;
  });

  const actions = ["الكل", ...Array.from(new Set(logs.map((log) => log.action)))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                سجل العمليات
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                تتبع جميع العمليات والتغييرات في النظام
              </p>
            </div>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4" />
              تحميل التقرير
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن عملية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Action Filter */}
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                {actions.map((action) => (
                  <option key={action} value={action}>
                    {action === "الكل" ? "جميع الإجراءات" : action}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>السجلات</CardTitle>
            <CardDescription>
              إجمالي العمليات: {filteredLogs.length}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      التاريخ والوقت
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      المستخدم
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الإجراء
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الكيان
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      التفاصيل
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {log.timestamp.toLocaleString("ar-SA")}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {log.user}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={ACTION_COLORS[log.action] || ""}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {log.entity} #{log.entityId}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {log.changes}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            log.status === "success" ? "default" : "destructive"
                          }
                        >
                          {log.status === "success" ? "نجح" : "فشل"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                لم يتم العثور على عمليات
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
