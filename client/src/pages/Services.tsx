import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

const SAMPLE_SERVICES: Service[] = [
  {
    id: 1,
    name: "كشف عام",
    description: "فحص طبي عام شامل",
    price: 150,
    duration: 30,
    isActive: true,
  },
  {
    id: 2,
    name: "تنظيف أسنان",
    description: "تنظيف وتلميع الأسنان",
    price: 200,
    duration: 45,
    isActive: true,
  },
  {
    id: 3,
    name: "حشو أسنان",
    description: "حشو الأسنان بمادة الكومبوزيت",
    price: 300,
    duration: 60,
    isActive: true,
  },
  {
    id: 4,
    name: "استشارة طبية",
    description: "استشارة طبية متخصصة",
    price: 100,
    duration: 20,
    isActive: true,
  },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(SAMPLE_SERVICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("هل تريد حذف هذه الخدمة؟")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setServices(
      services.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
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
                الخدمات الطبية
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                إدارة الخدمات والعلاجات المتاحة
              </p>
            </div>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              خدمة جديدة
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
                  placeholder="ابحث عن خدمة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className={`${
                !service.isActive ? "opacity-50" : ""
              } hover:shadow-lg transition`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {service.description}
                    </CardDescription>
                  </div>
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "نشط" : "معطل"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      السعر
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {service.price} ر.س
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      المدة
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {service.duration} دقيقة
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => toggleStatus(service.id)}
                  >
                    {service.isActive ? "تعطيل" : "تفعيل"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                لم يتم العثور على خدمات
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
