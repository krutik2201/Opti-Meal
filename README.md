# 🚀 OptiMeal – Smart Queue & Food Optimization System

OptiMeal is a high-performance, production-style campus food management platform. Unlike traditional food apps, it is a **Queue Intelligence System** designed to eliminate physical waiting lines and optimize kitchen throughput through predictive analytics and structured time slots.

---

## 📖 What is OptiMeal about?
In a busy campus environment, students waste 20-30 minutes daily standing in canteen queues. Vendors struggle with chaotic "rush hours," leading to order errors and food waste.

**OptiMeal solves this by:**
* **Virtual Queuing**: Students join a digital queue and arrive only when their food is ready.
* **Predictive Demand**: The system alerts students of "Peak Rush" before they order.
* **Kitchen Balancing**: Vendors receive orders in a managed flow, preventing kitchen burnout.
* **Time Certainty**: Every order comes with a guaranteed "Pickup Window."

---

## 👥 Who is this for? (Roles)
The system is built for a three-tier ecosystem:
1. **Students**: Who want to skip the line and save time.
2. **Vendors (Canteens/Cafes)**: Who need to manage high-volume orders during peak hours without stress.
3. **Campus Admins**: Who need bird's-eye visibility into canteen performance and student satisfaction.

---

## 🛠️ How it is Made (Architecture)
OptiMeal is built using a modern, scalable full-stack architecture:

* **Frontend**: Built with **React.js**. It features a "Kitchen Mode" for vendors (high-contrast, fast-action) and a "Consumer Mode" for students (clean, visual, and simple).
* **Backend**: Powered by **Flask (Python)**, providing a robust REST API for order processing and queue calculations.
* **Analytics**: Integration of **Recharts** for real-time demand visualization in the Admin and Vendor dashboards.
* **Design System**: A custom-built CSS framework focusing on **Glassmorphism** and **High-Accessibility** for high-pressure kitchen environments.
* **Data Flow**: Optimized state management using a sync layer that demonstrates real-time order movement from Student → Vendor → Admin.

---

## 📋 Essential Things Needed (Prerequisites)
Before running the project, ensure you have the following installed:
* **Node.js** (v16 or higher)
* **Python** (v3.8 or higher)
* **npm** or **yarn**
* **Git**

---

## 🚀 How to Run

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/optimeal-smart-queue-system.git
cd optimeal-smart-queue-system
```

### 2️⃣ Setup Backend (Flask)
```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```
*The backend will run on `http://localhost:5000`*

### 3️⃣ Setup Frontend (React)
```bash
cd ../frontend

# Install dependencies
npm install

# Start the application
npm start
```
*The application will open on `http://localhost:3000`*

---

## 📸 System Previews

### 🧑‍🎓 Student Home & Live Queue status
![Student Home](docs/screenshots/student_home.png)

### 👨‍🍳 Vendor Kitchen Mode (One-Click Flow)
![Vendor Dashboard](docs/screenshots/vendor_dashboard.png)

### 🛡️ Admin Control Panel & Analytics
![Admin Dashboard](docs/screenshots/admin_dashboard.png)

---

## 🎯 Future Roadmap
* **AI-Powered Demand Forecast**: Predicting the next hour's load based on campus schedules.
* **IoT Integration**: Smart buzzers/notifications for food pickup.
* **Multi-College SaaS Model**: Scalable architecture to support multiple campuses on one platform.

---

*Developed with the goal of creating "Time-Certainty" in every campus meal.*
