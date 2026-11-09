import { useState, useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: {
          new (options: object, elementId: string): void;
          InlineLayout: { SIMPLE: number };
        };
      };
    };
  }
}

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}

export function LanguageSwitcher() {
  const [isMongolian, setIsMongolian] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cookie = getCookie('googtrans');
    setIsMongolian(cookie.includes('/mn'));
    setReady(true);
  }, []);

  const switchLanguage = () => {
    if (isMongolian) {
      // Clear cookie and reload to restore English
      const expire = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; ${expire}`;
      document.cookie = `googtrans=; ${expire} domain=${location.hostname};`;
      document.cookie = `googtrans=; ${expire} domain=.${location.hostname};`;
      window.location.reload();
    } else {
      // Set cookie then trigger Google Translate programmatically
      document.cookie = 'googtrans=/en/mn; path=/;';
      document.cookie = `googtrans=/en/mn; path=/; domain=${location.hostname};`;
      const trySwitch = (attempts = 0) => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (select) {
          select.value = 'mn';
          select.dispatchEvent(new Event('change'));
          setIsMongolian(true);
        } else if (attempts < 20) {
          setTimeout(() => trySwitch(attempts + 1), 150);
        } else {
          // Fallback: reload with cookie already set
          window.location.reload();
        }
      };
      trySwitch();
    }
  };

  if (!ready) return null;

  return (
    <button
      onClick={switchLanguage}
      title={isMongolian ? 'Switch to English' : 'Монгол хэлрүү шилжих'}
      className={`
        flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold tracking-wide transition-all duration-200
        ${isMongolian
          ? 'border-[#B8956A] text-[#B8956A] bg-[#FAF0E4]'
          : 'border-[#EDE8E1] text-[#78716C] hover:border-[#B8956A] hover:text-[#B8956A]'}
      `}
    >
      {isMongolian ? (
        <>
          <span className="text-base leading-none">🇺🇸</span>
          <span>EN</span>
        </>
      ) : (
        <>
          <span className="text-base leading-none">🇲🇳</span>
          <span>МН</span>
        </>
      )}
    </button>
  );
}
