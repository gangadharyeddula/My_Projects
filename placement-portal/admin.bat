@echo off
title Create Admin Module Structure - Placement Portal

cd /d D:\Projects\placement-portal

echo Creating ADMIN module structure...
echo.

REM BACKEND
if not exist backend\routers mkdir backend\routers
if not exist backend\schemas mkdir backend\schemas

type nul > backend\routers\admin.py
type nul > backend\schemas\admin_schema.py

REM FRONTEND
if not exist frontend\src\pages\admin mkdir frontend\src\pages\admin
if not exist frontend\src\layouts mkdir frontend\src\layouts
if not exist frontend\src\components mkdir frontend\src\components

type nul > frontend\src\pages\admin\AdminDashboard.jsx
type nul > frontend\src\pages\admin\AdminStudents.jsx
type nul > frontend\src\pages\admin\AdminCompanies.jsx
type nul > frontend\src\pages\admin\AdminJobs.jsx
type nul > frontend\src\pages\admin\AdminApplications.jsx

type nul > frontend\src\layouts\AdminLayout.jsx
type nul > frontend\src\components\AdminSidebar.jsx
type nul > frontend\src\components\AdminRoute.jsx

echo Admin structure created successfully.
pause