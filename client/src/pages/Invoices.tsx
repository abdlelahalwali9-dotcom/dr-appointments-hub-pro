import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Eye } from "lucide-react";

interface Invoice {
  id: number;
  invoiceNumber: string;
  patientName: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    patientName: "علي محمد",
    amount: 450,
    status: "paid",
    date: new Date(Date.now() - 86400000),
    dueDate: new Date(Date.now() + 604800000),
    items: [
      { description: "كشف عام", quantity: 1, unitPrice: 150 },
      { description: "تحاليل دم", quantity: 1, unitPrice: 300 },
    ],
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    patientName: "نور أحمد",
    amount: 300,
    status: "pending",
    date: new Date(),
    dueDate: new Date(Date.now() + 604800000),
    items: [
      { description: "حشو أسنان", quantity: 1, unitPrice: 300 },
    ],
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    patientName: "محمد علي",
    amount: 200,
    status: "overdue",
    date: new Date(Date.now() - 1209600000),
    dueDate: new Date(Date.now() - 604800000),
    items: [
      { description: "تنظيف أسنان", quantity: 1, unitPrice: 200 },
    ],
  },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(SAMPLE_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "مدفوع";
      case "pending":
        return "قيد الانتظار";
      case "overdue":
        return "متأخر";
      default:
        return "غير معروف";
    }
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === "pending" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                الفواتير والدفعات
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                إدارة الفواتير والمدفوعات
              </p>
            </div>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              فاتورة جديدة
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">الإجمالي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {totalAmount.toLocaleString()} ر.س
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">المدفوع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {paidAmount.toLocaleString()} ر.س
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">المتبقي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {pendingAmount.toLocaleString()} ر.س
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن فاتورة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الفواتير</CardTitle>
            <CardDescription>
              إجمالي الفواتير: {filteredInvoices.length}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      رقم الفاتورة
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      المريض
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      المبلغ
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      التاريخ
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الحالة
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {invoice.patientName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        {invoice.amount.toLocaleString()} ر.س
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {invoice.date.toLocaleDateString("ar-SA")}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                لم يتم العثور على فواتير
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
