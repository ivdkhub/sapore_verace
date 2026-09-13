import React from 'react';

export const MoustacheIcon = ({ className = 'w-6 h-3 text-[#d2401e]', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25 11"
    className={`fill-current transition-all duration-300 ${className}`}
    {...props}
  >
    <path d="M21.1 3.7C20.5 3.6 20 3.4 19.5 3c-0.4-0.3-0.8-0.7-1.1-1 -0.9-0.9-1.8-1.8-3.1-1.8 -0.2 0-0.4 0-0.6 0.1 -0.8 0.1-1.6 0.6-2.2 1.3 -0.6-0.7-1.3-1.2-2.2-1.3 -0.2 0-0.4-0.1-0.6-0.1C8.4 0.2 7.5 1.1 6.7 2 6.3 2.3 5.9 2.7 5.5 3 4.9 3.5 4.2 3.7 3.4 3.7c-1 0-1.9-0.4-2.6-1L0.2 2.1v0.8c0 6.8 4.4 7.8 7.1 7.8 1.5 0 2.8-0.3 3.2-0.5 0.8-0.4 1.4-0.9 2-1.5 0.5 0.7 1.2 1.2 2 1.5 0.4 0.2 1.7 0.5 3.2 0.5 1 0 2.3-0.1 3.5-0.7 0.2-0.1 0.5-0.3 0.7-0.4 1.7-1 3-3 3-6.8V2.1l-0.6 0.5c-0.6 0.6-1.5 1-2.4 1L21.1 3.7zM21.1 9.3c-1.1 0.6-2.3 0.8-3.5 0.8 -1.5 0-2.7-0.3-3-0.5 -0.8-0.4-1.5-1-2-1.7l-0.3-0.4 -0.3 0.4c-0.5 0.7-1.1 1.3-2 1.7C10 9.7 8.8 10 7.3 10c-2.8 0-6.1-1.1-6.4-6.4 0.7 0.5 1.6 0.7 2.5 0.7 0.9 0 1.8-0.3 2.5-0.8 0.4-0.3 0.8-0.7 1.2-1.1C7.9 1.7 8.7 1 9.8 1c0.1 0 0.3 0 0.5 0 0.8 0.1 1.5 0.6 2 1.4l0.3 0.4 0.3-0.4c0.5-0.8 1.2-1.3 2-1.4 0.2 0 0.3 0 0.5 0 1.1 0 1.8 0.8 2.7 1.6 0.4 0.4 0.8 0.8 1.2 1.1 0.6 0.4 1.3 0.7 2 0.8 0.2 0 0.3 0 0.5 0 0.1 0 0.1 0 0.2 0 0.8 0 1.6-0.3 2.3-0.7 -0.1 2.6-1 4.2-2.3 5.2C21.6 9 21.4 9.1 21.1 9.3z" />
  </svg>
);

export const InstagramIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const FacebookIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const TwitterIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

export const LinkedinIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
