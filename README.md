# The Aurelius — Hotel Digital Menu

# 🍽️ Restaurant Table Booking System

A web-based **Restaurant Table Booking System** that allows customers to check available tables and make restaurant reservations online.

The system helps restaurants manage table availability, customer bookings, reservation details, and booking status through an easy-to-use interface.

## 🚀 Features

* 🍽️ View Available Tables
* 📅 Online Table Booking
* ⏰ Select Date and Time
* 👥 Select Number of Guests
* 👤 Customer Details
* ✅ Booking Confirmation
* 📋 Manage Reservations
* 🪑 Table Availability Management
* 🔐 Admin Login
* 📊 Booking Management Dashboard
* 📱 Responsive Design

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript
* Bootstrap
* PHP
* MySQL

> Update the technology list if your actual project uses different technologies.

## 📁 Project Structure

```text id="r4x1c7"
restaurant-table-booking-system/
│
├── index.php
├── booking.php
├── tables.php
├── confirmation.php
├── login.php
│
├── admin/
│   ├── dashboard.php
│   ├── bookings.php
│   ├── tables.php
│   └── customers.php
│
├── config/
│   └── database.php
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── images/
│
├── database/
│   └── restaurant_booking.sql
│
└── README.md
```

> The actual project structure may vary depending on your implementation.

## ⚙️ Installation

### 1. Clone the Repository

```bash id="w0x2ks"
git clone YOUR_GITHUB_REPOSITORY_URL
```

Or download the repository as a ZIP file and extract it.

### 2. Install XAMPP

Install and open **XAMPP**.

Start:

* Apache
* MySQL

### 3. Move the Project

Copy the project folder into:

```text id="x8w9qv"
C:\xampp\htdocs\
```

For example:

```text id="v6e2w1"
C:\xampp\htdocs\restaurant-table-booking-system\
```

### 4. Create the Database

Open:

```text id="f1h7px"
http://localhost/phpmyadmin/
```

Create a database, for example:

```text id="9s6n3e"
restaurant_booking
```

Import the SQL file:

```text id="z2b8km"
database/restaurant_booking.sql
```

### 5. Configure Database Connection

Update the database configuration file:

```php id="7n2k5p"
$host = "localhost";
$username = "root";
$password = "";
$database = "restaurant_booking";
```

### 6. Run the Website

Open your browser and visit:

```text id="u3c9qd"
http://localhost/restaurant-table-booking-system/
```

## 🔄 Booking Workflow

```text id="p8f4ma"
Customer
   ↓
Select Date
   ↓
Select Time
   ↓
Select Number of Guests
   ↓
Check Available Tables
   ↓
Enter Customer Details
   ↓
Confirm Booking
   ↓
Booking Saved
   ↓
Confirmation
```

## 🪑 Table Management

The system can manage restaurant tables based on:

* Table number
* Table capacity
* Table location
* Availability
* Booking status

Example:

```text id="q7k3pd"
Table 01 → 2 Guests → Available
Table 02 → 4 Guests → Booked
Table 03 → 6 Guests → Available
Table 04 → 4 Guests → Reserved
```

## 👤 Customer Module

Customers can:

* View restaurant information
* Check table availability
* Select booking date
* Select time
* Select number of guests
* Enter name and contact details
* Confirm a reservation
* View booking confirmation

## 🔐 Admin Module

The admin dashboard allows restaurant staff to:

* Login to the system
* View all bookings
* Add or manage tables
* Check table availability
* View customer details
* Update booking status
* Cancel bookings
* Manage reservations

## 📊 Booking Status

Bookings can have different statuses:

* 🟢 Confirmed
* 🟡 Pending
* 🔴 Cancelled
* 🔵 Completed

## 💾 Database

The system uses **MySQL** to store restaurant and booking information.

Example tables:

```text id="m5r8cz"
users
├── id
├── name
├── email
└── password

tables
├── id
├── table_number
├── capacity
└── status

bookings
├── id
├── customer_name
├── phone
├── table_id
├── booking_date
├── booking_time
├── guests
└── status
```

## 📱 Responsive Design

The website is designed to work on:

* 💻 Desktop
* 📱 Mobile
* 📲 Tablet

## 🔒 Security

The system should implement:

* Admin authentication
* Form validation
* Secure database queries
* Session management
* Input sanitization
* Proper password protection

## 🔮 Future Improvements

Possible future features include:

* 💳 Online Payment
* 📧 Email Booking Confirmation
* 📱 SMS Notifications
* 📲 WhatsApp Booking Notifications
* 🪑 Interactive Restaurant Floor Plan
* 🔔 Automatic Booking Reminders
* 📊 Revenue & Booking Analytics
* 👨‍🍳 Kitchen Management
* ⭐ Customer Reviews & Ratings
* 📱 Mobile Application

