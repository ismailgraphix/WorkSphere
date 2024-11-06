export function ThemeScript() {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function getThemePreference() {
                if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
                  return localStorage.getItem('theme');
                }
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              
              const theme = getThemePreference();
              document.documentElement.classList.toggle('dark', theme === 'dark');
            })();
          `,
        }}
      />
    )
  }