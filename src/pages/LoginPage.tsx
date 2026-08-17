import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { EyeIcon, EyeOffIcon, PhoneIcon } from '@/icons';
import { GoogleIcon, FacebookIcon, YahooIcon, LinkedInIcon, InstagramIcon, TikTokIcon } from '@/icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: authLogin } = useAuth();

  const validateForm = () => {
    let valid = true;
    const newErrors: { phone?: string; password?: string } = {};

    // Validate phone number format
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s|\(|\)|-|_/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
      valid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the actual backend login API
      const response = await api.post('/auth/login', {
        email: phone, // Backend expects email field
        password: password
      });
      
      if (response.data && response.data.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('fingermobile_token', response.data.token);
        localStorage.setItem('token', response.data.token);
        
        // Update AuthContext with user data
        if (response.data.user) {
          await authLogin(response.data.user.email || phone, password);
          
          // Check if user must change password
          if (response.data.user.mustChangePassword) {
            toast({
              title: "Password Change Required",
              description: "Please change your password to continue using the platform.",
              variant: "default"
            });
            
            // Redirect to change password page
            navigate('/change-password');
            setIsLoading(false);
            return;
          }
        }
        
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully.",
          variant: "default"
        });
        
        // Navigate to forum page (main landing after login)
        navigate('/forum');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          'Please check your credentials and try again.';
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerification = () => {
    // TODO: Implement phone verification
    toast({
      title: "Phone Verification",
      description: "Phone verification requested."
    });
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login functionality
    toast({
      title: `Logging in with ${provider}`,
      description: `Redirecting to ${provider} authentication...`
    });
    console.info(`Initiating login with ${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your phone number and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (234) 567-8900"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? 'border-red-500' : ''}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => handleSocialLogin('Google')}
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              Google
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => handleSocialLogin('Facebook')}
            >
              <FacebookIcon className="w-5 h-5 mr-2" />
              Facebook
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => handleSocialLogin('Yahoo')}
            >
              <YahooIcon className="w-5 h-5 mr-2" />
              Yahoo
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => handleSocialLogin('LinkedIn')}
            >
              <LinkedInIcon className="w-5 h-5 mr-2" />
              LinkedIn
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => handleSocialLogin('Instagram')}
            >
              <InstagramIcon className="w-5 h-5 mr-2" />
              Instagram
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => handleSocialLogin('TikTok')}
            >
              <TikTokIcon className="w-5 h-5 mr-2" />
              TikTok
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            variant="ghost" 
            className="w-full mb-2"
            onClick={handlePhoneVerification}
          >
            Verify with Phone
          </Button>
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">
            <Link to="/forgot-password" className="font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;