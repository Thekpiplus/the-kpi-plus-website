/** Inline bootstrap to avoid light/dark flash before React hydrates. */
export function CrmThemeScript() {
  const code = `(function(){try{var k='crm-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-crm-theme',t)}catch(e){document.documentElement.setAttribute('data-crm-theme','light')}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
