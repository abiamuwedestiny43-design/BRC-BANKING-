// components/Footer.tsx
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo.png" alt="HB Bank" width={90} height={50} className="h-[72px] rounded-lg" />
            </Link>
            <p className="text-gray-400 text-sm">
              Your trusted financial partner for over 50 years. Building stronger communities through innovative banking solutions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/personal-banking" className="hover:text-white transition-colors">Personal Banking</Link></li>
              <li><Link href="/business-banking" className="hover:text-white transition-colors">Business Banking</Link></li>
              <li><Link href="/mortgage" className="hover:text-white transition-colors">Mortgages</Link></li>
              <li><Link href="/loans" className="hover:text-white transition-colors">Loans</Link></li>
              <li><Link href="/investments" className="hover:text-white transition-colors">Investment Services</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/branches" className="hover:text-white transition-colors">Branch Locator</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Security Center</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +1 (555) 886 436
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                support@hb-bank.online
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                102 Jones Street<br />Dallars Texas USA.
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 HB Bank. All rights reserved. Member FDIC. Equal Housing Lender.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
