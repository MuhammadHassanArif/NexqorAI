import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NAV_LINKS } from "../../../constants/navLinks";
import { ROUTES } from "../../../constants/routes";
import { SPRING } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

// Desktop links. One soft purple pill follows the mouse (or keyboard focus)
// and rests on the section you are currently reading.
export function NavLinks({ activeId }) {
  const [hoveredId, setHoveredId] = useState(null);
  const highlightedId = hoveredId ?? activeId;

  return (
    <ul className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHoveredId(null)}>
      {NAV_LINKS.map((link) => {
        const isActive = activeId === link.id;

        return (
          <li key={link.id} className="relative">
            <Link
              to={{ pathname: ROUTES.home, hash: `#${link.sectionId}` }}
              onMouseEnter={() => setHoveredId(link.id)}
              onFocus={() => setHoveredId(link.id)}
              onBlur={() => setHoveredId(null)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "relative z-10 block rounded-full px-4 py-2 text-sm font-medium outline-offset-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary-500",
                isActive ? "text-primary-700" : "text-ink-soft hover:text-ink",
              )}
            >
              {link.label}
            </Link>

            {highlightedId === link.id && (
              <motion.span
                layoutId="nav-pill"
                transition={SPRING}
                className="absolute inset-0 rounded-full bg-primary-100/80"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}