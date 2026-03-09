import React, { useState, useEffect } from "react";
import { footerStyles } from "../assests/dummyStyles";
import {
  Clapperboard,
  Film,
  Star,
  Ticket,
  Popcorn,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowUp,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isvisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "Releases", href: "/releases" },
    { label: "Contact", href: "/contact" },
    { label: "Login", href: "/login" }
  ];

  const genreLinks = [
    { label: "Horror", href: "/movies?genre=horror" },
    { label: "Thriller", href: "/movies?genre=thriller" },
    { label: "Action", href: "/movies?genre=action" },
    { label: "Drama", href: "/movies?genre=drama" },
    { label: "Comedy", href: "/movies?genre=comedy" }
  ];

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const floatingIcons = [Clapperboard, Film, Star, Ticket, Popcorn];

  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.animatedBorder}></div>

      <div className={footerStyles.bgContainer}>
        <div className={footerStyles.bgGlow1}></div>
        <div className={footerStyles.bgGlow2}></div>
      </div>

      {/* Floating Icons */}
      <div className={footerStyles.floatingIconsContainer}>
        {[...Array(12)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length];
          const left = (i * 23) % 100;
          const top = (i * 17) % 100;
          const dur = 6 + (i % 5);
          const delay = (i % 4) * 0.6;

          return (
            <div
              key={`floating-icon-${i}`}
              className={footerStyles.floatingIcon}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animation: `float ${dur}s infinite ease-in-out`,
                animationDelay: `${delay}s`
              }}
            >
              <IconComponent className="w-8 h-8" />
            </div>
          );
        })}
      </div>

      <div className={footerStyles.mainContainer}>
        <div className={footerStyles.gridContainer}>
          
          {/* Brand Section */}
          <div className={footerStyles.brandContainer}>
            <div className={footerStyles.brandLogoContainer}>
              <div className="relative">
                <div className={footerStyles.logoGlow}></div>
                <div className={footerStyles.logoContainer}>
                  <Clapperboard className={footerStyles.logoIcon} />
                </div>
              </div>

              <h2 style={{ fontFamily: "Monotom,cursive" }} className={footerStyles.brandTitle}>
                Cine<span className={footerStyles.brandTitleWhite}>Verse</span>
              </h2>
            </div>

            <p className={footerStyles.brandDescription}>
              Experience the dark side of cinema with the latest news, reviews, and exclusive content.
            </p>

            <div className={footerStyles.socialContainer}>
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a href="#" key={`social-${index}`} className={footerStyles.socialLink}>
                  <Icon className={footerStyles.socialIcon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={footerStyles.sectionHeader}>
              <span className={footerStyles.sectionDot}></span>
              Explore
            </h3>

            <ul className={footerStyles.linksList}>
              {links.map((link) => (
                <li key={`link-${link.href}`}>
                  <a href={link.href} className={footerStyles.linkItem}>
                    <span className={footerStyles.linkDot}></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className={footerStyles.sectionHeader}>
              <span className={footerStyles.sectionDot}></span>
              Genres
            </h3>

            <ul className={footerStyles.linksList}>
              {genreLinks.map((link) => (
                <li key={`genre-${link.label}`}>
                  <a href={link.href} className={footerStyles.linkItem}>
                    <span className={footerStyles.linkDot}></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={footerStyles.sectionHeader}>
              <span className={footerStyles.sectionDot}></span>
              Contact Us
            </h3>

            <ul className={footerStyles.contactList}>
              <li key="contact-email" className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <Mail className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>
                  contact@cineverse.com
                </span>
              </li>

              <li key="contact-phone" className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <Phone className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>
                  +91 8299431275
                </span>
              </li>

              <li key="contact-address" className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <MapPin className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>
                  Lucknow, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={footerStyles.divider}>
          <div className={footerStyles.dividerIconContainer}>
            <Film className={footerStyles.dividerIcon} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={footerStyles.bottomBar}>
          <div className={footerStyles.designedBy}>
            <span className={footerStyles.designedByText}>Designed by</span>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className={footerStyles.designedByLink}
            >
              Chandan Palariya
            </a>
          </div>

          <div className={footerStyles.policyLinks}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item, index) => (
                <a key={`policy-${index}`} href="#" className={footerStyles.policyLink}>
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </div>

      {/* Scroll To Top */}
      {isvisible && (
        <button onClick={scrollToTop} className={footerStyles.scrollTopButton}>
          <ArrowUp className={footerStyles.scrollTopIcon} />
        </button>
      )}

      <style>{footerStyles.customCSS}</style>
    </footer>
  );
};

export default Footer;