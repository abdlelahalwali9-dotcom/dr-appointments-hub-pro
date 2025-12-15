import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Building2, Bell, Lock, Database } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [clinicName, setClinicName] = useState("");
  const [clinicEmail, setClinicEmail] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");

  // Get system settings
  const { data: settings } = trpc.settings.getSystemSettings.useQuery();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                الإعدادات
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                إدارة إعدادات النظام والمركز
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">عام</TabsTrigger>
            <TabsTrigger value="clinic">المركز</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            <TabsTrigger value="security">الأمان</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات العامة</CardTitle>
                <CardDescription>
                  إعدادات عامة للنظام
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      اللغة
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      المنطقة الزمنية
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                      <option value="Asia/Riyadh">Asia/Riyadh</option>
                      <option value="Asia/Dubai">Asia/Dubai</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العملة
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                      <option value="SAR">ر.س (SAR)</option>
                      <option value="AED">د.إ (AED)</option>
                      <option value="USD">$ (USD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      مدة الموعد الافتراضية (دقيقة)
                    </label>
                    <Input
                      type="number"
                      defaultValue="30"
                      className="w-full"
                    />
                  </div>
                </div>

                <Button className="w-full md:w-auto">حفظ الإعدادات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clinic Settings */}
          <TabsContent value="clinic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  معلومات المركز
                </CardTitle>
                <CardDescription>
                  بيانات المركز الأساسية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اسم المركز
                  </label>
                  <Input
                    placeholder="مركز د. أحمد قايد سالم"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      البريد الإلكتروني
                    </label>
                    <Input
                      type="email"
                      placeholder="info@clinic.com"
                      value={clinicEmail}
                      onChange={(e) => setClinicEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رقم الهاتف
                    </label>
                    <Input
                      type="tel"
                      placeholder="+966 50 000 0000"
                      value={clinicPhone}
                      onChange={(e) => setClinicPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العنوان
                  </label>
                  <textarea
                    placeholder="عنوان المركز الكامل"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الشعار
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                  />
                </div>

                <Button className="w-full md:w-auto">حفظ البيانات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  إعدادات الإشعارات
                </CardTitle>
                <CardDescription>
                  تحكم في قنوات الإشعارات والتنبيهات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        إشعارات البريد الإلكتروني
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        إرسال إشعارات عبر البريد الإلكتروني
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        إشعارات SMS
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        إرسال رسائل نصية قصيرة
                      </p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        إشعارات WhatsApp
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        إرسال رسائل عبر WhatsApp
                      </p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عدد الساعات قبل الموعد للتذكير
                  </label>
                  <Input
                    type="number"
                    defaultValue="24"
                    className="w-full md:w-32"
                  />
                </div>

                <Button className="w-full md:w-auto">حفظ الإعدادات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  إعدادات الأمان
                </CardTitle>
                <CardDescription>
                  تحكم في الأمان والخصوصية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      المصادقة الثنائية (2FA)
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                      تفعيل المصادقة الثنائية لجميع الموظفين
                    </p>
                    <Button variant="outline">تفعيل</Button>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">
                      تشفير البيانات
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      جميع البيانات الحساسة مشفرة بـ AES-256
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">
                      سجل الدخول الآمن
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      دخول آمن باستخدام OAuth و JWT
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
                  <Button variant="destructive">تغيير كلمة المرور</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
