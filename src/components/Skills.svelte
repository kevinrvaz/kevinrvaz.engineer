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
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .skill-category {
    background: rgba(26, 26, 46, 0.6);
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .skill-category:hover {
    border-color: #00d4ff;
  }

  .skill-category h3 {
    font-size: 1.1rem;
    color: #00d4ff;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .skill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .skill {
    background: rgba(0, 212, 255, 0.08);
    color: #e4e4e7;
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    font-size: 0.9rem;
    border: 1px solid rgba(0, 212, 255, 0.2);
    transition: all 0.3s ease;
  }

  .skill:hover {
    background: rgba(0, 212, 255, 0.15);
    border-color: #00d4ff;
  }

  .achievements-title {
    font-size: 1.5rem;
    color: #e4e4e7;
    margin-bottom: 1.5rem;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .achievement {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(26, 26, 46, 0.4);
    border: 1px solid #27272a;
    border-radius: 10px;
    padding: 1rem;
    transition: all 0.3s ease;
  }

  .achievement:hover {
    border-color: #00ffcc;
    transform: translateY(-2px);
  }

  .achievement-icon {
    font-size: 2rem;
  }

  .achievement h4 {
    font-size: 0.95rem;
    color: #e4e4e7;
    margin-bottom: 0.25rem;
  }

  .achievement p {
    font-size: 0.8rem;
    color: #71717a;
  }
</style>
