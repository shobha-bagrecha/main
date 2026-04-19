/* ============================================================
   SHOBHA BAGRECHA — BOOKING / CALENDLY HANDLER
   - Detects if Calendly widget loaded successfully
   - Shows fallback contact form if it didn't (e.g. ad blocker,
     network error, or Calendly URL not yet configured)
   - Also auto-shows fallback if the URL placeholder is unchanged
   ============================================================ */

(function () {
  'use strict';

  var CALENDLY_CHECK_DELAY = 5000; // ms to wait before checking

  var widget   = document.getElementById('calendlyWidget');
  var fallback = document.getElementById('bookingFallback');

  if (!widget || !fallback) return;

  // If the Calendly URL is still the placeholder, show fallback immediately
  var dataUrl = widget.getAttribute('data-url') || '';
  var isPlaceholder = (
    dataUrl === '' ||
    dataUrl === 'https://calendly.com/shobhabagrecha/20min'
  );

  // We check after a delay: if the Calendly iframe appeared, widget loaded.
  // If not (script blocked, placeholder URL, etc.) — show the fallback form.
  setTimeout(function () {
    var iframe = widget.querySelector('iframe');

    if (!iframe || iframe.offsetParent === null) {
      // Calendly didn't load — show fallback, hide broken widget area
      widget.style.display    = 'none';
      fallback.style.display  = 'block';
      fallback.setAttribute('aria-live', 'polite');
    }
  }, CALENDLY_CHECK_DELAY);

  // Immediately show fallback if placeholder URL (so page isn't blank during wait)
  if (isPlaceholder) {
    // After a shorter delay so Calendly script has a chance to run
    setTimeout(function () {
      var iframe = widget.querySelector('iframe');
      if (!iframe) {
        widget.style.display   = 'none';
        fallback.style.display = 'block';
      }
    }, 2000);
  }

})();
