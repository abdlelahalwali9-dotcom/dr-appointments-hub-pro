import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";

interface DoctorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId?: number;
  onSuccess?: () => void;
}

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const SPECIALIZATIONS = ["طب عام", "أسنان", "عيون", "قلب", "جراحة", "نساء وتوليد", "أطفال"];

export function DoctorForm({
  open,
  onOpenChange,
  doctorId,
  onSuccess,
}: DoctorFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    phone: "",
    email: "",
    licenseNumber: "",
    consultationFee: 0,
    followUpFreeDays: 7,
    workStartTime: "09:00",
    workEndTime: "17:00",
    workDays: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "الاسم الأول مطلوب";
    if (!formData.lastName.trim()) newErrors.lastName = "اسم العائلة مطلوب";
    if (!formData.specialization) newErrors.specialization = "التخصص مطلوب";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "رقم الترخيص مطلوب";
    if (formData.consultationFee <= 0) newErrors.consultationFee = "تكلفة الكشفية مطلوبة";
    if (formData.workDays.length === 0) newErrors.workDays = "اختر يوماً واحداً على الأقل";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleWorkDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Saving doctor:", formData);

    setFormData({
      firstName: "",
      lastName: "",
      specialization: "",
      phone: "",
      email: "",
      licenseNumber: "",
      consultationFee: 0,
      followUpFreeDays: 7,
      workStartTime: "09:00",
      workEndTime: "17:00",
      workDays: [],
    });
    setErrors({});
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {doctorId ? "تعديل بيانات الطبيب" : "إضافة طبيب جديد"}
          </DialogTitle>
          <DialogDescription>
            {doctorId ? "قم بتعديل بيانات الطبيب" : "أدخل بيانات الطبيب الجديد"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الاسم الأول *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="أحمد"
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم العائلة *
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="قايد سالم"
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Specialization & License */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                التخصص *
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
              >
                <option value="">اختر التخصص</option>
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رقم الترخيص *
              </label>
              <Input
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                placeholder="LIC001"
                className={errors.licenseNumber ? "border-red-500" : ""}
              />
              {errors.licenseNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>
              )}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رقم الهاتف *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="0501234567"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="doctor@clinic.com"
              />
            </div>
          </div>

          {/* Fees */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تكلفة الكشفية (ريال) *
              </label>
              <Input
                type="number"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consultationFee: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="150"
                className={errors.consultationFee ? "border-red-500" : ""}
              />
              {errors.consultationFee && (
                <p className="text-red-500 text-sm mt-1">{errors.consultationFee}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                أيام العودة المجانية
              </label>
              <Input
                type="number"
                value={formData.followUpFreeDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    followUpFreeDays: parseInt(e.target.value) || 7,
                  })
                }
                placeholder="7"
              />
            </div>
          </div>

          {/* Work Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وقت البداية
              </label>
              <Input
                type="time"
                value={formData.workStartTime}
                onChange={(e) =>
                  setFormData({ ...formData, workStartTime: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وقت النهاية
              </label>
              <Input
                type="time"
                value={formData.workEndTime}
                onChange={(e) =>
                  setFormData({ ...formData, workEndTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* Work Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              أيام العمل *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleWorkDay(day)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    formData.workDays.includes(day)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.workDays && (
              <p className="text-red-500 text-sm mt-1">{errors.workDays}</p>
            )}
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
              {doctorId ? "تحديث" : "إضافة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
