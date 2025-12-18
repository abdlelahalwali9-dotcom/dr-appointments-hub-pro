import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId?: number;
  onSuccess?: () => void;
}

const APPOINTMENT_STATUSES = [
  { value: "scheduled", label: "مجدول" },
  { value: "waiting", label: "في الانتظار" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغى" },
  { value: "followup", label: "عودة مجانية" },
];

export function AppointmentForm({
  open,
  onOpenChange,
  appointmentId,
  onSuccess,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    patientId: 0,
    doctorId: 0,
    appointmentDate: "",
    startTime: "",
    endTime: "",
    status: "scheduled",
    fee: 0,
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch patients and doctors
  const { data: patients } = trpc.patient.getAll.useQuery({
    limit: 1000,
    offset: 0,
  });
  const { data: doctors } = trpc.doctor.getAll.useQuery();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) newErrors.patientId = "المريض مطلوب";
    if (!formData.doctorId) newErrors.doctorId = "الطبيب مطلوب";
    if (!formData.appointmentDate) newErrors.appointmentDate = "التاريخ مطلوب";
    if (!formData.startTime) newErrors.startTime = "وقت البداية مطلوب";
    if (!formData.endTime) newErrors.endTime = "وقت النهاية مطلوب";
    if (formData.fee < 0) newErrors.fee = "التكلفة غير صحيحة";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Saving appointment:", formData);

    setFormData({
      patientId: 0,
      doctorId: 0,
      appointmentDate: "",
      startTime: "",
      endTime: "",
      status: "scheduled",
      fee: 0,
      notes: "",
    });
    setErrors({});
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {appointmentId ? "تعديل الموعد" : "إضافة موعد جديد"}
          </DialogTitle>
          <DialogDescription>
            {appointmentId ? "قم بتعديل بيانات الموعد" : "أدخل بيانات الموعد الجديد"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient & Doctor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المريض *
              </label>
              <select
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    patientId: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
              >
                <option value="0">اختر المريض</option>
                {patients?.map((patient: any) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="text-red-500 text-sm mt-1">{errors.patientId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الطبيب *
              </label>
              <select
                value={formData.doctorId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    doctorId: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
              >
                <option value="0">اختر الطبيب</option>
                {doctors?.map((doctor: any) => (
                  <option key={doctor.id} value={doctor.id}>
                    د. {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <p className="text-red-500 text-sm mt-1">{errors.doctorId}</p>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                التاريخ *
              </label>
              <Input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentDate: e.target.value })
                }
                className={errors.appointmentDate ? "border-red-500" : ""}
              />
              {errors.appointmentDate && (
                <p className="text-red-500 text-sm mt-1">{errors.appointmentDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وقت البداية *
              </label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className={errors.startTime ? "border-red-500" : ""}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وقت النهاية *
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className={errors.endTime ? "border-red-500" : ""}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Status & Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الحالة
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
              >
                {APPOINTMENT_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                التكلفة (ريال)
              </label>
              <Input
                type="number"
                value={formData.fee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fee: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className={errors.fee ? "border-red-500" : ""}
              />
              {errors.fee && (
                <p className="text-red-500 text-sm mt-1">{errors.fee}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ملاحظات
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="أدخل أي ملاحظات إضافية"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {appointmentId ? "تحديث" : "إضافة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
