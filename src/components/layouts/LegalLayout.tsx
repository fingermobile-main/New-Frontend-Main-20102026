import React, {} from 'react';
import { Shield, FileText, Scale } from 'lucide-react';

interface LegalLayoutProps {
  children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Legal Center</h1>
              <p className="text-sm text-slate-700 font-medium">
                Terms, Privacy Policy, and Legal Documents
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border rounded-lg p-8">
          {children}
        </div>
      </main>

      <footer className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-slate-700 font-medium">
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                <FileText className="h-4 w-4 inline mr-1" />
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <Shield className="h-4 w-4 inline mr-1" />
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <Scale className="h-4 w-4 inline mr-1" />
                Cookie Policy
              </a>
            </div>
            <p>&copy; 2026 FingerMobile Protocol. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalLayout;
