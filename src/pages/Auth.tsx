import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, UserPlus, LogIn, User, Phone, Building2, Droplet, GraduationCap } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  bloodGroup: z.string().min(1, { message: 'Blood group is required' }),
  hall: z.string().min(1, { message: 'Hall is required' }),
  department: z.string().min(2, { message: 'Department is required' }),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [hall, setHall] = useState('');
  const [department, setDepartment] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  const halls = [
    'Shaheed Rafiq Hall', 'Jinnah Hall', 'Amar Ekushey Hall',
    'Shahid Salam-Barkat Hall', 'Suhrawardy Hall', 'Shaheed Sergeant Zahurul Haq Hall',
    'Fazlul Huq Muslim Hall', 'Haji Muhammad Mohsin Hall', 'Bishwakabi Rabindranath Hall',
    'Shamsun Nahar Hall', 'Bangladesh-Kuwait Maitree Hall', 'Bangabandhu Sheikh Mujibur Rahman Hall',
    'Begum Fazilatunnesa Mujib Hall', 'Dr. Muhammad Shahidullah Hall', 'Ruqayyah Hall',
    'Bangamata Sheikh Fazilatunnessa Mujib Hall', 'Kabi Jasimuddin Hall', 'Kabi Sufia Kamal Hall',
    'Masterda Surya Sen Hall'
  ];

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    try {
      if (isLogin) {
        loginSchema.parse({ email, password });
      } else {
        signupSchema.parse({ name, email, password, phone, bloodGroup, hall, department });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: any = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        // Sign up the user
        const redirectUrl = `${window.location.origin}/`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        if (data.user) {
          // Create donor profile
          const { error: donorError } = await supabase
            .from('donors')
            .insert({
              user_id: data.user.id,
              name,
              email,
              phone,
              blood_group: bloodGroup,
              hall,
              department,
              status: 'ready',
              medical_eligible: true,
              donation_count: 0,
            });

          if (donorError) {
            toast.error('Account created but failed to create donor profile: ' + donorError.message);
          } else {
            toast.success('Registration successful! Welcome to Badhan Blood Donation!');
          }
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-2 hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-scale-in">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              {isLogin ? 'Welcome Back' : 'Donor Registration'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Sign in to your Badhan account' 
                : 'Register as a blood donor and save lives'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`transition-all duration-200 ${errors.name ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`transition-all duration-200 ${errors.phone ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="flex items-center gap-2">
                      <Droplet className="w-4 h-4" />
                      Blood Group
                    </Label>
                    <Select value={bloodGroup} onValueChange={setBloodGroup} required>
                      <SelectTrigger className={errors.bloodGroup ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bloodGroup && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.bloodGroup}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hall" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Hall of Residence
                    </Label>
                    <Select value={hall} onValueChange={setHall} required>
                      <SelectTrigger className={errors.hall ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select hall" />
                      </SelectTrigger>
                      <SelectContent>
                        {halls.map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.hall && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.hall}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Department
                    </Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className={`transition-all duration-200 ${errors.department ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.department && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.department}</p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`transition-all duration-200 ${errors.email ? 'border-destructive' : ''}`}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`transition-all duration-200 ${errors.password ? 'border-destructive' : ''}`}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full group hover-scale"
                size="lg"
                disabled={submitting}
              >
                {submitting ? (
                  'Processing...'
                ) : isLogin ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Register as Donor
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <span className="font-semibold story-link">Sign up</span>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <span className="font-semibold story-link">Sign in</span>
                  </>
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
