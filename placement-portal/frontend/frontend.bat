@echo off
echo Creating frontend folder structure...

:: Create folders
mkdir src
mkdir src\api
mkdir src\components
mkdir src\context
mkdir src\layouts
mkdir src\pages
mkdir src\pages\student
mkdir src\pages\company

:: Create files in api
type nul > src\api\axios.js

:: Create files in components
type nul > src\components\Navbar.jsx
type nul > src\components\ProtectedRoute.jsx

:: Create files in context
type nul > src\context\AuthContext.jsx

:: Create files in layouts
type nul > src\layouts\StudentLayout.jsx
type nul > src\layouts\CompanyLayout.jsx

:: Create files in pages
type nul > src\pages\Login.jsx
type nul > src\pages\Register.jsx

:: Create student pages
type nul > src\pages\student\StudentDashboard.jsx
type nul > src\pages\student\StudentProfile.jsx
type nul > src\pages\student\StudentJobs.jsx
type nul > src\pages\student\MyApplications.jsx

:: Create company pages
type nul > src\pages\company\CompanyDashboard.jsx
type nul > src\pages\company\CompanyProfile.jsx
type nul > src\pages\company\PostJob.jsx
type nul > src\pages\company\ManageJobs.jsx
type nul > src\pages\company\Applicants.jsx

:: Create root files
type nul > src\App.jsx
type nul > src\main.jsx
type nul > src\index.css

echo.
echo Frontend structure created successfully!
pause