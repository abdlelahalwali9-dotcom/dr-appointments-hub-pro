import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dr_appointments',
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

async function seedDatabase() {
  const connection = await pool.getConnection();

  try {
    console.log('🌱 بدء زرع البيانات التجريبية...\n');

    // Clear existing data
    console.log('🗑️  حذف البيانات القديمة...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE appointments');
    await connection.query('TRUNCATE TABLE medical_records');
    await connection.query('TRUNCATE TABLE patients');
    await connection.query('TRUNCATE TABLE doctors');
    await connection.query('TRUNCATE TABLE services');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insert Users
    console.log('👥 إضافة المستخدمين...');
    const users = [
      {
        openId: 'admin-001',
        name: 'محمد الإدارة',
        email: 'admin@clinic.com',
        loginMethod: 'manus',
        role: 'admin',
      },
      {
        openId: 'reception-001',
        name: 'فاطمة الاستقبال',
        email: 'reception@clinic.com',
        loginMethod: 'manus',
        role: 'reception',
      },
      {
        openId: 'doctor-001',
        name: 'د. أحمد قايد سالم',
        email: 'ahmad@clinic.com',
        loginMethod: 'manus',
        role: 'doctor',
      },
      {
        openId: 'doctor-002',
        name: 'د. فاطمة علي',
        email: 'fatima@clinic.com',
        loginMethod: 'manus',
        role: 'doctor',
      },
      {
        openId: 'patient-001',
        name: 'علي محمد',
        email: 'ali@example.com',
        loginMethod: 'manus',
        role: 'patient',
      },
    ];

    for (const user of users) {
      await connection.query(
        'INSERT INTO users (openId, name, email, loginMethod, role) VALUES (?, ?, ?, ?, ?)',
        [user.openId, user.name, user.email, user.loginMethod, user.role]
      );
    }
    console.log(`✅ تم إضافة ${users.length} مستخدمين\n`);

    // Insert Doctors
    console.log('👨‍⚕️ إضافة الأطباء...');
    const doctors = [
      {
        firstName: 'أحمد',
        lastName: 'قايد سالم',
        specialization: 'طب عام',
        phone: '0501234567',
        email: 'ahmad@clinic.com',
        licenseNumber: 'LIC001',
        consultationFee: 15000, // 150 SAR
        followUpFreeDays: 7,
        workStartTime: '09:00',
        workEndTime: '17:00',
        workDays: JSON.stringify(['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء']),
        isActive: true,
      },
      {
        firstName: 'فاطمة',
        lastName: 'علي',
        specialization: 'أسنان',
        phone: '0509876543',
        email: 'fatima@clinic.com',
        licenseNumber: 'LIC002',
        consultationFee: 20000, // 200 SAR
        followUpFreeDays: 14,
        workStartTime: '10:00',
        workEndTime: '18:00',
        workDays: JSON.stringify(['السبت', 'الأحد', 'الاثنين', 'الخميس']),
        isActive: true,
      },
    ];

    for (const doctor of doctors) {
      await connection.query(
        'INSERT INTO doctors (firstName, lastName, specialization, phone, email, licenseNumber, consultationFee, followUpFreeDays, workStartTime, workEndTime, workDays, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          doctor.firstName,
          doctor.lastName,
          doctor.specialization,
          doctor.phone,
          doctor.email,
          doctor.licenseNumber,
          doctor.consultationFee,
          doctor.followUpFreeDays,
          doctor.workStartTime,
          doctor.workEndTime,
          doctor.workDays,
          doctor.isActive,
        ]
      );
    }
    console.log(`✅ تم إضافة ${doctors.length} أطباء\n`);

    // Insert Services
    console.log('🏥 إضافة الخدمات...');
    const services = [
      {
        name: 'كشف عام',
        description: 'فحص طبي عام شامل',
        price: 15000,
        duration: 30,
        isActive: true,
      },
      {
        name: 'تنظيف أسنان',
        description: 'تنظيف وتلميع الأسنان',
        price: 20000,
        duration: 45,
        isActive: true,
      },
      {
        name: 'حشو أسنان',
        description: 'حشو الأسنان بمادة الكومبوزيت',
        price: 30000,
        duration: 60,
        isActive: true,
      },
      {
        name: 'استشارة طبية',
        description: 'استشارة طبية متخصصة',
        price: 10000,
        duration: 20,
        isActive: true,
      },
    ];

    for (const service of services) {
      await connection.query(
        'INSERT INTO services (name, description, price, duration, isActive) VALUES (?, ?, ?, ?, ?)',
        [service.name, service.description, service.price, service.duration, service.isActive]
      );
    }
    console.log(`✅ تم إضافة ${services.length} خدمات\n`);

    // Insert Patients
    console.log('🤒 إضافة المرضى...');
    const patients = [
      {
        firstName: 'علي',
        lastName: 'محمد',
        phone: '0505555555',
        email: 'ali@example.com',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        address: 'الرياض',
        isActive: true,
      },
      {
        firstName: 'نور',
        lastName: 'أحمد',
        phone: '0506666666',
        email: 'noor@example.com',
        dateOfBirth: '1995-08-20',
        gender: 'female',
        address: 'جدة',
        isActive: true,
      },
      {
        firstName: 'محمد',
        lastName: 'علي',
        phone: '0507777777',
        email: 'mohammad@example.com',
        dateOfBirth: '1988-03-10',
        gender: 'male',
        address: 'الدمام',
        isActive: true,
      },
      {
        firstName: 'سارة',
        lastName: 'خالد',
        phone: '0508888888',
        email: 'sarah@example.com',
        dateOfBirth: '1992-12-25',
        gender: 'female',
        address: 'الرياض',
        isActive: true,
      },
    ];

    for (const patient of patients) {
      await connection.query(
        'INSERT INTO patients (firstName, lastName, phone, email, dateOfBirth, gender, address, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          patient.firstName,
          patient.lastName,
          patient.phone,
          patient.email,
          patient.dateOfBirth,
          patient.gender,
          patient.address,
          patient.isActive,
        ]
      );
    }
    console.log(`✅ تم إضافة ${patients.length} مريض\n`);

    // Insert Medical Records
    console.log('📋 إضافة السجلات الطبية...');
    const medicalRecords = [
      {
        patientId: 1,
        title: 'ارتفاع ضغط الدم',
        content: 'تم تشخيص المريض بارتفاع ضغط الدم',
        recordType: 'diagnosis',
      },
      {
        patientId: 1,
        title: 'دواء الضغط',
        content: 'ليسينوبريل 10 ملغ يومياً',
        recordType: 'prescription',
      },
      {
        patientId: 2,
        title: 'تحليل الدم',
        content: 'تحليل دم شامل - النتائج طبيعية',
        recordType: 'lab_test',
      },
    ];

    for (const record of medicalRecords) {
      await connection.query(
        'INSERT INTO medical_records (patientId, title, content, recordType) VALUES (?, ?, ?, ?)',
        [record.patientId, record.title, record.content, record.recordType]
      );
    }
    console.log(`✅ تم إضافة ${medicalRecords.length} سجل طبي\n`);

    // Insert Appointments
    console.log('📅 إضافة المواعيد...');
    const today = new Date();
    const appointments = [
      {
        patientId: 1,
        doctorId: 1,
        appointmentDate: new Date(today.getTime() + 86400000).toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '09:30',
        status: 'scheduled',
        fee: 15000,
        notes: 'متابعة ضغط الدم',
      },
      {
        patientId: 2,
        doctorId: 2,
        appointmentDate: new Date(today.getTime() + 86400000).toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '10:45',
        status: 'scheduled',
        fee: 20000,
        notes: 'تنظيف أسنان',
      },
      {
        patientId: 3,
        doctorId: 1,
        appointmentDate: new Date(today.getTime() + 172800000).toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '14:30',
        status: 'scheduled',
        fee: 15000,
        notes: 'فحص عام',
      },
      {
        patientId: 4,
        doctorId: 2,
        appointmentDate: new Date(today.getTime() + 172800000).toISOString().split('T')[0],
        startTime: '15:00',
        endTime: '15:45',
        status: 'waiting',
        fee: 20000,
        notes: 'حشو أسنان',
      },
    ];

    for (const appointment of appointments) {
      await connection.query(
        'INSERT INTO appointments (patientId, doctorId, appointmentDate, startTime, endTime, status, fee, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          appointment.patientId,
          appointment.doctorId,
          appointment.appointmentDate,
          appointment.startTime,
          appointment.endTime,
          appointment.status,
          appointment.fee,
          appointment.notes,
        ]
      );
    }
    console.log(`✅ تم إضافة ${appointments.length} موعد\n`);

    console.log('✨ تم زرع البيانات بنجاح!');
    console.log('\n📊 ملخص البيانات المزروعة:');
    console.log(`   - ${users.length} مستخدمين`);
    console.log(`   - ${doctors.length} أطباء`);
    console.log(`   - ${services.length} خدمات`);
    console.log(`   - ${patients.length} مرضى`);
    console.log(`   - ${medicalRecords.length} سجل طبي`);
    console.log(`   - ${appointments.length} موعد`);
  } catch (error) {
    console.error('❌ خطأ في زرع البيانات:', error);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedDatabase();
