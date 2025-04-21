import axios from 'axios';
import { useState } from 'react';

const SignupForm = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/users/signup', form);
      console.log('Signup Response:', res.data);

      if (res.status === 201) {
        alert('✅ Signup successful! your data stored in mongodb database');
        // Clear the form
        setForm({ firstName: '', lastName: '', email: '', password: '' });
      }
    } catch (error) {
      console.error('❌ Signup failed:', error);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <div className="flex gap-4">
          <input
            name="firstName"
            value={form.firstName}
            placeholder="First Name"
            onChange={handleChange}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="lastName"
            value={form.lastName}
            placeholder="Last Name"
            onChange={handleChange}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
          Create Account
        </button>
        <p className="text-sm text-center">
          Already have an account? <a className="text-blue-500 hover:underline" href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
