/*!
 * color-modes.js — Bootstrap 5 theme switcher
 * Gestiona los modos claro / oscuro / auto en el atributo data-bs-theme del <html>
 */

'use strict';

(() => {
  const STORAGE_KEY = 'theme';

  /**
   * Devuelve el tema preferido del sistema operativo.
   * @returns {'light'|'dark'}
   */
  const getPreferredTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  /**
   * Aplica el tema al elemento <html>.
   * @param {'light'|'dark'|'auto'} theme
   */
  const setTheme = (theme) => {
    if (theme === 'auto') {
      document.documentElement.setAttribute(
        'data-bs-theme',
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      );
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  };

  // Aplicar tema al cargar (antes de que el navegador pinte)
  setTheme(getPreferredTheme());

  /**
   * Muestra el icono activo en el botón del toggle según el tema seleccionado.
   * @param {'light'|'dark'|'auto'} theme
   */
  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher   = document.querySelector('#bd-theme');
    if (!themeSwitcher) return;

    const themeSwitcherText = document.querySelector('#bd-theme-text');
    const activeThemeIcon   = document.querySelector('.theme-icon-active use');
    const btnToActive       = document.querySelector(`[data-bs-theme-value="${theme}"]`);
    const svgOfActiveBtn    = btnToActive?.querySelector('svg use')?.getAttribute('href');

    // Quitar estado activo de todos los botones
    document.querySelectorAll('[data-bs-theme-value]').forEach((el) => {
      el.classList.remove('active');
      el.setAttribute('aria-pressed', 'false');
    });

    // Activar el botón correspondiente
    btnToActive?.classList.add('active');
    btnToActive?.setAttribute('aria-pressed', 'true');

    // Actualizar el icono del toggle principal
    if (activeThemeIcon && svgOfActiveBtn) {
      activeThemeIcon.setAttribute('href', svgOfActiveBtn);
    }

    // Actualizar el label accesible
    const themeName = btnToActive?.textContent?.trim() ?? theme;
    if (themeSwitcherText) {
      themeSwitcherText.textContent = `Toggle theme (${themeName})`;
    }

    if (focus) themeSwitcher.focus();
  };

  // Escuchar cambios del sistema operativo cuando el modo es "auto"
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== 'light' && stored !== 'dark') {
      setTheme(getPreferredTheme());
    }
  });

  // Inicializar la UI cuando el DOM esté listo
  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme());

    document.querySelectorAll('[data-bs-theme-value]').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-bs-theme-value');
        localStorage.setItem(STORAGE_KEY, theme);
        setTheme(theme);
        showActiveTheme(theme, true);
      });
    });
  });
})();