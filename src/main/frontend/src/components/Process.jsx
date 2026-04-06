import React from 'react';
import { ArrowRight } from './Icons';
import { useFadeUp } from '../hooks/useFadeUp';

export const Process = () => {
  const { ref, isVisible } = useFadeUp();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const steps = [
    {
      number: '01',
      title: 'Analyse & Workshop',
      description:
        'Wir verstehen Ihre Prozesse, Schnittstellen und Anforderungen — bevor wir eine Zeile Code schreiben.'
    },
    {
      number: '02',
      title: 'Konzept & Prototyp',
      description:
        'Klickbares Konzept und technische Architektur in 2–4 Wochen. Feedback-Schleife mit Ihrem Team.'
    },
    {
      number: '03',
      title: 'Agile Entwicklung',
      description:
        'Zweiwöchige Sprints mit transparentem Fortschritt. Sie sehen jederzeit, woran wir arbeiten.'
    },
    {
      number: '04',
      title: 'Go-Live & Migration',
      description:
        'Strukturiertes Change-Management, Schulungen und reibungsloser Datenübergang — ohne Betriebsunterbrechung.'
    },
    {
      number: '05',
      title: 'Support & Weiter',
      description:
        '24/7-Support, regelmäßige Updates und kontinuierliche Weiterentwicklung nach Ihren Prioritäten.'
    }
  ];

  return (
    <section className="process" id="prozess" ref={ref}>
      <div className={`container ${isVisible ? 'visible' : ''}`}>
        <div className="process-header">
          <span className="process-label">UNSER VORGEHEN</span>
          <h2 className="process-title">Vom ersten Gespräch bis zum laufenden System</h2>
          <p className="section-subtitle">Strukturiert, transparent und auf Ihre Bedürfnisse abgestimmt.</p>
        </div>

        <div className="process-timeline">
          {/* Horizontal connecting line */}
          <div className="process-line" />

          {steps.map((step, index) => (
            <div
              key={index}
              className={`process-step fade-up ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="step-circle">
                <span>{step.number}</span>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>
          ))}
        </div>

        <div className={`process-cta fade-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '600ms' }}>
          <h3 className="process-cta-title">Bereit für den nächsten Schritt?</h3>
          <p className="process-cta-desc">Vereinbaren Sie ein kostenloses, unverbindliches Erstgespräch.</p>
          <button className="process-cta-btn" onClick={() => scrollTo('kontakt')}>
            Kostenloses Erstgespräch <ArrowRight width={18} height={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
