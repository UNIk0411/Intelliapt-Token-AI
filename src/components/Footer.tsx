
import React from 'react';
import { Github, Twitter, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutralGray">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-lg bg-aptos flex items-center justify-center mr-2">
                <span className="text-white font-semibold text-lg">Aι</span>
              </div>
              <span className="text-darkText font-semibold text-xl">TokenAI</span>
            </div>
            <p className="text-lightText mb-4">
              Advanced AI-powered token price predictions secured by Aptos blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-lightText hover:text-darkText transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-lightText hover:text-darkText transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div className="md:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-darkText mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      Predictions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      Market Data
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      API Access
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      Premium Features
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-darkText mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-lightText hover:text-darkText transition-colors">
                      <span>Aptos Explorer</span>
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-darkText mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-lightText hover:text-darkText transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-lightText text-sm">
            &copy; {currentYear} TokenAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-lightText hover:text-darkText text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-lightText hover:text-darkText text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-lightText hover:text-darkText text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
