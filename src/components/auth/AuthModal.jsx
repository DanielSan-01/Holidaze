import { useState, useEffect } from 'react';
import { useLogin } from '../../hooks/auth';
import { useRegister } from '../../hooks/auth';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const { register, isSubmitting } = useRegister();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccessfulAuth = () => {
    onClose();
    
    // If user is on a 404 page, redirect to homepage
    // Otherwise, let them stay on their current page
    if (location.pathname === '/404' || location.pathname.includes('404')) {
      navigate('/');
    }
    // If they're on the homepage already, no need to navigate
    // For other pages, let them stay where they are
  };

  // Sanitize name for API compliance (remove spaces, keep letters, numbers, underscores)
  const sanitizeName = (name) => {
    return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  };

  const validate = () => {
    const errors = {};
    if (mode === 'register') {
      const trimmedEmail = formData.email.trim();
      if (!EMAIL_REGEX.test(trimmedEmail)) {
        errors.email = 'Must be a valid stud.noroff.no email';
      }
      // Allow letters, numbers, spaces, and underscores for user input
      if (!formData.name.match(/^[a-zA-Z0-9_ ]+$/)) {
        errors.name = 'Only letters, numbers, spaces, and underscores allowed';
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
        await loginUser(formData.email.trim(), formData.password, handleSuccessfulAuth);
      } else {
        const sanitizedName = sanitizeName(formData.name);
        const avatar = formData.avatar ? { url: formData.avatar, alt: `${formData.name}'s avatar` } : undefined;
        const banner = formData.banner ? { url: formData.banner, alt: `${formData.name}'s banner` } : undefined;
        await register(
          formData.email.trim(),
          formData.password,
          sanitizedName,
          formData.bio,
          avatar,
          banner,
          formData.venueManager
        );
        handleSuccessfulAuth();
      }
    } catch (err) {
      console.error('Registration/Login error details:', {
        message: err.message,
        stack: err.stack,
        formData: { ...formData, password: '[HIDDEN]' }
      });
      
      // Make error message more prominent and detailed
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      
      // Also show an alert for immediate visibility
      alert(`Registration Error: ${errorMessage}`);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldErrors[field] ? 'border-red-500 focus:ring-red-500' : 'input'}`;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Login' : 'Register'}
      </h2>
      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-800 px-4 py-4 rounded-lg mb-4 shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-red-800 mb-1">Registration Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="label">
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
              placeholder="e.g. Jan Banan"
            />
            {formData.name && (
              <div className="text-xs text-gray-500 mt-1">
                Username will be: <span className="font-mono text-blue-600">{sanitizeName(formData.name)}</span>
              </div>
            )}
            {fieldErrors.name && <div className="text-red-500 text-xs mt-1">{fieldErrors.name}</div>}
          </div>
        )}
        <div>
          <label className="label">
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
          <label className="label">
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
              <label className="label">
                Bio (optional)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input"
                maxLength={160}
              />
            </div>
            <div>
              <label className="label">
                Avatar URL (optional)
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">
                Banner URL (optional)
              </label>
              <input
                type="url"
                name="banner"
                value={formData.banner}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="venueManager"
                  checked={formData.venueManager}
                  onChange={handleChange}
                  className="mr-2"
                />
                I am a venue manager
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Check this if you want to manage venues on the platform
              </p>
            </div>
          </>
        )}
        <button
          type="submit"
          disabled={isLoggingIn || isSubmitting}
          className="w-full btn-secondary py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          style={{ '--tw-ring-color': 'var(--focus-ring)' }}
        >
          {isLoggingIn || isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthForm onClose={onClose} mode={mode} />
      <div className="text-center mt-4">
        {mode === 'login' ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setMode('register')}
              className="text-link"
            >
              Register here
            </button>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-link"
            >
              Login here
            </button>
          </p>
        )}
      </div>
    </Modal>
  );
} 