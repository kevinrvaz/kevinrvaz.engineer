<section id="about">
  <h2>About Me</h2>
  <div class="about-content">
    <div class="about-text">
      <p>
        I'm a Senior Software Engineer with expertise spanning backend development,
        machine learning, and generative AI. My career trajectory shows consistent growth
        from student developer to senior engineer, with a notable shift toward AI technologies
        in recent years.
      </p>
      <p>
        I earned my <strong>Bachelor of Technology in Computer Science and Engineering from
        SRM University</strong> in 2020. My journey began during my studies with developer
        positions at Crio.do (building backend APIs using Spring Boot) and Moodboard Analytics
        (a startup providing AI-driven insights for fashion and beauty retail).
      </p>
      <p>
        Currently at <strong>SmartBear</strong>, I work as part of the Swagger Contract Testing AI team,
        contributing to the smartbear-mcp project and PactFlow AI features. I'm also a contributor
        to OSS projects of SmartBear and pact-foundation.
      </p>
      <p>
        I maintain an active open source presence with <strong>51 GitHub repositories</strong>
        and have been recognized as an <strong>Arctic Code Vault Contributor</strong>.
      </p>
    </div>
    <div class="about-highlights">
      <div class="highlight-card">
        <span class="number">5+</span>
        <span class="label">Years Experience</span>
      </div>
      <div class="highlight-card">
        <span class="number">51</span>
        <span class="label">GitHub Repos</span>
      </div>
      <div class="highlight-card">
        <span class="number">OSS</span>
        <span class="label">Contributor</span>
      </div>
    </div>
  </div>
</section>

<style>
  .about-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .about-text p {
    margin-bottom: 1.25rem;
    color: #a1a1aa;
    font-size: 1.05rem;
  }

  .about-text strong {
    color: #e4e4e7;
  }

  .about-highlights {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .highlight-card {
    background: rgba(26, 26, 46, 0.6);
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
  }

  .highlight-card:hover {
    border-color: #00d4ff;
    transform: translateY(-4px);
  }

  .number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #00d4ff, #00ffcc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .label {
    color: #71717a;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  @media (max-width: 768px) {
    .about-content {
      grid-template-columns: 1fr;
    }

    .about-highlights {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }

    .highlight-card {
      flex: 1;
      min-width: 140px;
    }
  }
</style>
