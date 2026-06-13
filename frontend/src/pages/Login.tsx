import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/ui/button';
import { SocialButton } from '../components/SocialButton';
import api from '../lib/axios';

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('access_token', response.data.access_token);

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop overflow-hidden bg-background relative z-0">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-primary opacity-20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-accent opacity-30 blur-[100px] rounded-full"></div>
      </div>

      {/* Login Container */}
      <main className="w-full max-w-[440px] flex flex-col items-center">
        
        {/* Branding */}
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-6 shadow-lg">
            <span className="material-symbols-outlined text-primary-foreground text-[32px]">edit_note</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Cognitive Correspondence</h1>
          <p className="font-body-md text-body-md text-muted-foreground">Elevate your communication with AI insights.</p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-card p-8 md:p-10 rounded-2xl writing-canvas-shadow animate-in fade-in zoom-in-95 duration-1000 delay-150 glass-effect">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <TextInput 
              id="email"
              name="email"
              type="email"
              label="Email Address"
              icon="mail"
              placeholder="name@company.com"
              required
            />
            
            <TextInput 
              id="password"
              name="password"
              label="Password"
              icon="lock"
              placeholder="••••••••"
              isPassword
              required
            />

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                variant={success ? "secondary" : "default"}
                className="w-full h-14 rounded-xl text-base shadow-md gap-2"
              >
                {success ? 'Success' : loading ? 'Signing In...' : 'Sign In'}
                {!success && !loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                {loading && <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>}
              </Button>
            </div>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-8">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-label-sm">
              <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols gap-4">
            <SocialButton 
              label="Google"
              iconSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBXoTG6MqzoVXrGORavzpjew7Sr7i-_j_z9xceKNKqrGyHVW5o0h8-qxvopwT1grXT01qCKFhLdyyZDesEcYN-pRKqy6CKuLgtXxXXHXuJAzIeErLZyjCqqKl9MIX8OYys053Og1fgD80kdALfOv2VOgPJFd0C4YVua3UIbMl2-chw5lGJ0SUHGtbdocH3INecmkcDbbu65cZXkCmgEfEWvN8PqsXj3FPYRYID-TaPgNU1wqiTUfrjfA6KPuoOu8he7VH7QZo1JoSBr"
            />
          </div>
        </div>

        {/* Footer Call to Action */}
        <p className="mt-8 font-body-sm text-body-sm text-muted-foreground text-center animate-in fade-in slide-in-from-top-2 duration-700 delay-300">
          New to Cognitive Correspondence? 
          <a href="#" className="text-primary font-label-md hover:underline decoration-2 underline-offset-4 ml-1">Create an account</a>
        </p>

        {/* Terms & Privacy */}
        <div className="mt-auto pt-16 flex gap-6 font-label-sm text-label-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-foreground transition-colors">Support</a>
        </div>
      </main>
    </div>
  );
};
