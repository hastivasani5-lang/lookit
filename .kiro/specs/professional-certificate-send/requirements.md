# Requirements Document

## Introduction

Professional Dashboard ના "Live Purchases" page માં બે major improvements add કરવાના છે:

1. **Student Grouping**: હાળ table માં same student ના multiple rows દેખાય છે (દા.ત. "Hasti Vasani" 4 વખત). હવે table માં per-unique-student એક જ row દેખાવી જોઈએ, અને "View All" button click કરવાથી existing drawer open થઈ student ના બધા purchases show થવા જોઈએ.

2. **Certificate Feature**: Professional student ને certificate send કરી શકે — ફક્ત એ students ને જેમણે actually purchase કર્યું હોય. Certificate send button student drawer ની અંદર હોવો જોઈએ.

## Glossary

- **Professional**: Dashboard use કરતો teacher/instructor (NextAuth session user with role "professional")
- **Student**: Course/book/video purchase કરનાર user
- **Purchase_Table**: Live Purchases page ની main data table
- **Student_Drawer**: Right-side slide-in panel જે specific student ના purchases show કરે
- **Student_Group**: Unique studentId ના basis પર grouped purchases — one row per student
- **Certificate**: Professional દ્વારા student ને send થતો digital achievement document
- **Certificate_API**: `/api/profile/certificates` endpoint જે certificate send/fetch handle કરે
- **Certificate_Store**: `data/certificates.json` file જ્યાં sent certificates persist થાય
- **PurchaseRow**: API return કરતો object: `{ id, studentId, studentName, itemTitle, contentType, purchaseTime, transactionId, amount }`

---

## Requirements

### Requirement 1: Student-wise Grouping in Purchase Table

**User Story:** As a professional, I want to see one row per unique student in the purchases table, so that I can quickly see how many distinct students bought my content today without scrolling through duplicate rows.

#### Acceptance Criteria

1. THE Purchase_Table SHALL display exactly one row per unique `studentId` from today's purchases.
2. WHEN multiple purchases exist for the same student, THE Purchase_Table SHALL show the most recent `purchaseTime` in that student's row.
3. THE Purchase_Table SHALL show the total purchase count for each student in their row (e.g., "3 purchases").
4. WHEN a professional clicks the "View All" button on a student row, THE Student_Drawer SHALL open and display all individual purchases for that student.
5. THE Purchase_Table SHALL show the student's name and total number of unique items purchased in the grouped row.
6. IF no purchases exist for today, THEN THE Purchase_Table SHALL display an empty state message "No student purchases yet."

---

### Requirement 2: Certificate Send Feature

**User Story:** As a professional, I want to send a certificate to a student who has purchased my course/book/video, so that I can reward and recognize their learning achievement.

#### Acceptance Criteria

1. WHEN the Student_Drawer is open for a student who has at least one completed purchase, THE Student_Drawer SHALL display a "Send Certificate" button.
2. WHEN a professional clicks "Send Certificate", THE Certificate_API SHALL create a certificate record with: `professionalId`, `studentId`, `studentName`, `issuedAt` timestamp, and `message` (optional).
3. IF a certificate has already been sent to a student by the same professional today, THEN THE Certificate_API SHALL return a `409 Conflict` response and THE Student_Drawer SHALL show "Certificate already sent today" message.
4. WHEN a certificate is successfully sent, THE Certificate_Store SHALL persist the certificate record to `data/certificates.json`.
5. WHEN a certificate is successfully sent, THE Student_Drawer SHALL show a success confirmation "Certificate sent successfully".
6. IF the professional is not authenticated, THEN THE Certificate_API SHALL return a `401 Unauthorized` response.
7. THE Certificate_API SHALL only allow sending certificates to students who have at least one `completed` payment with that professional's `professionalId`.
8. IF the student has no completed purchases with this professional, THEN THE Certificate_API SHALL return a `403 Forbidden` response.

---

### Requirement 3: Certificate Send State in Drawer

**User Story:** As a professional, I want to see the certificate send status for each student in the drawer, so that I know which students have already received a certificate.

#### Acceptance Criteria

1. WHEN the Student_Drawer opens, THE Student_Drawer SHALL fetch existing certificates for that student from THE Certificate_API.
2. IF a certificate was already sent to the student by this professional, THEN THE Student_Drawer SHALL show "Certificate Sent ✓" badge instead of the "Send Certificate" button.
3. WHILE a certificate send request is in progress, THE Student_Drawer SHALL disable the "Send Certificate" button and show a loading spinner.
4. THE Certificate_API GET endpoint SHALL return all certificates sent by the authenticated professional, filterable by `studentId` query param.

---

### Requirement 4: Certificate Data Persistence

**User Story:** As a professional, I want certificate records to be stored reliably, so that the sent history is preserved across page refreshes.

#### Acceptance Criteria

1. THE Certificate_Store SHALL store each certificate as: `{ id, professionalId, studentId, studentName, issuedAt, message }`.
2. THE Certificate_API SHALL read and write to `data/certificates.json` using the same file-based pattern as other stores in the app.
3. IF `data/certificates.json` does not exist, THEN THE Certificate_API SHALL initialize it with an empty array `{ "certificates": [] }`.
4. THE Certificate_Store SHALL assign a unique `id` to each certificate in the format `cert-{timestamp}-{randomSuffix}`.
