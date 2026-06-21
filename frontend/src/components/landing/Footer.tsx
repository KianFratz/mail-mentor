import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-card py-16 px-4 md:px-8 border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <span className="text-2xl font-bold text-primary">Mail Mentor</span>
            <p className="text-muted-foreground text-sm">
              Empowering professionals through the science of communication and artificial intelligence.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Product</h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Scenarios</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">AI Coaching</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Analytics</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Company</h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Security</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Resources</h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Writing Blog</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Webinars</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">API Docs</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground">© 2026 Mail Mentor. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-muted-foreground cursor-pointer hover:text-primary transition-colors">language</span>
            <span className="material-symbols-outlined text-muted-foreground cursor-pointer hover:text-primary transition-colors">share</span>
            <span className="material-symbols-outlined text-muted-foreground cursor-pointer hover:text-primary transition-colors">contact_support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
