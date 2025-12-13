CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`doctorId` int NOT NULL,
	`serviceId` int,
	`appointmentDate` timestamp NOT NULL,
	`startTime` varchar(10) NOT NULL,
	`endTime` varchar(10) NOT NULL,
	`status` enum('scheduled','waiting','completed','cancelled','no_show','follow_up') NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`fee` int,
	`isPaid` boolean NOT NULL DEFAULT false,
	`paymentMethod` enum('cash','card','transfer','other'),
	`diagnosis` text,
	`prescription` text,
	`followUpDate` timestamp,
	`isFollowUpFree` boolean NOT NULL DEFAULT false,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(100) NOT NULL,
	`entityId` int,
	`changes` text,
	`ipAddress` varchar(50),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `doctors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`specialization` varchar(100) NOT NULL,
	`licenseNumber` varchar(100),
	`bio` text,
	`workDays` text,
	`workStartTime` varchar(10),
	`workEndTime` varchar(10),
	`consultationFee` int NOT NULL,
	`followUpFreeDays` int NOT NULL DEFAULT 7,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `doctors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dynamicFields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`formType` enum('patient','appointment','medical_record') NOT NULL,
	`fieldName` varchar(100) NOT NULL,
	`fieldLabel` varchar(200) NOT NULL,
	`fieldType` enum('text','number','date','select','checkbox','textarea') NOT NULL,
	`isRequired` boolean NOT NULL DEFAULT false,
	`options` text,
	`placeholder` varchar(200),
	`order` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dynamicFields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medicalRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`appointmentId` int,
	`doctorId` int NOT NULL,
	`recordType` enum('diagnosis','prescription','lab_test','note','other') NOT NULL,
	`title` varchar(200) NOT NULL,
	`content` text NOT NULL,
	`attachments` text,
	`isConfidential` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `medicalRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messageGroupMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messageGroupMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messageGroups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`createdBy` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messageGroups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int,
	`groupId` int,
	`content` text NOT NULL,
	`messageType` enum('text','alert','notification') NOT NULL DEFAULT 'text',
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`content` text,
	`type` enum('appointment_reminder','follow_up','message','alert','system') NOT NULL DEFAULT 'system',
	`relatedId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`sentVia` enum('in_app','sms','whatsapp','email') NOT NULL DEFAULT 'in_app',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20) NOT NULL,
	`dateOfBirth` timestamp,
	`gender` enum('male','female','other'),
	`address` text,
	`city` varchar(100),
	`emergencyContact` varchar(100),
	`emergencyPhone` varchar(20),
	`medicalHistory` text,
	`allergies` text,
	`currentMedications` text,
	`notes` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revenueRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int,
	`doctorId` int,
	`amount` int NOT NULL,
	`paymentMethod` enum('cash','card','transfer','other') NOT NULL,
	`notes` text,
	`recordedBy` int,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `revenueRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`doctorId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`fee` int NOT NULL,
	`durationMinutes` int NOT NULL DEFAULT 30,
	`followUpFreeDays` int NOT NULL DEFAULT 7,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `systemSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clinicName` varchar(200) NOT NULL,
	`clinicEmail` varchar(320),
	`clinicPhone` varchar(20),
	`clinicAddress` text,
	`clinicLogo` varchar(500),
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`language` enum('ar','en') NOT NULL DEFAULT 'ar',
	`timeZone` varchar(50) NOT NULL DEFAULT 'Asia/Riyadh',
	`workingDays` text,
	`workingHours` text,
	`appointmentDurationMinutes` int NOT NULL DEFAULT 30,
	`smsEnabled` boolean NOT NULL DEFAULT false,
	`whatsappEnabled` boolean NOT NULL DEFAULT false,
	`emailEnabled` boolean NOT NULL DEFAULT false,
	`reminderHoursBefore` int NOT NULL DEFAULT 24,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `systemSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waitingQueue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`patientId` int NOT NULL,
	`doctorId` int NOT NULL,
	`position` int NOT NULL,
	`priority` enum('normal','urgent','child','elderly') NOT NULL DEFAULT 'normal',
	`estimatedWaitTime` int,
	`checkedInAt` timestamp,
	`calledAt` timestamp,
	`seenAt` timestamp,
	`status` enum('waiting','called','in_progress','completed','no_show') NOT NULL DEFAULT 'waiting',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `waitingQueue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','receptionist','doctor','patient','user') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;