import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, Mail, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  // Search patients
  const { data: searchResults } = trpc.patient.searchByQuery.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  // Get all patients
  const { data: allPatients } = trpc.patient.getAll.useQuery({
    limit: 100,
    offset: 0,
  });

  // Get selected patient details
  const { data: selectedPatientData } = trpc.patient.getById.useQuery(
    { id: selectedPatient || 0 },
    { enabled: selectedPatient !== null }
  );

  // Get medical records
  const { data: medicalRecords } = trpc.patient.getMedicalRecords.useQuery(
    { patientId: selectedPatient || 0 },
    { enabled: selectedPatient !== null }
  );

  const patients = searchQuery.length > 0 ? searchResults : allPatients;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              إدارة المرضى
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              قائمة المرضى والسجلات الطبية
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            مريض جديد
          </Button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patients List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>المرضى</CardTitle>
                <CardDescription>
                  {patients?.length || 0} مريض
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 relative">
                  <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="ابحث عن مريض..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {patients?.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient.id)}
                      className={`w-full text-right p-3 rounded-lg border transition-colors ${
                        selectedPatient === patient.id
                          ? "bg-blue-50 dark:bg-blue-900 border-blue-500"
                          : "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                      }`}
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {patient.phone}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatientData ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات المريض</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          الاسم الأول
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedPatientData.firstName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          اسم العائلة
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedPatientData.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            الهاتف
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedPatientData.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            البريد الإلكتروني
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedPatientData.email || "غير محدد"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedPatientData.dateOfBirth && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            تاريخ الميلاد
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(selectedPatientData.dateOfBirth).toLocaleDateString("ar-SA")}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        الحالة
                      </p>
                      <Badge
                        className={
                          selectedPatientData.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }
                      >
                        {selectedPatientData.isActive ? "نشط" : "غير نشط"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Records */}
                {medicalRecords && medicalRecords.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>السجل الطبي</CardTitle>
                      <CardDescription>
                        {medicalRecords.length} سجل طبي
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {medicalRecords.map((record) => (
                          <div
                            key={record.id}
                            className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {record.title}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {record.content}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {record.recordType === "diagnosis"
                                  ? "تشخيص"
                                  : record.recordType === "prescription"
                                    ? "وصفة"
                                    : record.recordType === "lab_test"
                                      ? "تحليل"
                                      : "ملاحظة"}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {new Date(record.createdAt).toLocaleDateString("ar-SA")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    اختر مريضاً لعرض تفاصيله
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
