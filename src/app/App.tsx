import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

// Inject CSS to hide Google Translate's banner/toolbar
const GT_HIDE_CSS = `
  .goog-te-banner-frame.skiptranslate,
  .goog-te-gadget,
  #goog-gt-tt,
  .goog-te-balloon-frame,
  .goog-tooltip,
  .goog-tooltip-content,
  .goog-te-menu-value span:last-child,
  .VIpgJd-ZVi9od-aZ2wEe-wOHMyf { display: none !important; }
  body { top: 0 !important; min-height: 100% !important; }
  .skiptranslate { display: none !important; }
`;

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

export default function App() {
  useEffect(() => {
    // Inject suppression CSS
    const style = document.createElement('style');
    style.textContent = GT_HIDE_CSS;
    document.head.appendChild(style);

    // Define the callback Google Translate will call once loaded
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'mn',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Load the Google Translate script
    if (!document.getElementById('gt-script')) {
      const script = document.createElement('script');
      script.id = 'gt-script';
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* Hidden Google Translate mount point */}
      <div id="google_translate_element" style={{ display: 'none' }} />
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
