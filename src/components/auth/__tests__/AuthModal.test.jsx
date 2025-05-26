import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AuthModal from '../AuthModal';
import { AuthProvider } from '../../../hooks/auth/AuthContext';

// Mock the hooks
const mockLoginUser = vi.fn();
const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../../hooks/auth', () => ({
  useLogin: vi.fn(() => ({
    loginUser: mockLoginUser,
    isLoading: false
  })),
  useRegister: vi.fn(() => ({
    register: mockRegister,
    isSubmitting: false
  }))
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' })
  };
});

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('AuthModal Integration Tests', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    initialMode: 'login'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Behavior', () => {
    it('renders modal when isOpen is true', () => {
      render(
        <TestWrapper>
          <AuthModal {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    it('does not render modal when isOpen is false', () => {
      render(
        <TestWrapper>
          <AuthModal {...defaultProps} isOpen={false} />
        </TestWrapper>
      );

      expect(screen.queryByRole('heading', { name: 'Login' })).not.toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <TestWrapper>
          <AuthModal {...defaultProps} onClose={onClose} />
        </TestWrapper>
      );

      const closeButton = screen.getByText('✕');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Login Form', () => {
    it('renders login form with all required fields', () => {
      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="login" />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('submits login form with valid data', async () => {
      const user = userEvent.setup();
      mockLoginUser.mockResolvedValue();

      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="login" />
        </TestWrapper>
      );

      // Find inputs by name attribute
      const emailInput = screen.getByRole('textbox');
      const passwordInput = document.querySelector('input[name="password"]');
      
      await user.type(emailInput, 'test@stud.noroff.no');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith(
          'test@stud.noroff.no',
          'password123',
          expect.any(Function)
        );
      });
    });

    it('displays login error message', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Invalid email or password';
      mockLoginUser.mockRejectedValue(new Error(errorMessage));

      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="login" />
        </TestWrapper>
      );

      const emailInput = screen.getByRole('textbox');
      const passwordInput = document.querySelector('input[name="password"]');
      
      await user.type(emailInput, 'test@stud.noroff.no');
      await user.type(passwordInput, 'wrongpassword');

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('Registration Form', () => {
    it('renders registration form with all fields', () => {
      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="register" />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Bio (optional)')).toBeInTheDocument();
      expect(screen.getByText('Avatar URL (optional)')).toBeInTheDocument();
      expect(screen.getByText('Banner URL (optional)')).toBeInTheDocument();
      expect(screen.getByText('I am a venue manager')).toBeInTheDocument();
    });

    it('handles venue manager checkbox', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="register" />
        </TestWrapper>
      );

      const venueManagerCheckbox = screen.getByRole('checkbox');
      expect(venueManagerCheckbox).not.toBeChecked();

      await user.click(venueManagerCheckbox);
      expect(venueManagerCheckbox).toBeChecked();
    });

    it('submits registration form with valid data', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue();

      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="register" />
        </TestWrapper>
      );

      // Find inputs by name attribute
      const nameInput = document.querySelector('input[name="name"]');
      const emailInput = document.querySelector('input[name="email"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const venueManagerCheckbox = screen.getByRole('checkbox');

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@stud.noroff.no');
      await user.type(passwordInput, 'password123');
      await user.click(venueManagerCheckbox);

      const submitButton = screen.getByRole('button', { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          'test@stud.noroff.no',
          'password123',
          'Test User',
          '', // bio
          undefined, // avatar
          undefined, // banner
          true // venueManager
        );
      });
    });
  });

  describe('Mode Switching', () => {
    it('switches from login to register mode', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="login" />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();

      const registerLink = screen.getByText(/register here/i);
      await user.click(registerLink);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
      });
    });

    it('switches from register to login mode', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="register" />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();

      const loginLink = screen.getByText(/login here/i);
      await user.click(loginLink);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
        expect(screen.queryByText('Name')).not.toBeInTheDocument();
      });
    });
  });

  describe('User Experience', () => {
    it('shows proper button text for each mode', () => {
      const { rerender } = render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="login" />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="register" />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('has proper form structure', () => {
      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="login" />
        </TestWrapper>
      );

      // Check for form elements
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      
      // Check for proper labels
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    it('supports basic keyboard interaction', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="login" />
        </TestWrapper>
      );

      const emailInput = screen.getByRole('textbox');
      
      // Focus and type in email field
      await user.click(emailInput);
      await user.type(emailInput, 'test@stud.noroff.no');
      
      expect(emailInput).toHaveValue('test@stud.noroff.no');
    });

    it('renders different content for login vs register', () => {
      const { rerender } = render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="login" />
        </TestWrapper>
      );

      // Login mode should not have name field
      expect(screen.queryByText('Name')).not.toBeInTheDocument();
      expect(screen.queryByText('Bio (optional)')).not.toBeInTheDocument();

      rerender(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="register" />
        </TestWrapper>
      );

      // Register mode should have additional fields
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Bio (optional)')).toBeInTheDocument();
      expect(screen.getByText('Avatar URL (optional)')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      const user = userEvent.setup();
      mockLoginUser.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <AuthModal {...defaultProps} initialMode="login" />
        </TestWrapper>
      );

      const emailInput = screen.getByRole('textbox');
      const passwordInput = document.querySelector('input[name="password"]');
      
      await user.type(emailInput, 'test@stud.noroff.no');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });
}); 