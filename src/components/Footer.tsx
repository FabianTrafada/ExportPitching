import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="relative h-8 w-8 mr-2">
                <div
                  className="absolute h-8 w-8 rounded-full bg-yellow-400"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)" }}
                  aria-hidden="true"
                ></div>
              </div>
              <span className="text-xl font-bold">
                export<span className="text-yellow-400">pitch</span>
              </span>
            </div>
            <p className="text-gray-500 mb-6">
              AI-powered pitching training for Indonesian exporters looking to succeed in global markets.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors" aria-label="Facebook">
                <Facebook size={20} aria-hidden="true" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors" aria-label="Twitter">
                <Twitter size={20} aria-hidden="true" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors" aria-label="Instagram">
                <Instagram size={20} aria-hidden="true" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Quick Links</h3>
            <nav aria-label="Quick links">
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#courses" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="#events" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="#experts" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    Expert Talks
                  </Link>
                </li>
                <li>
                  <Link href="#resources" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    Resources
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Resources</h3>
            <nav aria-label="Resources">
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    Market Research
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    Export Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Contact Us</h3>
            <address className="not-italic">
              <ul className="space-y-4">
                <li className="flex">
                  <MapPin className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-500">Jl. Export Indonesia No. 123, Jakarta, Indonesia</span>
                </li>
                <li className="flex">
                  <Phone className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" aria-hidden="true" />
                  <a href="tel:+622112345678" className="text-gray-500 hover:text-yellow-500 transition-colors">
                    +62 21 1234 5678
                  </a>
                </li>
                <li className="flex">
                  <Mail className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:info@exportpitch.ai"
                    className="text-gray-500 hover:text-yellow-500 transition-colors"
                  >
                    info@exportpitch.ai
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ExportPitch AI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-500 hover:text-gray-400 text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-400 text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-400 text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
