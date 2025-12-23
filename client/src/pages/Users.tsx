import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Search, Shield } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "reception" | "doctor" | "patient";
  status: "active" | "inactive";
  lastLogin: Date;
}

const SAMPLE_USERS: User[] = [
  {
    id: 1,
    name: "محمد الإدارة",
    email: "admin@clinic.com",
    role: "admin",
    status: "active",
    lastLogin: new Date(),
  },
  {
    id: 2,
    name: "فاطمة الاستقبال",
    email: "reception@clinic.com",
    role: "reception",
    status: "active",
    lastLogin: new Date(Date.now() - 3600000),
  },
  {
    id: 3,
    name: "د. أحمد قايد سالم",
    email: "ahmad@clinic.com",
    role: "doctor",
    status: "active",
    lastLogin: new Date(Date.now() - 7200000),
  },
  {
    id: 4,
    name: "د. فاطمة علي",
    email: "fatima@clinic.com",
    role: "doctor",
    status: "active",
    lastLogin: new Date(Date.now() - 86400000),
  },
];

const ROLE_LABELS: Record<string, string> = {
  admin: "مدير",
  reception: "استقبال",
  doctor: "طبيب",
  patient: "مريض",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  reception: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  doctor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  patient: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export default function Users() {
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("هل تريد حذف هذا المستخدم؟")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                إدارة المستخدمين
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                إدارة حسابات المستخدمين والصلاحيات
              </p>
            </div>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              مستخدم جديد
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن مستخدم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
            <CardDescription>
              إجمالي المستخدمين: {filteredUsers.length}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الاسم
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      البريد الإلكتروني
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الدور
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الحالة
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      آخر دخول
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {user.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={ROLE_COLORS[user.role]}>
                          <Shield className="w-3 h-3 ml-1" />
                          {ROLE_LABELS[user.role]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                        >
                          {user.status === "active" ? "نشط" : "معطل"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.lastLogin.toLocaleString("ar-SA")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleStatus(user.id)}
                          >
                            {user.status === "active" ? "تعطيل" : "تفعيل"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                لم يتم العثور على مستخدمين
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
