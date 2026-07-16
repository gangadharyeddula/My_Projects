import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import logo from "../assets/college-logo.png";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await API.post("/auth/register", formData);
      setSuccess(response.data.message || "Registered successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || "Registration failed");
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
              Create your student or company account to access placement services.
              Join the placement portal for job listings, applications, and admin controls.
            </p>
          </div>
        </section>

        <Card className="p-8">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Create account</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Register for the portal</h2>
          </div>

          {error && (
            <div className="mb-4 rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
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
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-semibold">Account type</span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              >
                <option value="student">Student</option>
                <option value="company">Company</option>
              </select>
            </label>

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;
