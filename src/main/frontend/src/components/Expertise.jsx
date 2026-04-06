import React from 'react';
import {
  Brain,
  Smartphone,
  Globe,
  TrendingUp,
  Heart,
  Database
} from './Icons';
import { useFadeUp } from '../hooks/useFadeUp';

export const Expertise = () => {
  const { ref, isVisible } = useFadeUp();

  const items = [
    {
      icon: Brain,
      title: 'KI-Anwendungen',
      description: 'Entwicklung intelligenter, lernender Systeme zur Automatisierung und Optimierung Ihrer Geschäftsprozesse.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Native und plattformübergreifende mobile Anwendungen für iOS und Android mit erstklassiger User Experience.'
    },
    {
      icon: Globe,
      title: 'Web-Entwicklung',
      description: 'Moderne, reaktionsschnelle Webanwendungen, die auf allen Geräten perfekt funktionieren und skalieren.'
    },
    {
      icon: Heart,
      title: 'Digitalisierung in der Medizin',
      description: 'Sichere und konforme digitale Lösungen für das Gesundheitswesen zur Verbesserung der Patientenversorgung.'
    },
    {
      icon: TrendingUp,
      title: 'Digitale Transformation',
      description: 'Strategische Beratung und Begleitung Ihres Unternehmens auf dem Weg in die digitale Zukunft.'
    },
    {
      icon: Database,
      title: 'Daten & Analytics',
      description: 'Nutzung Ihrer Datenpotenziale durch moderne Analyse-Tools und Data-Warehousing-Lösungen.'
    }
  ];

  return (
    <section className="expertise" id="leistungen" ref={ref}>
      <div className={`section-container ${isVisible ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">LEISTUNGEN</span>
          <h2 className="section-title">Unsere Leistungen</h2>
          <p className="section-subtitle">Ihr Partner für die digitale Transformation.</p>
        </div>

        <div className="expertise-grid">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`expertise-card fade-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="expertise-icon">
                  <Icon width={32} height={32} />
                </div>
                <h3 className="expertise-title">{item.title}</h3>
                <p className="expertise-description">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
