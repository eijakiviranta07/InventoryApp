# SkillForge - Inventory Management System

🚀 A modern web application for managing inventory of learning courses and educational products.

## ✨ Features

- **Browse Products**: View all learning courses in a beautiful, modern interface
- **Add New Courses**: Easily add new products to your inventory
- **Update Quantities**: Quick stock management with inline editing
- **Delete Products**: Remove courses from inventory with confirmation
- **Search & Filter**: Find products quickly by name, description, or category
- **Real-time Statistics**: Dashboard showing total courses, stock levels, and categories
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Built with brand colors (#FF9900) for an attractive, youth-focused design

## 🎨 Brand Identity

**Store Name**: SkillForge - Master Your Future, One Skill at a Time

**Target Audience**: Young people looking to improve their skills and advance their careers

**Color Scheme**:
- Primary: #FF9900 (Orange)
- Secondary: Black and Grey tones
- Clean, modern aesthetic designed for the younger generation

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Database**: SQLite (local file-based database)
- **No build tools required** - runs directly with Node.js

## 📦 Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/eijakiviranta07/InventoryApp.git
   cd InventoryApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize the database** (creates database with 20 pre-populated products):
   ```bash
   npm run init-db
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### Managing Products

1. **View Products**: All courses are displayed on the main page with their details
2. **Add New Course**: Click the "Add New Course" button and fill in the form
3. **Edit Course**: Click the "Edit" button on any product card
4. **Update Stock**: Change the quantity directly in the product card
5. **Delete Course**: Click the "Delete" button and confirm the action
6. **Search**: Use the search bar to find specific courses
7. **Filter by Category**: Use the dropdown to filter by course category

### Pre-populated Products

The database comes with 20 learning courses in categories including:
- Programming (Web Development, Python, Mobile Apps, etc.)
- Design (Graphic Design, UX/UI)
- Marketing
- Data Science & AI
- Business & Finance
- Creative Skills (Photography, Video Editing, Music)
- And more!

## 📁 Project Structure

```
InventoryApp/
├── public/              # Frontend files
│   ├── index.html      # Main HTML page
│   ├── styles.css      # Styling with brand colors
│   └── app.js          # Frontend JavaScript logic
├── server.js           # Express server and API endpoints
├── init-database.js    # Database initialization script
├── package.json        # Project dependencies
├── inventory.db        # SQLite database (created after init)
└── README.md          # This file
```

## 🔌 API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `PUT /api/products/:id/quantity` - Update product quantity
- `DELETE /api/products/:id` - Delete product

## 🤝 Contributing

Feel free to fork this repository and submit pull requests for any improvements.

## 📝 License

ISC

## 💡 Future Enhancements

- User authentication and authorization
- Product images upload
- Sales tracking
- Export data to CSV/Excel
- Multi-language support
- Dark mode

---

Built with ❤️ for aspiring learners everywhere 
