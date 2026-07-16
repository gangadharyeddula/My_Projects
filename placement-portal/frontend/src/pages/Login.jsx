import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/college-logo.png";
import { toast } from "react-toastify";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/auth/login", formData);
      const token = response.data.access_token || response.data.token;

      if (!token) {
        setError("Token not received from backend");
        return;
      }

      const userResponse = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = userResponse.data.user || userResponse.data;

      if (!userData || !userData.role) {
        setError("User details not received properly");
        return;
      }

      login(token, userData);
      toast.success("Login Successful");

      if (userData.role === "student") {
        navigate("/student/dashboard");
      } else if (userData.role === "company") {
        navigate("/company/dashboard");
      } else if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid user role");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error("Invalid Email or Password");
      setError(err.response?.data?.detail || err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 text-white shadow-2xl shadow-slate-950/20">
          <img
            src={logo}
            alt="College Logo"
            className="h-20 w-20 rounded-full bg-white/10 p-3 ring-1 ring-white/10"
          />
          <div className="mt-10 space-y-5">
            <h1 className="text-3xl font-semibold">Newton’s Institute of Engineering</h1>
            <p className="max-w-xl text-base leading-7 text-slate-300">
              Welcome to the placement portal for students, companies, and admin.
              Sign in to manage applications, jobs, and campus placements with ease.
            </p>
          </div>
        </section>

        <Card className="p-8">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Login</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Sign in to your account</h2>
          </div>

          {error && (
            <div className="mb-4 rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-slate-900 hover:text-slate-700">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
