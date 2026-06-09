import React from 'react';
import {
  Presentation,
  MessageSquare,
  FileText,
  BookOpen,
  Code,
  Brain
} from './Icons';
import { useFadeUp } from '../hooks/useFadeUp';

export const Expertise = () => {
  const { ref, isVisible } = useFadeUp();

  const items = [
    {
      icon: Presentation,
      title: 'Vorträge',
      description: 'Inspirierende Fachvorträge zu Digitalisierung, KI und Technologie-Trends.'
    },
    {
      icon: MessageSquare,
      title: 'Beratung',
      description: 'Strategische Technologieberatung und Digitalisierungskonzepte — von der Analyse bis zur Umsetzungsbegleitung.'
    },
    {
      icon: FileText,
      title: 'Studien',
      description: 'Wissenschaftlich fundierte Studien und Analysen zu Markttrends, Technologiebewertungen und Machbarkeit.'
    },
    {
      icon: BookOpen,
      title: 'Weiterbildung',
      description: 'Praxisnahe Schulungen und Workshops für Teams — von KI-Grundlagen bis zu spezialisierten Technologie-Trainings.'
    },
    {
      icon: Code,
      title: 'Software-Lösungen',
      description: 'Maßgeschneiderte Softwareentwicklung — von Web- und Mobilanwendungen bis zu komplexen Unternehmensplattformen.'
    },
    {
      icon: Brain,
      title: 'KI-Anwendungen',
      description: 'Entwicklung intelligenter Systeme mit Machine Learning und generativer KI — von der Idee bis zum produktiven Einsatz.'
    }
  ];

  return (
    <section className="expertise" id="leistungen" ref={ref}>
      <div className={`section-container ${isVisible ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">LEISTUNGEN</span>
          <h2 className="section-title">Unsere Leistungen</h2>
          <p className="section-subtitle">Wissen vermitteln, Lösungen entwickeln, Zukunft gestalten.</p>
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
                  <Icon width={26} height={26} />
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
