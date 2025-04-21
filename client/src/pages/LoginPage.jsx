import axios from 'axios';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Uncomment if you want to redirect after login

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  // const navigate = useNavigate(); // Optional: for redirecting

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      console.log('Login Response:', res.data);

      if (res.status === 200) {
        alert('✅ Login successful!');
        setForm({ email: '', password: '' });

        // Optional: navigate to dashboard or home
        // navigate('/dashboard');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input
          name="email"
          value={form.email}
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          value={form.password}
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-sm text-center">
          Don’t have an account?{' '}
          <a className="text-blue-500 hover:underline" href="/signup">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
