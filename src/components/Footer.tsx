import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { config } from "@/lib/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src={logo} alt={`${config.brand.name} Logo`} width={32} height={32} className="h-8 w-auto" />
              <span className="font-bold text-lg gradient-text">{config.brand.name}</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {config.brand.slogan}
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {config.social.facebook && (
                <a href={config.social.facebook} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {config.social.twitter && (
                <a href={config.social.twitter} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {config.social.instagram && (
                <a href={config.social.instagram} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {config.social.linkedin && (
                <a href={config.social.linkedin} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          
          {/* Dynamic Footer Sections */}
          {Object.entries(config.footer.sections).map(([key, section]) => 
            section.links.length > 0 && (
              <div key={key}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {config.brand.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}