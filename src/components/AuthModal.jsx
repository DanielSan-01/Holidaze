import { useState, useEffect } from 'react';
import { useLogin } from '../hooks/auth/useLogin.jsx';
import { useRegister } from '../hooks/auth/useRegister.jsx';
import { useNavigate } from 'react-router-dom';

const EMAIL_REGEX = /^[^@\s]+@stud\.noroff\.no$/i;

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const AuthForm = ({ onClose, mode = 'login' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar: '',
    banner: '',
    venueManager: false
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { loginUser, isLoading: isLoggingIn } = useLogin();
  const { registerUser, isSubmitting } = useRegister();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (mode === 'register') {
      const trimmedEmail = formData.email.trim();
      if (!EMAIL_REGEX.test(trimmedEmail)) {
        errors.email = 'Must be a valid stud.noroff.no email';
      }
      if (!formData.name.match(/^[a-zA-Z0-9_ ]+$/)) {
        errors.name = 'Only letters, numbers, underscores, and spaces allowed';
      }
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!formData.password || formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const errors = validate();
    if (errors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: errors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      if (mode === 'login') {
        await loginUser(formData.email.trim(), formData.password, () => {
          onClose();
          navigate('/');
        });
      } else {
        const avatar = formData.avatar ? { url: formData.avatar, alt: `${formData.name}'s avatar` } : undefined;
        const banner = formData.banner ? { url: formData.banner, alt: `${formData.name}'s banner` } : undefined;
        await registerUser(
          formData.email.trim(),
          formData.password,
          formData.name,
          formData.bio,
          avatar,
          banner,
          formData.venueManager
        );
        onClose();
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      console.error('Registration/Login error:', err);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldErrors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Login' : 'Register'}
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={inputClass('name')}
            />
            {fieldErrors.name && <div className="text-red-500 text-xs mt-1">{fieldErrors.name}</div>}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={inputClass('email')}
          />
          {fieldErrors.email && <div className="text-red-500 text-xs mt-1">{fieldErrors.email}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            minLength={8}
            className={inputClass('password')}
          />
          {fieldErrors.password && <div className="text-red-500 text-xs mt-1">{fieldErrors.password}</div>}
        </div>
        {mode === 'register' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio (optional)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
                maxLength={160}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL (optional)
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner URL (optional)
              </label>
              <input
                type="url"
                name="banner"
                value={formData.banner}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="venueManager"
                checked={formData.venueManager}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Register as venue manager
              </label>
            </div>
          </>
        )}
        <button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoggingIn || isSubmitting}
        >
          {(isLoggingIn || isSubmitting)
            ? (mode === 'login' ? 'Signing In...' : 'Registering...')
            : (mode === 'login' ? 'Sign In' : 'Register')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => onClose(mode === 'login' ? 'register' : 'login')}
          className="text-blue-600 hover:text-blue-500"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
};

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleClose = (newMode) => {
    if (newMode) {
      setMode(newMode);
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => handleClose()}>
      <AuthForm onClose={handleClose} mode={mode} />
    </Modal>
  );
} 