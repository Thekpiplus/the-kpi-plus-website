/** Inline bootstrap — runs before paint to avoid theme flash (incl. System). */
export function CrmThemeScript() {
  const code = `(function(){try{var k='crm-theme';var p=localStorage.getItem(k);if(p!=='light'&&p!=='dark'&&p!=='system'){p='system';}var r=p==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;var d=document.documentElement;d.setAttribute('data-crm-theme',r);d.setAttribute('data-crm-theme-pref',p);d.style.colorScheme=r;}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
