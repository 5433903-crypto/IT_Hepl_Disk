# Campus IT Help Desk & Automated Lab Monitor

**Final Year Computer Engineering Project Architecture & Specification Blueprint**  
*Domain:* Network & AI Systems • *Frontend:* React.js + Tailwind CSS • *Backend:* Node.js / Express.js • *Database:* MongoDB / Mongoose

---

## 1. Executive Summary & Core Objective

In campus computer laboratories, network outages, server failures, and Wi-Fi disruptions often result in mass confusion among students and redundant complaints to lab technicians. 

The **Campus IT Help Desk & Automated Lab Monitor** introduces an intelligent, dual-tiered diagnostic framework:
1. **Automated College-Wide Outage Registry Check:** When a student reports an issue at their assigned lab PC, the system first queries the active outage database for that laboratory or campus-wide.
2. **Outage Alert Interception:** If an active outage exists, the student is immediately shown the live outage banner with an active countdown timer (ETA), preventing redundant reports and eliminating unnecessary Vision AI API calls.
3. **Vision AI / Local OCR Error Scanner:** If no widespread outage exists, the system analyzes the uploaded screenshot/photo with the Vision AI service.
4. **Knowledge Base Diagnostic Matcher:** Extracted error text and symptoms are matched against a pre-indexed knowledge base, giving students actionable troubleshooting steps and copyable terminal fix commands.
5. **One-Click Escalation:** If the issue remains unresolved after performing local diagnostics, the student can escalate directly into a support ticket with attached diagnostic logs and PC location.
6. **Department & Admin Panel:** IT administrators manage active outage broadcasts, triage unresolved tickets with technician notes, toggle the real-time Lab Status Matrix (Lab 1 through Lab 6), and analyze recurring failure trends.

---

## 2. Automated Flow Architecture

```
                      +-----------------------------+
                      |        Student Login        |
                      |  Roll No, Lab & PC Location |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |    Upload Error Image /     |
                      |   1-Click Demo Scenario     |
                      +--------------+--------------+
                                     |
                                     v
                       /---------------------------\
                      /       Active Outage?        \
                     <      (Fast DB Check)          >
                      \                             /
                       \---------------------------/
                             /               \
                       YES  /                 \  NO (Fallback)
                           v                   v
            +------------------------+  +--------------------------+
            |  Display Live Outage   |  |   Vision AI OCR & KB     |
            |   Announcement Banner  |  |    Solution Matcher      |
            |   with Live Countdown  |  +------------+-------------+
            +------------------------+               |
                                                     v
                                        +--------------------------+
                                        |  Actionable Fix Steps &  |
                                        | Copyable Terminal Cmds   |
                                        +------------+-------------+
                                                     |
                                            Unresolved Issue?
                                                     |
                                                     v
                                        +--------------------------+
                                        |   One-Click Escalation   |
                                        |    to Support Ticket     |
                                        +------------+-------------+
                                                     |
                                                     v
                                        +--------------------------+
                                        |    Department Live       |
                                        |      Ticket Queue        |
                                        +--------------------------+
```

---

## 3. Core System Modules & Features

### 👨‍🎓 Student Portal
- **Contextual Authentication:** Student session capturing Department, Roll Number (`CS-2022-042`), and assigned Lab PC (`Lab 2`, `PC-14`).
- **Live Outage Banner:** Prominently alerts students of active maintenance with a real-time countdown timer.
- **AI Error Scanner & 1-Click Presets:** Instant error text extraction matching common lab errors (DNS NXDOMAIN, CUDA driver mismatch, cable disconnection, BSOD stop codes, APIPA DHCP leases).
- **Interactive Action Checklist & Terminal Fixes:** Copyable terminal commands (`ipconfig /flushdns`, `netsh winsock reset`, `nvidia-smi`).
- **One-Click Ticket Escalation:** Automatically routes unresolved issues to the IT technician queue.
- **My Tickets History:** Students can track progress, assigned technician, and technician resolution notes.

### 👨‍💻 Department & IT Admin Panel
- **Executive Operations Dashboard:** Real-time KPI metrics for active outages, live open tickets, monitored labs, and average resolution time.
- **Broadcast Control:** Publish campus-wide or lab-specific maintenance notices with severity tags and live resolution countdowns.
- **Live Ticket Queue:** Filter tickets by lab, status, and category. Triage tickets with modal view, inspect error screenshots, update status, and log technician notes.
- **Lab Status Matrix:** Interactive 3x2 grid of all 6 campus laboratories. Toggle individual labs (`Online`, `Degraded`, `Offline`) with 1 click.
- **Recurring Error Analytics:** Rich Recharts visualizations displaying weekly network vs hardware failure trends, category breakdowns, and recurring error signatures.
- **Knowledge Base Solutions Repository:** Search, view, and add pre-indexed solutions with error codes and copyable fix commands.

---

## 4. Technology Stack

- **Frontend:**
  - React.js 18 + Vite
  - Tailwind CSS (custom dark theme with high-tech glassmorphism and glow effects)
  - React Router DOM (protected route navigation guards)
  - Axios (HTTP client with JWT Bearer interceptor)
  - Lucide React (vector iconography)
  - Recharts (AreaChart, BarChart, PieChart)
- **Backend:**
  - Node.js + Express.js REST API under `/api/v1`
  - MongoDB with Mongoose ODM
  - JSON Web Tokens (JWT) authentication & role-based authorization
  - bcryptjs for password hashing
  - Multer for multipart screenshot/photo image uploads
  - Centralized error handling and logging with Morgan
- **AI & Diagnostic Engine:**
  - Modular Vision AI Service supporting OpenAI Vision (`gpt-4o-mini`) via server-side API key.
  - Transparent built-in Knowledge Base Diagnostic Engine fallback when an external API key is not supplied.

---

## 5. Demo Credentials & Quick Switcher

Use the **Demo Switcher** in the top navigation bar to test any role with a single click:

| Persona | Role | Email / Roll No | Password | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Prof. Rajesh Sharma** | Admin | `admin@campus.edu` | `Admin@123` | Head IT Admin |
| **Suresh Patil** | Technician | `tech@campus.edu` | `Tech@123` | Hardware & Net Tech |
| **Aarav Mehta** | Student | `CS-2022-042` | `Student@123` | Assigned to Lab 2 (Outage Demo) |
| **Priya Nair** | Student | `CS-2022-018` | `Student@123` | Assigned to Lab 1 |

---

## 6. How to Run the Project

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Start the Backend API Server
```bash
cd server
npm install
npm run seed     # Seeds demo users, labs 1-6, outages, tickets, and knowledge base
npm start        # Runs on http://localhost:5000 (Base API: http://localhost:5000/api/v1)
```

### 2. Start the Frontend Application
```bash
cd client
npm install
npm run dev      # Runs on http://127.0.0.1:5173
```

---

## 7. Key REST API Endpoints (`/api/v1`)

- `POST /api/v1/auth/login` - Authenticate student or staff member
- `POST /api/v1/tickets/analyze` - **Fast check-first diagnostic sequence** (Outage Check -> Vision AI / KB)
- `POST /api/v1/tickets` - Create or escalate support ticket
- `GET /api/v1/tickets` - Filter and retrieve support tickets
- `PATCH /api/v1/tickets/:id/status` - Update ticket status and technician notes
- `GET /api/v1/outages/active` - Retrieve active downtime announcements for banners
- `POST /api/v1/outages` - Publish new outage announcement
- `GET /api/v1/labs` - Get all 6 laboratories with real-time status and ticket counts
- `PATCH /api/v1/labs/:id` - Toggle lab status (`Online`, `Degraded`, `Offline`)
- `GET /api/v1/analytics/dashboard` - Retrieve aggregated metrics and chart telemetry
- `GET /api/v1/kb` - Search pre-indexed diagnostic knowledge base
- `POST /api/v1/system/seed` - Re-seed database with realistic demo records
- `GET /api/v1/system/health` - Inspect database connection and AI provider status
