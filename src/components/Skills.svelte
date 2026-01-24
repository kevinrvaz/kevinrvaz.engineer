<script>
  const skillCategories = [
    {
      title: 'Languages',
      skills: ['Python', 'JavaScript', 'Java', 'Hack Language']
    },
    {
      title: 'Frameworks & Libraries',
      skills: ['React', 'Node.js', 'Django', 'Spring Boot', 'TensorFlow', 'Langchain']
    },
    {
      title: 'AI & Machine Learning',
      skills: ['Generative AI', 'LLMs', 'Deep Learning', 'NLP', 'Computer Vision']
    },
    {
      title: 'Tools & Platforms',
      skills: ['Git', 'Docker', 'VS Code', 'Godot', 'Jupyter', 'PyPI']
    }
  ];

  const achievements = [
    { icon: '🏔️', title: 'Arctic Code Vault Contributor', description: 'Code preserved in Arctic vault' },
    { icon: '🦈', title: 'Pull Shark x2', description: 'Multiple merged PRs' },
    { icon: '👥', title: 'Pair Extraordinaire', description: 'Collaborative coding' },
    { icon: '⚡', title: 'Quickdraw', description: 'Fast issue resolution' },
    { icon: '⭐', title: 'Starstruck', description: 'Popular repositories' }
  ];
</script>

<section id="skills">
  <h2>Skills & Technologies</h2>

  <div class="skills-grid">
    {#each skillCategories as category}
      <div class="skill-category">
        <h3>{category.title}</h3>
        <div class="skill-list">
          {#each category.skills as skill}
            <span class="skill">{skill}</span>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <h3 class="achievements-title">GitHub Achievements</h3>
  <div class="achievements-grid">
    {#each achievements as achievement}
      <div class="achievement">
        <span class="achievement-icon">{achievement.icon}</span>
        <div>
          <h4>{achievement.title}</h4>
          <p>{achievement.description}</p>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
    perspective: 1000px;
  }

  .skill-category {
    background: rgba(10, 10, 20, 0.9);
    border: 3px solid #00ffff;
    border-radius: 0;
    padding: 1.5rem;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    box-shadow: 6px 6px 0 #ff00ff;
    transform-style: preserve-3d;
    animation: card-float 6s ease-in-out infinite;
    animation-delay: calc(var(--i, 0) * 0.5s);
  }

  .skill-category:nth-child(1) { --i: 0; }
  .skill-category:nth-child(2) { --i: 1; }
  .skill-category:nth-child(3) { --i: 2; }
  .skill-category:nth-child(4) { --i: 3; }

  @keyframes card-float {
    0%, 100% {
      transform: translateY(0) rotateX(0deg) rotateY(0deg);
    }
    25% {
      transform: translateY(-5px) rotateX(2deg) rotateY(-2deg);
    }
    75% {
      transform: translateY(-10px) rotateX(-2deg) rotateY(2deg);
    }
  }

  .skill-category::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
    background-size: 400% 400%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: gradient-shift 3s ease infinite;
  }

  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .skill-category:hover::before {
    opacity: 1;
  }

  .skill-category:hover {
    transform: translate(-6px, -6px) scale(1.02);
    box-shadow: 12px 12px 0 #ff00ff;
    border-color: #ffff00;
  }

  .skill-category h3 {
    font-size: 1.2rem;
    color: #fff;
    margin-bottom: 1.25rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
    display: inline-block;
  }

  .skill-category h3::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #ff00ff, #00ffff);
  }

  .skill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .skill {
    background: transparent;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0;
    font-size: 0.9rem;
    font-weight: 600;
    border: 2px solid #00ffff;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    cursor: default;
  }

  .skill::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  .skill:hover::before {
    left: 100%;
  }

  .skill:hover {
    background: #00ffff;
    color: #000;
    border-color: #00ffff;
    transform: scale(1.1) rotate(-2deg);
    box-shadow: 4px 4px 0 #ff00ff;
  }

  .achievements-title {
    font-size: 1.8rem;
    color: #fff;
    margin-bottom: 2rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 3px 3px 0 #ff00ff;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .achievement {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(10, 10, 20, 0.8);
    border: 3px solid transparent;
    border-image: linear-gradient(135deg, #ff00ff, #00ffff) 1;
    border-radius: 0;
    padding: 1.25rem;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  .achievement::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 0, 255, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .achievement:hover::after {
    opacity: 1;
  }

  .achievement:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow:
      0 10px 30px rgba(255, 0, 255, 0.3),
      0 0 20px rgba(0, 255, 255, 0.2);
  }

  .achievement-icon {
    font-size: 2.5rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.5));
    animation: icon-bounce 2s ease-in-out infinite;
  }

  @keyframes icon-bounce {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-5px) rotate(5deg); }
  }

  .achievement h4 {
    font-size: 1rem;
    color: #fff;
    margin-bottom: 0.25rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .achievement p {
    font-size: 0.85rem;
    color: #a1a1aa;
  }

  @media (max-width: 600px) {
    .skill-category {
      animation: none;
    }
  }
</style>
