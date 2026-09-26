import React from 'react';
import Link from 'next/link';
import { Scale } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 text-gray-900 mb-4">
              <Scale className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <span className="font-bold text-xl">LegalLens</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-md">
              AI-powered contract analysis and legal document comparison tool. 
              Upload documents securely, compare clauses, and review risk assessments efficiently.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/features" className="hover:text-indigo-600">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
              <li><Link href="/security" className="hover:text-indigo-600">Security</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-indigo-600">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
            <strong>Disclaimer:</strong> LegalLens is an AI-powered tool designed to assist with document analysis. 
            It does not provide legal advice, and its output should not be considered a substitute for professional 
            legal counsel. Always consult a qualified attorney for legal matters.
          </div>
          
          <div className="text-center text-sm text-gray-500">
            &copy; {currentYear} LegalLens Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
