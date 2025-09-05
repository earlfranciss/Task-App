# ✅ Task App  

Task App is a lightweight and user-friendly **task management system** built with **ASP .NET Core (Entity Framework)** and **React.js**.  
It enables users to **create, update, delete, and track tasks**, making productivity and organization easier.  

## ✨ Key Features
- ➕ **Add, edit, delete tasks** with CRUD functionality  
- 📋 **Task list view** with filtering and sorting  
- 📊 **Status tracking** (e.g., pending, in progress, completed)  
- 💾 **Database persistence** with Entity Framework Core  
- ⚡ **Responsive frontend** powered by React.js  

## 🏗️ Tech Stack
- **Frontend:** React.js  
- **Backend:** ASP .NET Core (Entity Framework)  
- **Database:** MS SQL Server  
- **Other Tools:** Git, Figma  

## 🎯 Objective
The Task App was built as a practice project to strengthen **full-stack development skills**, particularly focusing on **React.js frontend integration with ASP .NET Core backend**.  

# A learning project built to practice **full-stack development** using:

- **Backend:** C# ASP.NET + EF Core (SQL Server)
- **Frontend:** React (Vite) + Tailwind CSS v4
- **Database:** SQL Server Express / LocalDB

---

## Repository Structure

```
TaskApp/
  backend/    # ASP.NET API: Program.cs, Controllers/, Data/, Models/
  frontend/   # React app: src/, package.json, vite.config.js
  .gitignore  # Ignores build outputs, node_modules, secrets
  README.md   # Project overview + run instructions
```

---

## How to Run

### Backend (API)

```bash
cd backend
dotnet restore
dotnet run
```

Default URL: **http://localhost:5004**

---

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Default URL: **http://localhost:5173**

---

## Database Migrations (EF Core)

```bash
cd backend
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## Notes

- `.gitignore` keeps build output and local config (like `node_modules/`, `bin/`, `obj/`, and `appsettings.Development.json`) out of Git.  
- Use **Conventional Commits** style:  
  - `feat:` new features  
  - `fix:` bug fixes  
  - `chore:` setup/maintenance  
