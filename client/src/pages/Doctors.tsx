import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, DollarSign, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Doctors() {
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  // Get all doctors
  const { data: doctors } = trpc.doctor.getAll.useQuery();

  // Get selected doctor details
  const { data: selectedDoctorData } = trpc.doctor.getById.useQuery(
    { id: selectedDoctor || 0 },
    { enabled: selectedDoctor !== null }
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              إدارة الأطباء
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              قائمة الأطباء والخدمات
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            طبيب جديد
          </Button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctors List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>الأطباء</CardTitle>
                <CardDescription>
                  {doctors?.length || 0} طبيب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {doctors?.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor.id)}
                      className={`w-full text-right p-3 rounded-lg border transition-colors ${
                        selectedDoctor === doctor.id
                          ? "bg-blue-50 dark:bg-blue-900 border-blue-500"
                          : "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                      }`}
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        د. {doctor.firstName} {doctor.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor.specialization}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctor Details */}
          <div className="lg:col-span-2">
            {selectedDoctorData ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الطبيب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          الاسم الأول
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedDoctorData.firstName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          اسم العائلة
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedDoctorData.lastName}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        التخصص
                      </p>
                      <Badge variant="outline">
                        {selectedDoctorData.specialization}
                      </Badge>
                    </div>

                    {selectedDoctorData.licenseNumber && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          رقم الترخيص
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedDoctorData.licenseNumber}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        الحالة
                      </p>
                      <Badge
                        className={
                          selectedDoctorData.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }
                      >
                        {selectedDoctorData.isActive ? "نشط" : "غير نشط"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Work Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      جدول العمل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          وقت البداية
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedDoctorData.workStartTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          وقت النهاية
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedDoctorData.workEndTime}
                        </p>
                      </div>
                    </div>

                    {selectedDoctorData.workDays && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          أيام العمل
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(selectedDoctorData.workDays).map(
                            (day: string) => (
                              <Badge key={day} variant="secondary">
                                {day}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Consultation Fee */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      الرسوم والعودة المجانية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        رسم الكشفية
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(selectedDoctorData.consultationFee / 100).toFixed(2)} ر.س
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        أيام العودة المجانية
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedDoctorData.followUpFreeDays} أيام
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    اختر طبيباً لعرض تفاصيله
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
