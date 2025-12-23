import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MedicalRecord {
  id: number;
  patientName: string;
  patientId: number;
  doctorName: string;
  date: Date;
  diagnosis: string;
  prescription: string;
  notes: string;
  attachments: string[];
}

const SAMPLE_RECORDS: MedicalRecord[] = [
  {
    id: 1,
    patientName: "علي محمد",
    patientId: 1,
    doctorName: "د. أحمد قايد سالم",
    date: new Date(Date.now() - 86400000),
    diagnosis: "نزلة برد",
    prescription: "أموكسيسيلين 500mg × 3 يومياً لمدة 7 أيام",
    notes: "المريض يعاني من أعراض نزلة برد خفيفة",
    attachments: ["تقرير_الأشعة.pdf"],
  },
  {
    id: 2,
    patientName: "نور أحمد",
    patientId: 2,
    doctorName: "د. فاطمة علي",
    date: new Date(Date.now() - 172800000),
    diagnosis: "التهاب اللثة",
    prescription: "غسول الفم بالكلورهيكسيدين",
    notes: "يحتاج إلى تنظيف أسنان احترافي",
    attachments: [],
  },
];

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>(SAMPLE_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null
  );

  const filteredRecords = records.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                السجلات الطبية الإلكترونية
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                إدارة السجلات الطبية والتشخيصات
              </p>
            </div>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              سجل جديد
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
                  placeholder="ابحث عن سجل طبي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Records List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>السجلات</CardTitle>
                <CardDescription>
                  {filteredRecords.length} سجل
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {filteredRecords.map((record) => (
                    <button
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      className={`w-full text-right p-3 rounded-lg transition ${
                        selectedRecord?.id === record.id
                          ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-600"
                          : "bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                      }`}
                    >
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {record.patientName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {record.date.toLocaleDateString("ar-SA")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        د. {record.doctorName}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Record Details */}
          <div className="lg:col-span-2">
            {selectedRecord ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedRecord.patientName}</CardTitle>
                      <CardDescription>
                        {selectedRecord.date.toLocaleDateString("ar-SA")}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      تحميل
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="diagnosis" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="diagnosis">التشخيص</TabsTrigger>
                      <TabsTrigger value="prescription">الوصفة</TabsTrigger>
                      <TabsTrigger value="notes">الملاحظات</TabsTrigger>
                    </TabsList>

                    <TabsContent value="diagnosis" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          التشخيص
                        </label>
                        <p className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white">
                          {selectedRecord.diagnosis}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          الطبيب
                        </label>
                        <p className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white">
                          د. {selectedRecord.doctorName}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="prescription" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          الوصفة الطبية
                        </label>
                        <p className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white whitespace-pre-wrap">
                          {selectedRecord.prescription}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ملاحظات إضافية
                        </label>
                        <p className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white whitespace-pre-wrap">
                          {selectedRecord.notes}
                        </p>
                      </div>

                      {selectedRecord.attachments.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            المرفقات
                          </label>
                          <div className="space-y-2">
                            {selectedRecord.attachments.map((attachment, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-gray-900 dark:text-white">
                                    {attachment}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    اختر سجلاً طبياً لعرض التفاصيل
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
