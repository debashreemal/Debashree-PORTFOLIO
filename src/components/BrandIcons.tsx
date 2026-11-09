import React from 'react';

interface BrandIconProps {
  size?: string | number;
  className?: string;
}

export const LinkedInBrandIcon: React.FC<BrandIconProps> = ({ size = '100%', className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'block' }}
    aria-hidden="true"
  >
    <rect width="24" height="24" rx="4.5" fill="#0A66C2" />
    <path
      fill="#FFFFFF"
      d="M19 19h-3.12v-4.89c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.88 1.27-1.88 2.59V19H9.25V9.6h2.99v1.28h.04c.42-.79 1.44-1.63 2.96-1.63 3.17 0 3.76 2.09 3.76 4.8V19zM6.54 8.32a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6zM8.04 19H5.04V9.6h3V19z"
    />
  </svg>
);

export const GitHubBrandIcon: React.FC<BrandIconProps> = ({ size = '100%', className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'block' }}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="12" fill="#24292F" />
    <path
      fill="#FFFFFF"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const GmailBrandIcon: React.FC<BrandIconProps> = ({ size = '100%', className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'block' }}
    aria-hidden="true"
  >
    <path fill="#4285F4" d="M2 7.72V17.5A2.5 2.5 0 0 0 4.5 20h2.5V9.6L2 7.72z" />
    <path fill="#34A853" d="M17 9.6V20h2.5a2.5 2.5 0 0 0 2.5-2.5V7.72L17 9.6z" />
    <path fill="#EA4335" d="M17 6.44L12 10.2 7 6.44V4.5a.5.5 0 0 1 .8-.4L12 7.2l4.2-3.1a.5.5 0 0 1 .8.4v1.94z" />
    <path fill="#FBBC05" d="M17 6.44L22 7.72V6.5A2.5 2.5 0 0 0 19.5 4H17v2.44z" />
    <path fill="#EA4335" d="M7 6.44L2 7.72V6.5A2.5 2.5 0 0 1 4.5 4H7v2.44z" />
    <path fill="#C5221F" d="M7 9.6L12 13.4 17 9.6V6.44L12 10.2 7 6.44V9.6z" />
  </svg>
);

