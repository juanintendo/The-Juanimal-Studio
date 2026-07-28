/** Digits only, country code included (no + or spaces). eg. 34600111222 */
const WHATSAPP_NUMBER = "34649120294";

const WHATSAPP_PREFILL = encodeURIComponent(
  "Hi! I'd like to talk about a project with The Juanimal Studio."
);

const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PREFILL}`;

type DockLink = {
  key: string;
  label: string;
  href: string;
  external?: boolean;
  icon: React.ReactNode;
};

/**
 * Order matters: the dock is laid out right-to-left, so WhatsApp sits at
 * right:0 (the collapsed circle) and the rest fan out behind it. Their
 * offsets are set in globals.css via :nth-child.
 */
const DOCK_LINKS: DockLink[] = [
  {
    key: "whatsapp",
    label: "Chat on WhatsApp",
    href: WHATSAPP_HREF,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.04 2c-5.46 0-9.91 4.43-9.91 9.89 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.89-4.43 9.89-9.89C21.93 6.43 17.5 2 12.04 2zm5.89 14.05c-.25.7-1.45 1.28-2.03 1.36-.52.07-1.18.1-1.9-.12-.44-.13-.99-.32-1.71-.63-3.01-1.3-4.97-4.33-5.12-4.53-.15-.2-1.2-1.6-1.2-3.05 0-1.46.76-2.17 1.03-2.47.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.84 2.06.91 2.21.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.3.15.47.12.64-.07.17-.2.74-.86.93-1.16.2-.3.39-.25.66-.15.27.1 1.72.81 2.01.96.3.15.49.22.56.34.08.13.08.74-.17 1.44z"
        />
      </svg>
    ),
  },
  {
    key: "email",
    label: "Email",
    href: "mailto:colombojuanb@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.4 2 7.1 5.5a1 1 0 0 0 1 0L19.6 7H4.4zM4 8.9V17h16V8.9l-6.9 5.3a2 2 0 0 1-2.2 0L4 8.9z"
        />
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/juanbcolombodesigns/",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9z"
        />
      </svg>
    ),
  },
  {
    key: "chat",
    label: "Chat with the studio AI",
    href: "#ai-chat",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
        />
        <circle cx="8.5" cy="11" r="1.15" fill="currentColor" />
        <circle cx="12" cy="11" r="1.15" fill="currentColor" />
        <circle cx="15.5" cy="11" r="1.15" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/juanintendo/",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="2.5"
          y="2.5"
          width="19"
          height="19"
          rx="5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" />
      </svg>
    ),
  },
];

/**
 * Collapsed it is a plain circle with the WhatsApp mark; on hover it widens
 * into a pill and reveals the rest.
 *
 * The three-layer split is deliberate. An earlier version put the border, the
 * background and the icon clipping on one element, but `overflow:hidden` plus
 * a 4px border centres icons inside the *content* box, which is 8px narrower
 * than the visual circle. That is what kept knocking every icon off-centre and
 * showing seams mid-animation. Separating the layers keeps each icon centred
 * in a true 74px square regardless of the border.
 */
export function WhatsAppFab() {
  return (
    <nav className="fab-dock" aria-label="Contact options">
      <span className="fab-dock-bg" aria-hidden="true" />
      <span className="fab-dock-items">
        {DOCK_LINKS.map((l) => (
          <a
            key={l.key}
            className="fab-dock-item"
            href={l.href}
            aria-label={l.label}
            {...(l.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {l.icon}
          </a>
        ))}
      </span>
      <span className="fab-dock-ring" aria-hidden="true" />
    </nav>
  );
}
