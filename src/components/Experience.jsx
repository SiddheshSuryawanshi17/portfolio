import { experience, skills } from '../data/content'

export default function Experience() {
  return (
    <>
      <section className="section" id="experience" data-theme="light">
        <div className="section-head mono">
          <h2>(03) Experience</h2>
          <span className="muted">Where I’ve worked</span>
        </div>
        <div className="exp">
          {experience.map((e) => (
            <div className="exp__row" key={e.role + e.company} data-reveal>
              <div className="mono muted">{e.period}</div>
              <div>
                <h3 className="exp__role">{e.role}</h3>
                <div className="exp__company">{e.company}</div>
              </div>
              <ul className="exp__points">
                {e.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <div className="exp__place mono muted">{e.place}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="skills" style={{ paddingTop: 0 }} data-theme="light">
        <div className="section-head mono">
          <h2>(04) Toolkit</h2>
          <span className="muted">What I work with</span>
        </div>
        <div className="skills">
          {skills.map((s) => (
            <div className="skill-col" key={s.group} data-reveal>
              <h3 className="mono muted">{s.group}</h3>
              <ul>
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
