# PetCare Connect

PetCare Connect is a full-stack MERN application that connects pet owners with reliable and verified pet caregivers. It provides a seamless experience for managing pet profiles, booking services, leaving reviews, and managing profiles. 

The application is built with a role-based architecture supporting three distinct user types: **Admin**, **Pet Owner**, and **Caregiver**.

---

## 🚀 Features

### For Pet Owners
- **Pet Management**: Add, edit, and manage profiles for multiple pets including photos and medical notes.
- **Search & Filter**: Search for caregivers based on location, availability, and specific services (e.g., Dog Walking, Pet Sitting).
- **Booking System**: Request services from caregivers, view booking history, and manage active requests.
- **Reviews**: Leave ratings and feedback for caregivers after completed jobs.

### For Caregivers
- **Professional Profiles**: Set up a detailed profile with bio, experience, services offered, pricing, and availability.
- **Job Management**: Accept or reject incoming booking requests and mark active jobs as completed.
- **Dashboard**: Track upcoming jobs, profile views, and manage schedule effectively.
- **Feedback Loop**: View reviews and average ratings from previous clients.

### For Administrators
- **Dashboard Overview**: Monitor platform metrics including total users, active bookings, and pending caregiver verifications.
- **User Management**: View and manage all users across the platform.
- **Verification System**: Approve or reject caregiver applications to ensure platform safety and quality.
- **Content Moderation**: Moderate reviews and oversee platform activity.

### Universal Features
- **Real-time Notifications**: In-app notifications for booking status changes and messages.
- **Responsive Design**: Fully mobile-optimized UI built with Tailwind CSS.
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing.

---

## 🛠️ Technologies Used

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast (Notifications)
- Lucide React (Icons)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer (File Uploads)

---

## 📁 Project Structure

```text
PetCare-Project/
├── backend/                  # Express server
│   ├── config/               # Database configuration
│   ├── controllers/          # Request handlers & business logic
│   ├── middleware/           # Auth, role checking, file upload
│   ├── models/               # Mongoose schemas (User, Pet, Booking, etc.)
│   ├── routes/               # API route definitions
│   ├── uploads/              # Local storage for user/pet images
│   └── server.js             # Entry point
│
└── frontend/                 # React application
    ├── src/
    │   ├── components/       # Reusable UI components (Cards, Modals, Forms)
    │   ├── hooks/            # Custom React hooks (useAuth)
    │   ├── layouts/          # Role-specific wrappers (AdminLayout, etc.)
    │   ├── pages/            # Page components grouped by role
    │   ├── routes/           # Protected route logic
    │   ├── services/         # Axios API call wrappers
    │   ├── App.jsx           # Main routing component
    │   └── index.css         # Global Tailwind styles
    └── package.json
```

---


## 📸 Screenshots

> *Replace these placeholders with actual screenshots of your application.*

| Owner Dashboard | Caregiver Search |
| :---: | :---: |
| `![Owner Dashboard](placeholder)` | `![Caregiver Search](placeholder)` |

| Caregiver Profile | Admin Dashboard |
| :---: | :---: |
| `![Caregiver Profile](placeholder)` | `![Admin Dashboard](placeholder)` |

---

## 🔌 API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register a new user (owner/caregiver)
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/profile` - Get authenticated user profile

### Owner Routes
- `GET /api/owner/profile` - Get owner profile
- `PUT /api/owner/profile` - Update owner profile
- `POST /api/owner/profile/image` - Upload owner avatar

### Caregiver Routes
- `GET /api/caregiver/search` - Search verified caregivers (Owner access)
- `GET /api/caregiver/profile` - Get caregiver profile
- `PUT /api/caregiver/profile` - Update caregiver details
- `POST /api/caregiver/profile/photo` - Upload caregiver photo

### Pet Routes
- `GET /api/pets` - Get all pets for logged-in owner
- `POST /api/pets` - Add a new pet
- `PUT /api/pets/:id` - Update pet details
- `DELETE /api/pets/:id` - Delete a pet

### Booking Routes
- `POST /api/bookings` - Create a booking request
- `GET /api/bookings/owner` - Get owner's bookings
- `GET /api/bookings/caregiver` - Get caregiver's bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Review & Notification Routes
- `POST /api/reviews` - Submit a review for a caregiver
- `GET /api/reviews/caregiver/:id` - Get reviews for specific caregiver
- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### Admin Routes
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/caregivers/:id/verify` - Approve/Reject caregiver

---

*This project was developed as a college MERN stack mini-project.*
