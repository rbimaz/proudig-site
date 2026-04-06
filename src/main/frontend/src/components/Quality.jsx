import React from 'react';
import { Shield, Cpu, Activity, Users } from './Icons';
import { useFadeUp } from '../hooks/useFadeUp';

export const Quality = () => {
  const { ref, isVisible } = useFadeUp();

  const features = [
    {
      icon: Shield,
      title: 'DSGVO-konform',
      description: 'Alle Systeme von Grund auf mit Datenschutz im Fokus entwickelt.'
    },
    {
      icon: Cpu,
      title: 'Innovative Technologien',
      description: 'Aktuelle Frameworks und Methoden, direkt aus der Forschung.'
    },
    {
      icon: Activity,
      title: 'Forschungstransfer',
      description: 'Wissenschaftliche Erkenntnisse in praktische Anwendungen übertragen.'
    },
    {
      icon: Users,
      title: 'Agile Qualitätssicherung',
      description: 'Kontinuierliche Tests, Reviews und iterative Verbesserungen.'
    }
  ];

  return (
    <section className="quality" ref={ref}>
      <div className={`section-container ${isVisible ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">QUALITÄT & INNOVATION</span>
          <h2 className="section-title">Innovative Technologien. Höchste Qualitätsansprüche.</h2>
          <p className="section-subtitle">Forschungsnah, DSGVO-konform und agil – von der Idee bis zum Betrieb.</p>
        </div>

        <div className="quality-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`quality-item fade-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="quality-icon">
                  <Icon width={32} height={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
