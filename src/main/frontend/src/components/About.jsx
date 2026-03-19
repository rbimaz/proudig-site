import React from 'react';
import { Brain, Code, Shield } from './Icons';
import { useFadeUp } from '../hooks/useFadeUp';

const gesellschafter = [
  {
    name: 'Max Mustermann',
    title: 'Prof. Dr.',
    image: '/team/avatar1.svg',
    fokus: 'Künstliche Intelligenz & Machine Learning'
  },
  {
    name: 'Maria Musterfrau',
    title: 'Prof. Dr.',
    image: '/team/avatar2.svg',
    fokus: 'Cloud-Architektur & Digitale Plattformen'
  },
  {
    name: 'Thomas Schmidt',
    title: 'Dr.-Ing.',
    image: '/team/avatar3.svg',
    fokus: 'Software Engineering & DevOps'
  },
  {
    name: 'Anna Weber',
    title: 'Prof. Dr.-Ing.',
    image: '/team/avatar4.svg',
    fokus: 'Medizininformatik & Datenschutz'
  },
  {
    name: 'Stefan Braun',
    title: 'Dr. rer. nat.',
    image: '/team/avatar5.svg',
    fokus: 'Prozessautomatisierung & ERP-Systeme'
  },
  {
    name: 'Julia Fischer',
    title: 'Prof. Dr.',
    image: '/team/avatar6.svg',
    fokus: 'Digitale Strategie & Change Management'
  }
];

export const About = () => {
  const { ref, isVisible } = useFadeUp();

  const cards = [
    {
      icon: Brain,
      title: 'Künstliche Intelligenz',
      description: 'Anwendung von Machine Learning und KI-Systemen für intelligente Lösungen.'
    },
    {
      icon: Code,
      title: 'Software Engineering',
      description: 'Architektur und Entwicklung von robusten, skalierbaren Softwaresystemen.'
    },
    {
      icon: Shield,
      title: 'Medizininformatik',
      description: 'Spezialisierung auf sichere, konforme Systeme im Gesundheitswesen.'
    }
  ];

  return (
    <section className="about" id="ueber" ref={ref}>
      <div className={`section-container ${isVisible ? 'visible' : ''}`}>
        <div className="section-header">
          <p className="section-tag">ÜBER UNS</p>
          <h2>Unser Team - Ihre Partner auf Augenhöhe</h2>
        </div>

        <p className="about-description">
          Digitalisierung ist Vertrauenssache. Deshalb setzen wir auf persönliche Zusammenarbeit und direkte Kommunikation. Unsere Gesellschafter bringen nicht nur fundiertes Know-how mit, sondern begleiten Projekte aktiv und mit echter Hands-on Mentalität.
        </p>

        <div className="team-grid">
          {gesellschafter.map((person, index) => (
            <div
              key={index}
              className={`team-card fade-up ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="team-card-inner">
                <div className="team-card-front">
                  <div className="team-card-img">
                    <img src={person.image} alt={person.name} />
                  </div>
                  <div className="team-card-info">
                    <span className="team-card-title">{person.title}</span>
                    <h3 className="team-card-name">{person.name}</h3>
                  </div>
                </div>
                <div className="team-card-back">
                  <span className="team-card-fokus-label">Fokus</span>
                  <p className="team-card-fokus">{person.fokus}</p>
                  <span className="team-card-back-name">{person.title} {person.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="about-cards">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`about-card fade-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${(index + 6) * 50}ms` }}
              >
                <div className="about-card-icon">
                  <Icon width={28} height={28} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
