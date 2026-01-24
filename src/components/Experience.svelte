<script>
  const experiences = [
    {
      title: 'Senior Software Engineer',
      company: 'SmartBear',
      period: 'June 2025 - Present',
      location: 'Bengaluru, Karnataka, India',
      description: [
        'Working as part of the Swagger Contract Testing AI team',
        'Working on the smartbear-mcp project',
        'Working on PactFlow AI features',
        'Contributor to OSS projects of SmartBear and pact-foundation'
      ]
    },
    {
      title: 'Senior Software Engineer',
      company: 'Blackhawk Network India',
      period: 'March 2024 - June 2025',
      location: 'Bengaluru, Karnataka, India',
      description: [
        'Tech Lead of a team focused on finding use cases of Generative AI within the organisation',
        'Built an AI system based on LLMs to assist users in creating promotions using Agents and RAG approach',
        'Worked on fine-tuning LLMs to work for specific tasks',
        'Conducted internal sessions on building applications with LLMs and Agentic AI solutions',
        'Setup 5 engineering teams for platform & emerging channels divisions',
        'Built common marketing promotion engine for Blackhawk Network'
      ]
    },
    {
      title: 'Software Engineer II',
      company: 'Blackhawk Network India',
      period: 'April 2022 - March 2024',
      location: 'Bengaluru, Karnataka, India',
      description: [
        'Built frontend for a rule engine to make promotions for consumer facing applications',
        'Built a rule engine to evaluate promotions for consumer facing applications',
        'Built backend services and frontend for managing multi-language text on consumer applications',
        'Integrated behaviour analytics and A/B Testing tools on consumer applications',
        'Worked as L3 on-call engineer to support and fix critical issues'
      ]
    },
    {
      title: 'Software Engineer',
      company: 'Blackhawk Network India',
      period: 'August 2020 - April 2022',
      location: 'Bengaluru, Karnataka, India',
      description: [
        'Worked on i18n number formatting, multi-decimal currency support, and address support',
        'Integrated Adyen web drop-in payment method in consumer facing applications',
        'Built CLI tool to automate collection of test results from webdriver.io',
        'Improved merchant website generation time and onboarding process',
        'Part of Security ambassador program ensuring secure code practices'
      ]
    },
    {
      title: 'Student Developer',
      company: 'Crio.Do',
      period: 'January 2020 - August 2020',
      location: 'Remote',
      description: [
        'Built backend APIs during Crio Launch Plus\'20 program',
        'Used BASH scripting for system monitoring and network packet analysis',
        'Built a visual stock portfolio analyzer using Tiingo API',
        'Learned to break down algorithmic problems into reusable chunks'
      ]
    },
    {
      title: 'Python Development Intern',
      company: 'Moodboard Analytics',
      period: 'October 2019 - December 2019',
      location: 'India',
      description: [
        'Built keyword-search based social website scrapers',
        'Built Openschema scraper parsing microdata, json-ld, opengraph implementations',
        'Applied Python automation scripting for web-scraping and data serialization',
        'Used Selenium for browser automation with dynamic JavaScript loading'
      ]
    }
  ];
</script>

<section id="experience">
  <h2>Experience</h2>
  <div class="timeline">
    {#each experiences as exp, i}
      <div class="timeline-item" style="animation-delay: {i * 0.2}s">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <div>
              <h3>{exp.title}</h3>
              <p class="company">{exp.company}</p>
            </div>
            <div class="meta">
              <span class="period">{exp.period}</span>
              <span class="location">{exp.location}</span>
            </div>
          </div>
          <ul>
            {#each exp.description as item}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .timeline {
    position: relative;
    padding-left: 3rem;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #ff00ff, #00ffff, #ffff00, transparent);
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
  }

  .timeline-item {
    position: relative;
    margin-bottom: 3rem;
    opacity: 0;
    animation: slideInComic 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .timeline-item:nth-child(odd) {
    animation-name: slideInLeft;
  }

  .timeline-item:nth-child(even) {
    animation-name: slideInRight;
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px) rotate(-2deg);
    }
    to {
      opacity: 1;
      transform: translateX(0) rotate(0deg);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px) rotate(2deg);
    }
    to {
      opacity: 1;
      transform: translateX(0) rotate(0deg);
    }
  }

  @keyframes slideInComic {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .timeline-marker {
    position: absolute;
    left: -3.5rem;
    top: 0.5rem;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #ff00ff, #00ffff);
    box-shadow:
      0 0 20px rgba(255, 0, 255, 0.8),
      0 0 40px rgba(0, 255, 255, 0.5);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    animation: pulse-marker 2s ease-in-out infinite;
  }

  @keyframes pulse-marker {
    0%, 100% {
      transform: scale(1) rotate(0deg);
      box-shadow:
        0 0 20px rgba(255, 0, 255, 0.8),
        0 0 40px rgba(0, 255, 255, 0.5);
    }
    50% {
      transform: scale(1.2) rotate(45deg);
      box-shadow:
        0 0 30px rgba(255, 0, 255, 1),
        0 0 60px rgba(0, 255, 255, 0.8);
    }
  }

  .timeline-content {
    background: rgba(10, 10, 20, 0.9);
    border: 3px solid #00ffff;
    border-radius: 0;
    padding: 1.5rem;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    box-shadow: 6px 6px 0 #ff00ff;
  }

  .timeline-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(255, 0, 255, 0.1), transparent 50%);
    pointer-events: none;
  }

  .timeline-content:hover {
    border-color: #ffff00;
    transform: translate(-4px, -4px);
    box-shadow: 10px 10px 0 #ff00ff;
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  h3 {
    font-size: 1.4rem;
    color: #fff;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 2px 2px 0 #ff00ff;
  }

  .company {
    color: #00ffff;
    font-weight: 700;
    font-size: 1.1rem;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  .meta {
    text-align: right;
  }

  .period {
    display: inline-block;
    background: linear-gradient(135deg, #ff00ff, #00ffff);
    color: #000;
    padding: 0.25rem 0.75rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .location {
    color: #a1a1aa;
    font-size: 0.85rem;
    display: block;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
  }

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    color: #a1a1aa;
    transition: all 0.3s ease;
  }

  li:hover {
    color: #fff;
    transform: translateX(5px);
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 8px;
    height: 8px;
    background: #ffff00;
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  }

  @media (max-width: 600px) {
    .timeline-header {
      flex-direction: column;
    }

    .meta {
      text-align: left;
    }

    .timeline {
      padding-left: 2rem;
    }

    .timeline-marker {
      left: -2.5rem;
      width: 16px;
      height: 16px;
    }
  }
</style>
