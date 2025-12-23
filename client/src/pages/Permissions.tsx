import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2 } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const ALL_PERMISSIONS: Permission[] = [
  { id: "view_dashboard", name: "عرض لوحة التحكم", description: "الوصول إلى لوحة التحكم الرئيسية" },
  { id: "manage_patients", name: "إدارة المرضى", description: "إضافة وتعديل وحذف المرضى" },
  { id: "manage_doctors", name: "إدارة الأطباء", description: "إضافة وتعديل وحذف الأطباء" },
  { id: "manage_appointments", name: "إدارة المواعيد", description: "إضافة وتعديل وحذف المواعيد" },
  { id: "view_medical_records", name: "عرض السجلات الطبية", description: "الوصول إلى السجلات الطبية" },
  { id: "manage_invoices", name: "إدارة الفواتير", description: "إنشاء وتعديل الفواتير" },
  { id: "manage_users", name: "إدارة المستخدمين", description: "إضافة وتعديل وحذف المستخدمين" },
  { id: "manage_settings", name: "إدارة الإعدادات", description: "تغيير إعدادات النظام" },
  { id: "view_reports", name: "عرض التقارير", description: "الوصول إلى التقارير والإحصائيات" },
  { id: "manage_permissions", name: "إدارة الصلاحيات", description: "تعديل الأدوار والصلاحيات" },
];

const SAMPLE_ROLES: Role[] = [
  {
    id: 1,
    name: "مدير النظام",
    description: "لديه صلاحيات كاملة على جميع الأقسام",
    permissions: ALL_PERMISSIONS.map((p) => p.id),
    userCount: 1,
  },
  {
    id: 2,
    name: "الطبيب",
    description: "يمكنه عرض وإدارة مواعيده والسجلات الطبية",
    permissions: [
      "view_dashboard",
      "manage_appointments",
      "view_medical_records",
    ],
    userCount: 2,
  },
  {
    id: 3,
    name: "موظف الاستقبال",
    description: "يمكنه إدارة المواعيد والمرضى",
    permissions: [
      "view_dashboard",
      "manage_patients",
      "manage_appointments",
      "view_medical_records",
    ],
    userCount: 1,
  },
];

export default function Permissions() {
  const [roles, setRoles] = useState<Role[]>(SAMPLE_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0]);
  const [editingPermissions, setEditingPermissions] = useState<string[]>(
    selectedRole?.permissions || []
  );

  const handlePermissionToggle = (permissionId: string) => {
    setEditingPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;

    setRoles(
      roles.map((role) =>
        role.id === selectedRole.id
          ? { ...role, permissions: editingPermissions }
          : role
      )
    );

    setSelectedRole({
      ...selectedRole,
      permissions: editingPermissions,
    });
  };

  const handleDeleteRole = (id: number) => {
    if (confirm("هل تريد حذف هذا الدور؟")) {
      const newRoles = roles.filter((r) => r.id !== id);
      setRoles(newRoles);
      setSelectedRole(newRoles[0] || null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              إدارة الأدوار والصلاحيات
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              تحديد الأدوار والصلاحيات للمستخدمين
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>الأدوار</CardTitle>
              <CardDescription>{roles.length} دور</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role);
                    setEditingPermissions(role.permissions);
                  }}
                  className={`w-full text-right p-3 rounded-lg transition ${
                    selectedRole?.id === role.id
                      ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-600"
                      : "bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {role.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {role.userCount} مستخدم
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Permissions Editor */}
          {selectedRole ? (
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedRole.name}</CardTitle>
                    <CardDescription>
                      {selectedRole.description}
                    </CardDescription>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRole(selectedRole.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Permissions Grid */}
                <div className="space-y-3">
                  {ALL_PERMISSIONS.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={editingPermissions.includes(permission.id)}
                        onCheckedChange={() =>
                          handlePermissionToggle(permission.id)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={permission.id}
                          className="font-medium text-gray-900 dark:text-white cursor-pointer"
                        >
                          {permission.name}
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-600">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      setEditingPermissions(selectedRole.permissions)
                    }
                  >
                    إلغاء
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={handleSavePermissions}
                  >
                    حفظ التغييرات
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="lg:col-span-2 flex items-center justify-center">
              <CardContent className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  اختر دوراً لتعديل صلاحياته
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
