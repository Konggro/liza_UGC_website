import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

export function NotFound() {
  return (
    <div className="bg-[#FAF8F5] flex items-center justify-center px-4 py-24">
      <div className="text-center max-w-lg">
        <p
          className="text-[120px] md:text-[160px] font-bold text-[#B8956A]/20 leading-none"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          404
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1C1917] -mt-6 mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Page not found
        </h1>
        <p className="text-[#78716C] mb-10 leading-relaxed">
          Looks like this page has gone missing — kind of like that one cleanser 
          you loved that got discontinued. Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#B8956A] text-white font-medium rounded hover:bg-[#9E7A56] transition-colors"
          >
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#EDE8E1] text-[#78716C] font-medium rounded hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
          >
            Browse Reviews
          </Link>
        </div>
      </div>
    </div>
  );
}