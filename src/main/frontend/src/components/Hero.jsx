import React from 'react';
import { ArrowRight, ChevronDown } from './Icons';
import { HeroOrb } from './HeroOrb';
import { HeroImage } from './HeroImage';
import { HeroCode } from './HeroCode';
import { HeroSaas } from './HeroSaas';
import { HeroSaasAnim } from './HeroSaasAnim';
import { HeroImageBlue } from './HeroImageBlue';
import { HeroAoeDash } from './HeroAoeDash';

export const Hero = ({ theme }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const isDark = theme === 'dark';
  const isBlue = theme === 'blue';
  const isImage = theme === 'image';
  const isCoder = theme === 'coder';
  const isSaas = theme === 'saas';
  const isImageBlue = theme === 'imageblue';
  const isAoe2Dash = theme === 'aoe2dash';
  const isUdig2 = theme === 'udig2';

  const heroClass = isUdig2 ? 'hero-udig2'
    : isAoe2Dash ? 'hero-aoe2dash'
    : isImageBlue ? 'hero-image'
    : isSaas ? 'hero-saas'
    : isCoder ? 'hero-coder'
    : isImage ? 'hero-image'
    : isBlue ? 'hero-blue'
    : isDark ? 'hero-dark'
    : 'hero-light';

  /* UDig2 variant: dark navy-teal, concentric rings, orange accent */
  if (isUdig2) {
    return (
      <section className="hero hero-udig2">
        <div className="hero-udig2-rings-bg">
          <svg viewBox="0 0 500 500" className="hero-udig2-rings-svg">
            <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <circle cx="250" cy="250" r="200" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx="250" cy="250" r="160" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="250" cy="250" r="120" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="80" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="40" fill="none" stroke="#E8731A" strokeWidth="2" opacity="0.6" />
            <circle cx="250" cy="250" r="8" fill="#E8731A" opacity="0.8" />
          </svg>
        </div>
        <div className="container">
          <div className="hero-udig2-content">
            <h1 className="hero-udig2-title fade-up d2">
              Von der Idee zur<br />digitalen <span className="accent-udig2">Wirkung</span>
            </h1>
            <p className="hero-udig2-desc fade-up d3">
              Proudig begleitet Unternehmen bei ihrer digitalen Transformation – mit strategischer
              Beratung, maßgeschneiderter Software und intelligenten KI-Systemen.
            </p>
            <div className="hero-udig2-btns fade-up d4">
              <button className="btn-udig2-primary" onClick={() => scrollTo('kontakt')}>
                Beratungsgespräch <ArrowRight width={18} height={18} />
              </button>
              <button className="btn-udig2-secondary" onClick={() => scrollTo('leistungen')}>
                Leistungen entdecken
              </button>
            </div>
          </div>
        </div>
        <a className="scroll-ind" onClick={() => scrollTo('leistungen')}>
          <span>Entdecken</span>
          <ChevronDown width={20} height={20} />
        </a>
      </section>
    );
  }

  /* AOE2Dash variant: AOE dark bg + dashboard from V15 */
  if (isAoe2Dash) {
    return (
      <section className="hero hero-aoe2dash">
        <div className="container">
          <div className="hero-aoe2dash-text">
            <h1 className="hero-aoe2dash-title fade-up d2">
              Von der Idee zur digitalen Wirkung
            </h1>
            <p className="hero-aoe2dash-desc fade-up d3">
              Proudig begleitet Unternehmen bei ihrer digitalen Transformation – mit strategischer
              Beratung, maßgeschneiderter Software und intelligenten KI-Systemen.
            </p>
            <button className="btn-aoe2dash-cta fade-up d4" onClick={() => scrollTo('kontakt')}>
              Beratungsgespräch <ArrowRight width={20} height={20} />
            </button>
          </div>
          <div className="hero-aoe2dash-visual fade-up d3">
            <HeroAoeDash />
          </div>
        </div>
        <a className="scroll-ind" onClick={() => scrollTo('leistungen')}>
          <span>Entdecken</span>
          <ChevronDown width={20} height={20} />
        </a>
      </section>
    );
  }

  /* SaaS variant: light, dashboard mockup + phone overlay */
  if (isSaas) {
    return (
      <section className="hero hero-saas">
        <div className="container">
          <div className="hero-saas-grid">
            <div className="hero-saas-text">
              <div className="hero-saas-badge fade-up d1">BERATUNG · SOFTWARE · KI · SCHULUNGEN</div>
              
              <h1 className="hero-saas-title fade-up d2">
                Von der Idee <br />zur digitalen <br />
                <span className="saas-accent">Wirkung</span><br />
              </h1>
              <p className="hero-saas-desc fade-up d3">
                Proudig begleitet Unternehmen bei ihrer digitalen Transformation – mit strategischer Beratung, maßgeschneiderter Software und intelligenten <br />KI-Systemen.

              </p>
              <div className="hero-saas-btns fade-up d4">
                <button className="btn-saas-primary" onClick={() => scrollTo('kontakt')}>
                  Beratungsgespräch <ArrowRight width={16} height={16} />
                </button>
                <button className="btn-saas-secondary" onClick={() => scrollTo('leistungen')}>
                  Leistungen entdecken
                </button>
              </div>
            </div>
            <div className="hero-saas-mockup fade-up d3">
              <HeroImageBlue />
            </div>
          </div>
        </div>
        <a className="scroll-ind" onClick={() => scrollTo('leistungen')}>
          <span>Entdecken</span>
          <ChevronDown width={20} height={20} />
        </a>
      </section>
    );
  }

  /* Coder variant: light, CoderPro-inspired with tech illustration */
  if (isCoder) {
    return (
      <section className="hero hero-coder">
        <div className="container">
          <div className="hero-coder-text">
            <h1 className="hero-coder-title fade-up d2">
              Von der Idee zur digitalen Wirkung
            </h1>
            <p className="hero-coder-desc fade-up d3">
              Proudig begleitet Unternehmen bei ihrer digitalen Transformation – mit strategischer
              Beratung, maßgeschneiderter Software und intelligenten KI-Systemen.
            </p>
            <div className="hero-coder-btns fade-up d4">
              <button className="btn-coder-primary" onClick={() => scrollTo('kontakt')}>
                Beratungsgespräch <ArrowRight width={16} height={16} />
              </button>
              <button className="btn-coder-secondary" onClick={() => scrollTo('leistungen')}>
                Leistungen entdecken
              </button>
            </div>
          </div>
          <div className="hero-coder-visual fade-up d3">
            <HeroCode />
          </div>
        </div>
        <a className="scroll-ind" onClick={() => scrollTo('leistungen')}>
          <span>Entdecken</span>
          <ChevronDown width={20} height={20} />
        </a>
      </section>
    );
  }

  return (
    <section className={`hero ${heroClass}`}>
      {(isDark || isBlue) && (
        <>
          <div className="hero-overlay"></div>
          <div className="hero-grid-bg"></div>
          <div className="hero-blob-1"></div>
          <div className="hero-blob-2"></div>
        </>
      )}
      {theme === 'light' && <div className="hero-bg-gradient"></div>}

      <div className="container">
        <div className="hero-content">
          <div>
            <div className="hero-badge fade-up d1">BERATUNG · SOFTWARE · KI · SCHULUNGEN</div>
            <h1 className="hero-title fade-up d2">
              Von der Idee<br />zur digitalen <span className="accent">Wirkung</span>.
            </h1>
            <p className="hero-desc fade-up d3">
              Wir begleiten Unternehmen bei der digitalen Transformation — mit maßgeschneiderter
              Softwareentwicklung, KI-Systemen und strategischer Beratung. Gegründet von Professoren,
              getrieben von Innovation.
            </p>
            <div className="hero-btns fade-up d4">
              {(isImage || isImageBlue) ? (
                <>
                  <button className="btn-hero-img-primary" onClick={() => scrollTo('kontakt')}>Kostenloses Erstgespräch</button>
                  <button className="btn-hero-img-secondary" onClick={() => scrollTo('leistungen')}>
                    Leistungen entdecken <ArrowRight width={18} height={18} />
                  </button>
                </>
              ) : isBlue ? (
                <>
                  <button className="btn-hero-blue-primary" onClick={() => scrollTo('kontakt')}>Kostenloses Erstgespräch</button>
                  <button className="btn-hero-blue-secondary" onClick={() => scrollTo('leistungen')}>
                    Leistungen entdecken <ArrowRight width={18} height={18} />
                  </button>
                </>
              ) : isDark ? (
                <>
                  <button className="btn-hero-primary" onClick={() => scrollTo('kontakt')}>Kostenloses Erstgespräch</button>
                  <button className="btn-hero-secondary" onClick={() => scrollTo('leistungen')}>
                    Leistungen entdecken <ArrowRight width={18} height={18} />
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-primary" onClick={() => scrollTo('kontakt')}>Kostenloses Erstgespräch</button>
                  <button className="btn-secondary" onClick={() => scrollTo('leistungen')}>
                    Leistungen entdecken <ArrowRight width={18} height={18} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hero-visual fade-up d3">
            {isImageBlue ? <HeroImageBlue /> : isImage ? <HeroImage /> : <HeroOrb theme={theme} />}
          </div>
        </div>
      </div>

      <a className="scroll-ind" onClick={() => scrollTo('leistungen')}>
        <span>Entdecken</span>
        <ChevronDown width={20} height={20} />
      </a>
    </section>
  );
};
