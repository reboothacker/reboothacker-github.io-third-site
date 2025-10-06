// main.js
(() => {
    /* ---------- 1. Определяем, запущены ли мы во встроенном браузере Telegram ---------- */
    const ua = navigator.userAgent || '';
    const inTelegram =
      /Telegram/i.test(ua) ||               // Web-view Android/iOS ≥ 9.0
      window.TelegramWebviewProxy ||        // iOS 8.7+
      window.TelegramWebview;               // Android 8.7+
  
    if (!inTelegram) return;                // обычный браузер — ничего не делаем
  
    /* ---------- 2. Защита от повторного срабатывания ---------- */
    const FLAG = '__tg_extredir_done__';
    if (sessionStorage.getItem(FLAG)) return;
    sessionStorage.setItem(FLAG, '1');
  
    /* ---------- 3. Текущий URL (с учётом parent, если открыто через deep-link) ---------- */
    // В оригинале ищут window.savedState?.parent 
    const rawUrl =
      window.savedState?.parent || window.location.href;
  
    // Добавим https:// если пришёл naked-домен
    const canonical = /^https?:\/\//i.test(rawUrl) ? rawUrl : 'https://' + rawUrl;
    const noScheme = canonical.replace(/^https?:\/\//i, '');
  
    /* ---------- 4. Android: Intent-URI выводит из WebView в системный браузер ---------- */
    if (/android/i.test(ua)) {
      // итог соответствует:  intent://<host>/<path>#Intent;scheme=https;end
      location.href = `intent://${noScheme}#Intent;scheme=https;end`;
      return;                               // дальше можно не выполнять
    }
  
    /* ---------- 5. iOS: ухищрения со схемами — «x-safari-» самый надёжный трюк  ---------- */
    if (/iphone|ipad|ipod/i.test(ua)) {
      // Приставка «x-safari-» заставляет Telegram передать ссылку системному «открывалке»,
      // которая уже спросит, куда именно вывести (Safari / Chrome / другое) 
      location.href = 'x-safari-' + canonical;
      return;
    }
  
    /* ---------- 6. Иное: Telegram Desktop, macOS-webview и т.п. — остаёмся как есть ----- */
  })();