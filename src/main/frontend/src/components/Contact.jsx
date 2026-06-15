import React, { useState } from 'react';
import { Mail, Phone, Pin } from './Icons';
import { useFadeUp } from '../hooks/useFadeUp';

export const Contact = () => {
  const { ref, isVisible } = useFadeUp();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: ''
  });
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Honeypot-Check: Wenn gefüllt, ist es ein Bot
    if (honeypot) {
      // Still ignorieren - Bot soll denken es hat funktioniert
      setSuccess(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.status === 429) {
        setError('Zu viele Anfragen. Bitte versuchen Sie es später erneut.');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Fehler beim Senden');
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        message: ''
      });
    } catch (err) {
      setError(err.message || 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="kontakt" ref={ref}>
      <div className={`section-container ${isVisible ? 'visible' : ''}`}>
        <div className="section-header contact-header">
          <span className="section-tag">KONTAKT</span>
          <h2 className="section-title">Kontakt aufnehmen</h2>
          <p className="section-subtitle">Wir freuen uns auf Ihre Nachricht.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className={`contact-card fade-up ${isVisible ? 'visible' : ''}`}>
              <div className="contact-icon">
                <Mail width={28} height={28} />
              </div>
              <h3>E-Mail</h3>
              <p>info@proudig.de</p>
            </div>

            <div
              className={`contact-card fade-up ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="contact-icon">
                <Pin width={28} height={28} />
              </div>
              <h3>Standort</h3>
              <p>
                Karl-Winkler-Str. 5<br />
                D-04158 Leipzig
              </p>
            </div>
          </div>

          {success ? (
            <div className={`contact-form contact-success fade-up ${isVisible ? 'visible' : ''}`}>
              <div className="success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Vielen Dank für Ihre Nachricht!</h3>
              <p>Wir melden uns in Kürze bei Ihnen.</p>
            </div>
          ) : (
            <form className={`contact-form fade-up ${isVisible ? 'visible' : ''}`} onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Vorname</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Nachname</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">E-Mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Unternehmen</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Nachricht</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                  disabled={loading}
                  maxLength={5000}
                ></textarea>
              </div>

              {/* Honeypot-Feld - versteckt für echte Benutzer */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Wird gesendet...' : 'Nachricht senden'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
