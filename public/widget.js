(function() {
  const API_URL = window.location.origin; // In a real app, this would be the SaaS domain
  let visitorId = localStorage.getItem('lm_visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('lm_visitor_id', visitorId);
  }

  const track = async (type, data = {}) => {
    try {
      await fetch(`${API_URL}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: visitorId,
          type,
          page: window.location.pathname,
          data
        })
      });
    } catch (e) { console.error('LM Track Error:', e); }
  };

  const captureLead = async (email, name, popupId) => {
    try {
      const res = await fetch(`${API_URL}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: visitorId,
          email,
          name,
          popup_id: popupId
        })
      });
      return await res.json();
    } catch (e) { console.error('LM Lead Error:', e); }
  };

  const fetchPopups = async () => {
    try {
      const res = await fetch(`${API_URL}/api/popups/active`);
      return await res.json();
    } catch (e) { console.error('LM Popup Error:', e); return []; }
  };

  const showPopup = (popup) => {
    const { content, id } = popup;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center;
      justify-content: center; z-index: 999999; font-family: sans-serif;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: ${content.backgroundColor || '#fff'};
      color: ${content.textColor || '#1a1a1a'};
      padding: 40px; border-radius: 12px; max-width: 450px; width: 90%;
      position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      text-align: center;
    `;

    modal.innerHTML = `
      <button style="position: absolute; top: 15px; right: 15px; border: none; background: none; cursor: pointer; font-size: 20px;">&times;</button>
      <h2 style="margin-top: 0; font-size: 24px;">${content.title}</h2>
      <p style="margin-bottom: 25px; opacity: 0.8;">${content.description}</p>
      <form id="lm-form">
        <input type="text" id="lm-name" placeholder="Your Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
        <input type="email" id="lm-email" placeholder="Your Email" required style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
        <button type="submit" style="width: 100%; padding: 14px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">${content.buttonText}</button>
      </form>
    `;

    const close = () => document.body.removeChild(overlay);
    modal.querySelector('button').onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    modal.querySelector('#lm-form').onsubmit = async (e) => {
      e.preventDefault();
      const email = modal.querySelector('#lm-email').value;
      const name = modal.querySelector('#lm-name').value;
      const btn = modal.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerText = 'Sending...';
      
      const res = await captureLead(email, name, id);
      if (res && res.success) {
        modal.innerHTML = `
          <h2 style="margin-top: 0;">Thank You!</h2>
          <p>We've received your request. Check your email soon!</p>
          <button id="lm-close-final" style="margin-top: 20px; padding: 10px 20px; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Close</button>
        `;
        modal.querySelector('#lm-close-final').onclick = close;
      } else {
        btn.disabled = false;
        btn.innerText = content.buttonText;
        alert('Something went wrong. Please try again.');
      }
    };

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    track('popup_view', { popup_id: id });
  };

  // Initialize tracking
  track('page_view');

  // Load and setup triggers
  fetchPopups().then(popups => {
    popups.forEach(popup => {
      if (popup.trigger_type === 'time_on_page') {
        setTimeout(() => showPopup(popup), parseInt(popup.trigger_value));
      } else if (popup.trigger_type === 'exit_intent') {
        document.addEventListener('mouseleave', (e) => {
          if (e.clientY < 0) {
            if (!window._lm_exit_triggered) {
              showPopup(popup);
              window._lm_exit_triggered = true;
              track('exit_intent');
            }
          }
        });
      }
    });
  });
})();
