import { ArrowUp } from "lucide-react";
import { profile } from "@/data/profile";
export function Footer() {
  return (
    <footer className="section-shell footer">
      <a className="wordmark" href="#home" aria-label="Yubo Zhao, home">
        {profile.initials}
        <span>.</span>
      </a>
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span className="footer-location mono">
        {profile.location} / ALWAYS ITERATING
      </span>
      <a className="back-top" href="#home">
        Back to top <ArrowUp size={14} />
      </a>
    </footer>
  );
}
