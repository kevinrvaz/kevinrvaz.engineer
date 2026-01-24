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

  .about-text {
    position: relative;
    padding: 2rem;
    background: rgba(10, 10, 20, 0.8);
    border: 3px solid #00ffff;
    box-shadow: 8px 8px 0 #ff00ff;
  }

  .about-text::before {
    content: 'ABOUT';
    position: absolute;
    top: -15px;
    left: 20px;
    background: #ffff00;
    color: #000;
    padding: 0.25rem 1rem;
    font-weight: 900;
    font-size: 0.8rem;
    letter-spacing: 2px;
  }

  .about-text p {
    margin-bottom: 1.25rem;
    color: #a1a1aa;
    font-size: 1.05rem;
    line-height: 1.8;
    position: relative;
  }

  .about-text p:first-child::first-letter {
    font-size: 3rem;
    font-weight: 900;
    float: left;
    margin-right: 0.5rem;
    line-height: 1;
    color: #ff00ff;
    text-shadow: 2px 2px 0 #00ffff;
  }

  .about-text strong {
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }

  .about-highlights {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .highlight-card {
    background: rgba(10, 10, 20, 0.9);
    border: 3px solid transparent;
    border-radius: 0;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  .highlight-card:nth-child(1) {
    border-color: #ff00ff;
    box-shadow: 5px 5px 0 #00ffff;
  }

  .highlight-card:nth-child(2) {
    border-color: #00ffff;
    box-shadow: 5px 5px 0 #ffff00;
  }

  .highlight-card:nth-child(3) {
    border-color: #ffff00;
    box-shadow: 5px 5px 0 #ff00ff;
  }

  .highlight-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  .highlight-card:hover::before {
    left: 100%;
  }

  .highlight-card:hover {
    transform: translate(-5px, -5px) scale(1.05);
  }

  .highlight-card:nth-child(1):hover {
    box-shadow: 10px 10px 0 #00ffff;
  }

  .highlight-card:nth-child(2):hover {
    box-shadow: 10px 10px 0 #ffff00;
  }

  .highlight-card:nth-child(3):hover {
    box-shadow: 10px 10px 0 #ff00ff;
  }

  .number {
    display: block;
    font-size: 3rem;
    font-weight: 900;
    color: #fff;
    text-shadow:
      -2px -2px 0 #ff00ff,
      2px 2px 0 #00ffff;
    animation: number-glitch 5s infinite;
  }

  @keyframes number-glitch {
    0%, 100% {
      text-shadow:
        -2px -2px 0 #ff00ff,
        2px 2px 0 #00ffff;
    }
    25% {
      text-shadow:
        2px -2px 0 #ff00ff,
        -2px 2px 0 #00ffff;
    }
    50% {
      text-shadow:
        -2px 2px 0 #ff00ff,
        2px -2px 0 #00ffff;
    }
    75% {
      text-shadow:
        2px 2px 0 #ff00ff,
        -2px -2px 0 #00ffff;
    }
  }

  .label {
    color: #fff;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    margin-top: 0.5rem;
    display: block;
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

    .about-text p:first-child::first-letter {
      font-size: 2rem;
    }
  }
</style>
