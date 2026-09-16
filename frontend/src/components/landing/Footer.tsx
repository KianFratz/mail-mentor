import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-card py-16 px-4 md:px-8 border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <span className="text-2xl font-bold text-primary">Mail Mentor</span>
            <p className="text-muted-foreground text-sm">
              AI-powered email-writing practice with interactive scenarios and
              post-session feedback.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">
              Product
            </h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors"
                >
                  Scenarios
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">
              Practice
            </h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors"
                >
                  Beginner scenarios
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors"
                >
                  Writing sessions
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors"
                >
                  Feedback reports
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">
              Status
            </h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>Under active development</li>
              <li>English only</li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground">
            © 2026 Mail Mentor. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              language
            </span>
            <span className="material-symbols-outlined text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              share
            </span>
            <span className="material-symbols-outlined text-muted-foreground cursor-pointer hover:text-primary transition-colors">
              contact_support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
