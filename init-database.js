const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if products already exist
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('Error checking products:', err);
      return;
    }

    if (row.count > 0) {
      console.log('Database already initialized with', row.count, 'products');
      db.close();
      return;
    }

    // Insert 20 pre-populated learning course products
    const products = [
      {
        name: 'Web Development Mastery',
        category: 'Programming',
        description: 'Complete guide to modern web development with HTML, CSS, JavaScript, and React',
        price: 79.99,
        quantity: 50,
        image: '🌐'
      },
      {
        name: 'Python Programming Pro',
        category: 'Programming',
        description: 'From basics to advanced Python development, data science, and automation',
        price: 69.99,
        quantity: 45,
        image: '🐍'
      },
      {
        name: 'Digital Marketing Excellence',
        category: 'Marketing',
        description: 'Master SEO, social media marketing, and content strategy',
        price: 59.99,
        quantity: 35,
        image: '📱'
      },
      {
        name: 'Graphic Design Fundamentals',
        category: 'Design',
        description: 'Learn Adobe Creative Suite, design principles, and visual communication',
        price: 64.99,
        quantity: 40,
        image: '🎨'
      },
      {
        name: 'Data Science & Analytics',
        category: 'Data Science',
        description: 'Statistical analysis, machine learning, and data visualization',
        price: 89.99,
        quantity: 30,
        image: '📊'
      },
      {
        name: 'Mobile App Development',
        category: 'Programming',
        description: 'Build iOS and Android apps with React Native and Flutter',
        price: 84.99,
        quantity: 38,
        image: '📱'
      },
      {
        name: 'UX/UI Design Complete',
        category: 'Design',
        description: 'User experience design, wireframing, prototyping, and user testing',
        price: 74.99,
        quantity: 42,
        image: '✨'
      },
      {
        name: 'Cloud Computing AWS',
        category: 'Cloud',
        description: 'Amazon Web Services certification preparation and practical skills',
        price: 94.99,
        quantity: 25,
        image: '☁️'
      },
      {
        name: 'Photography Masterclass',
        category: 'Creative',
        description: 'Professional photography techniques, editing, and portfolio building',
        price: 54.99,
        quantity: 48,
        image: '📸'
      },
      {
        name: 'Business Leadership',
        category: 'Business',
        description: 'Management skills, team building, and strategic thinking',
        price: 69.99,
        quantity: 32,
        image: '💼'
      },
      {
        name: 'Cybersecurity Essentials',
        category: 'Security',
        description: 'Network security, ethical hacking, and information protection',
        price: 79.99,
        quantity: 28,
        image: '🔒'
      },
      {
        name: 'Video Editing Pro',
        category: 'Creative',
        description: 'Professional video editing with Premiere Pro and After Effects',
        price: 64.99,
        quantity: 36,
        image: '🎬'
      },
      {
        name: 'AI & Machine Learning',
        category: 'AI',
        description: 'Deep learning, neural networks, and AI applications',
        price: 99.99,
        quantity: 22,
        image: '🤖'
      },
      {
        name: 'Content Writing Mastery',
        category: 'Writing',
        description: 'Copywriting, blogging, and professional content creation',
        price: 49.99,
        quantity: 55,
        image: '✍️'
      },
      {
        name: 'Game Development Unity',
        category: 'Programming',
        description: '2D and 3D game creation with Unity engine',
        price: 84.99,
        quantity: 34,
        image: '🎮'
      },
      {
        name: 'Financial Analysis',
        category: 'Finance',
        description: 'Financial modeling, investment analysis, and Excel mastery',
        price: 74.99,
        quantity: 29,
        image: '💰'
      },
      {
        name: 'Public Speaking Confidence',
        category: 'Communication',
        description: 'Presentation skills, storytelling, and confident communication',
        price: 44.99,
        quantity: 46,
        image: '🎤'
      },
      {
        name: 'Project Management PMP',
        category: 'Business',
        description: 'PMP certification prep and project management methodologies',
        price: 79.99,
        quantity: 31,
        image: '📋'
      },
      {
        name: 'Music Production',
        category: 'Creative',
        description: 'Audio engineering, mixing, and music creation with Ableton',
        price: 69.99,
        quantity: 37,
        image: '🎵'
      },
      {
        name: 'Blockchain Development',
        category: 'Programming',
        description: 'Smart contracts, DApps, and blockchain technology',
        price: 94.99,
        quantity: 24,
        image: '⛓️'
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO products (name, category, description, price, quantity, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    products.forEach(product => {
      stmt.run(
        product.name,
        product.category,
        product.description,
        product.price,
        product.quantity,
        product.image
      );
    });

    stmt.finalize((err) => {
      if (err) {
        console.error('Error inserting products:', err);
      } else {
        console.log('Successfully initialized database with 20 products!');
      }
      db.close();
    });
  });
});
