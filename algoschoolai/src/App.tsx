import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { TeacherLayout } from './layouts/TeacherLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { TeacherDashboard } from './pages/dashboard/TeacherDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import Users from './pages/dashboard/Users';
import Classes from './pages/Classes';
import Modules from './pages/Modules';
import Materials from './pages/Materials';
import Assignments from './pages/dashboard/Assignments';
import Reports from './pages/dashboard/Reports';
import StudentClasses from './pages/dashboard/StudentClasses';
import Settings from './pages/dashboard/Settings';
import Profile from './pages/dashboard/Profile';

// Layout wrapper component
const DashboardLayoutWrapper: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  const LayoutComponent = {
    student: StudentLayout,
    teacher: TeacherLayout,
    admin: AdminLayout
  }[user.role];

  return <LayoutComponent />;
};

// Dashboard router component
const DashboardRouter: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  const DashboardComponent = {
    student: StudentDashboard,
    teacher: TeacherDashboard,
    admin: AdminDashboard
  }[user.role];

  return <DashboardComponent />;
};

const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayoutWrapper />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardRouter />} />
            {/* Aquí se pueden agregar más subrutas específicas */}
            <Route 
              path="profile" 
              element={
                <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="settings" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas específicas por rol */}
            <Route 
              path="modules" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <Modules />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="classes" 
              element={
                <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                  <Classes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="assignments" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Assignments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="students" 
              element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <div className="p-6">Gestión de Estudiantes (Próximamente)</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="materials" 
              element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <Materials />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="create-class" 
              element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <div className="p-6">Crear Nueva Clase (Próximamente)</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="reports" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="studentclasses" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <StudentClasses />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Página de no autorizado */}
          <Route 
            path="/unauthorized" 
            element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                  <p className="text-gray-600 mb-8">No tienes permisos para acceder a esta página</p>
                  <button 
                    onClick={() => window.history.back()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Volver
                  </button>
                </div>
              </div>
            } 
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;