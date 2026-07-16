@echo off
title Placement Portal Project Structure

echo Creating Placement Portal Folder Structure...

:: Root Folder
mkdir placement-portal
cd placement-portal

:: ==========================
:: Backend
:: ==========================
mkdir backend
cd backend

mkdir app
mkdir routers
mkdir models
mkdir schemas
mkdir database
mkdir auth
mkdir utils

type nul > main.py

cd routers
type nul > auth.py
type nul > students.py
type nul > companies.py
type nul > jobs.py
type nul > applications.py
type nul > admin.py

cd ..

cd ..

:: ==========================
:: Frontend
:: ==========================
mkdir frontend
cd frontend

mkdir src

cd src
mkdir components
mkdir pages
mkdir layouts
mkdir services
mkdir hooks
mkdir context

type nul > App.jsx

cd ..
cd ..

:: ==========================
:: README
:: ==========================
type nul > README.md

echo.
echo ============================================
echo   Placement Portal Structure Created!
echo ============================================
echo.
pause