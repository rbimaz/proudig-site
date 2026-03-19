import React, { useState } from 'react';
import { Mail, Phone, Pin } from './Icons';
import { useFadeUp } from '../hooks/useFadeUp';

export const Contact = () => {
  const { ref, isVisible } = useFadeUp();
  const [formData, setFormData] = useState({
    vorname: '',
    nachname: '',
    email: '',
    unternehmen: '',
    nachricht: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    setFormData({
      vorname: '',
      nachname: '',
      email: '',
      unternehmen: '',
      nachricht: ''
    });
  };

  return (
    <section className="contact" id="kontakt" ref={ref}>
      <div className={`section-container ${isVisible ? 'visible' : ''}`}>
        <div className="section-header contact-header">
          <h2 className="section-title">Kontakt</h2>
          <p>Wir freuen uns auf Ihre Nachricht.</p>
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
              style={{ transitionDelay: '50ms' }}
            >
              <div className="contact-icon">
                <Phone width={28} height={28} />
              </div>
              <h3>Telefon</h3>
              <p>+49 (0) 711 123 456 78</p>
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
                Musterstraße 123<br />
                70173 Stuttgart
              </p>
            </div>
          </div>

          <form className={`contact-form fade-up ${isVisible ? 'visible' : ''}`} onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vorname">Vorname</label>
                <input
                  type="text"
                  id="vorname"
                  name="vorname"
                  value={formData.vorname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nachname">Nachname</label>
                <input
                  type="text"
                  id="nachname"
                  name="nachname"
                  value={formData.nachname}
                  onChange={handleChange}
                  required
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="unternehmen">Unternehmen</label>
              <input
                type="text"
                id="unternehmen"
                name="unternehmen"
                value={formData.unternehmen}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nachricht">Nachricht</label>
              <textarea
                id="nachricht"
                name="nachricht"
                value={formData.nachricht}
                onChange={handleChange}
                rows="6"
                required
              ></textarea>
            </div>

            {/*<div className="form-note">
              <p>
                Wir verarbeiten Ihre Daten gemäß unserer Datenschutzerklärung. Ihre Daten sind bei uns sicher.
              </p>
            </div>*/}

            <button type="submit" className="btn btn-primary">
              Nachricht senden
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
