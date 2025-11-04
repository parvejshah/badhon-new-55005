import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Award, LayoutDashboard, Heart, Users, FileText, Mail, Github, Linkedin, Droplet } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-3">
        {user && (
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary hover:bg-white/90 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <LayoutDashboard className="h-4 w-4" />
            Go to Dashboard
          </button>
        )}
        {!user && (
          <button
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary hover:bg-white/90 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-3 mb-4 animate-fade-in">
            <img 
              src="/certificate-assets/badhanlogo.gif" 
              alt="Badhon Logo" 
              className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 drop-shadow-2xl"
            />
            <Award className="h-16 w-16 md:h-20 md:w-20 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-heading font-bold text-white mb-4 drop-shadow-lg animate-fade-in">
            Badhon Certificate Generator
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mb-6 drop-shadow animate-fade-in">
            Streamline your certificate creation process with our automated solution for Amar Ekushay Hall blood donors
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Heart className="h-5 w-5 text-white" />
              <span className="text-white font-medium">For Blood Donors</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Users className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Batch Processing</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FileText className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Multiple Formats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <main className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Why Choose Our Certificate Generator?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Designed specifically for blood donation organizations to create professional certificates efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Honor Blood Donors</h3>
            <p className="text-muted-foreground">
              Create beautiful certificates to recognize the selfless contributions of blood donors
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Batch Processing</h3>
            <p className="text-muted-foreground">
              Generate hundreds of certificates at once from Excel files with just a few clicks
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Multiple Formats</h3>
            <p className="text-muted-foreground">
              Export certificates as PDF, HTML, or Word documents based on your needs
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 text-lg"
          >
            {user ? 'Go to Dashboard' : 'Get Started Now'}
          </button>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t mt-12 md:mt-16 bg-card">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                About This Project
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Developed to streamline certificate generation for Badhon blood donation organization at Amar Ekushay Hall, University of Dhaka. 
                This tool helps honor the selfless contributions of blood donors efficiently.
              </p>
            </div>

            {/* Developer Section */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Developer
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Parvej Shah</p>
                <p>Software Engineering Student</p>
                <p>Institute of Information Technology (IIT)</p>
                <p>University of Dhaka</p>
                <p className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Currently in 3rd Semester
                </p>
              </div>
            </div>

            {/* Connect Section */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Connect
              </h3>
              <div className="space-y-3">
                <a 
                  href="https://github.com/parvejshah" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub Profile
                </a>
                <a 
                  href="https://linkedin.com/in/parvejshah" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Profile
                </a>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Droplet className="h-4 w-4 text-primary animate-pulse" />
                  <span>Proudly supporting Badhon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Badhon Certificate Generator. Developed with{' '}
              <Heart className="inline h-4 w-4 text-primary animate-pulse" /> by Parvej Shah for Amar Ekushay Hall, University of Dhaka
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Empowering blood donation initiatives through technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
