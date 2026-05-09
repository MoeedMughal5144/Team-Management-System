# 🚀 NexaStudio — Dynamic About Page

A full-stack dynamic About Page with Team Management System built with Node.js, Express, and vanilla JavaScript.

## ✨ Features

### Public About Page (`/`)
- **Hero section** with animated entrance, company tagline & stats
- **About section** — dynamically loaded company info, mission/vision, services
- **Team Members** — card grid with hover overlays, social links, department badges
- **Search** — real-time name/bio search
- **Filter** — by department (All / Developer / Designer / Management)
- **Modal popup** — full profile on card click
- **Dark/Light mode** toggle with localStorage persistence
- **Scroll reveal animations**
- **Fully responsive** (mobile / tablet / desktop)

### Admin Panel (`/admin`)
- **Dashboard stats** — total members by department
- **Team table** — sortable, searchable member list
- **Add member** — slide-in drawer form
- **Edit member** — pre-filled drawer form
- **Delete member** — confirmation dialog
- **Company editor** — edit all company info (name, tagline, mission, vision, description, services)

## 📁 Project Structure

```
about-page/
├── server.js              # Express server + all API routes
├── package.json
├── data/
│   └── db.json            # JSON "database" (team + company)
└── public/
    ├── index.html         # Public About Page
    ├── admin.html         # Admin Panel
    ├── css/
    │   ├── style.css      # Public page styles
    │   └── admin.css      # Admin panel styles
    └── js/
        ├── main.js        # Public page logic
        └── admin.js       # Admin panel CRUD logic
```

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Front-End  | HTML5, CSS3, Vanilla JavaScript     |
| Back-End   | Node.js, Express.js                 |
| Database   | JSON file (`data/db.json`)          |
| Icons      | Font Awesome 6                      |
| Fonts      | Syne (display), DM Sans (body)      |
| Avatars    | DiceBear API (for default avatars)  |

## 🚀 Setup & Run

### Prerequisites
- Node.js v16+ installed

### Steps

```bash
# 1. Enter project folder
cd about-page

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# Development mode (auto-restart)
npm run dev
```

### Open in Browser
- **About Page:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

## 🔌 API Endpoints

### Company
| Method | Endpoint       | Description          |
|--------|---------------|----------------------|
| GET    | /api/company  | Get company info     |
| PUT    | /api/company  | Update company info  |

### Team Members
| Method | Endpoint         | Description         |
|--------|-----------------|---------------------|
| GET    | /api/team        | Get all members     |
| GET    | /api/team?search=&department= | Search/filter |
| GET    | /api/team/:id    | Get single member   |
| POST   | /api/team        | Add new member      |
| PUT    | /api/team/:id    | Edit member         |
| DELETE | /api/team/:id    | Delete member       |

## 🎨 Design Highlights

- **Typography:** Syne (geometric display) + DM Sans (clean body)
- **Color scheme:** Dark-first with indigo accent (`#6366f1`) + violet gradient
- **Dark/Light mode:** System-aware with manual toggle
- **Grid layout:** CSS Grid + auto-fill columns (responsive by default)
- **Hover states:** Card lift, image scale, social icon reveal overlay
- **Animations:** CSS keyframes for entrance + IntersectionObserver for scroll reveal

## 📦 Data Format (db.json)

```json
{
  "company": {
    "name": "...",
    "tagline": "...",
    "mission": "...",
    "vision": "...",
    "description": "...",
    "services": ["Web Development", "Design", ...]
  },
  "team": [
    {
      "id": "uuid",
      "name": "...",
      "role": "...",
      "department": "Developer | Designer | Management",
      "bio": "...",
      "image": "URL",
      "social": {
        "linkedin": "URL",
        "github": "URL",
        "twitter": "URL"
      }
    }
  ]
}
```

## 📋 Bonus Features Implemented

- ✅ Modal popup with full profile details
- ✅ CSS scroll-reveal animations
- ✅ Dark/Light mode toggle
- ✅ Lazy loading for images (`loading="lazy"`)
- ✅ Image error fallback (DiceBear avatar)
- ✅ Admin stats dashboard

---

Made with ❤️ — NexaStudio 2025
