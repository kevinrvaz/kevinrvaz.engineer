<script>
  const projects = [
    {
      title: 'MinervaAIStudio',
      description: 'An AI assistant for creative tasks that generates and edits images, video, audio, and 3D structures using open-weight models.',
      tags: ['AI', 'Generative AI', 'Creative Tools'],
      github: 'https://github.com/kevinrvaz/MinervaAIStudio',
      featured: true
    },
    {
      title: 'm3u8-dl',
      description: 'A Python CLI tool for downloading videos from HLS streaming playlists, featuring multi-threaded downloading and ffmpeg integration. Available on PyPI and Docker Hub.',
      tags: ['Python', 'CLI', 'Video Processing'],
      github: 'https://github.com/kevinrvaz/m3u8-dl',
      stars: 75,
      featured: true
    },
    {
      title: 'gpt2-from-scratch',
      description: 'An educational implementation of GPT-2 based on "Building an LLM from Scratch." Demonstrates deep understanding of transformer architectures.',
      tags: ['LLM', 'Python', 'Jupyter Notebook', 'Deep Learning'],
      github: 'https://github.com/kevinrvaz/gpt2-from-scratch',
      featured: true
    },
    {
      title: 'HackComputer',
      description: 'An in-progress implementation of a 16-bit computer following "The Elements of Computing Systems" (Nand2Tetris).',
      tags: ['Hack Language', 'Computer Architecture', 'Low-level'],
      github: 'https://github.com/kevinrvaz/HackComputer',
      featured: false
    },
    {
      title: 'local-llm-tests',
      description: 'Testing and experimentation with Langchain for local LLM deployment and usage.',
      tags: ['Langchain', 'LLM', 'Jupyter Notebook'],
      github: 'https://github.com/kevinrvaz/local-llm-tests',
      featured: false
    },
    {
      title: 'TappyPlaneGodot',
      description: 'A 2D game built with Godot Engine, showcasing game development skills with GDScript.',
      tags: ['Godot', 'GDScript', 'Game Dev'],
      github: 'https://github.com/kevinrvaz/TappyPlaneGodot',
      featured: false
    }
  ];

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);
</script>

<section id="projects">
  <h2>Featured Projects</h2>

  <div class="featured-grid">
    {#each featuredProjects as project}
      <article class="project-card featured">
        <div class="project-header">
          <svg class="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
          <div class="project-links">
            <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <h3>{project.title}</h3>
        {#if project.stars}
          <span class="stars">★ {project.stars}</span>
        {/if}
        <p>{project.description}</p>
        <div class="tags">
          {#each project.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      </article>
    {/each}
  </div>

  <h3 class="section-subtitle">Other Projects</h3>
  <div class="other-grid">
    {#each otherProjects as project}
      <article class="project-card">
        <div class="project-header">
          <svg class="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
          <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>
        <h4>{project.title}</h4>
        <p>{project.description}</p>
        <div class="tags">
          {#each project.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      </article>
    {/each}
  </div>

  <div class="more-projects">
    <a href="https://github.com/kevinrvaz?tab=repositories" target="_blank" rel="noopener noreferrer" class="view-more">
      View All 51 Repositories on GitHub →
    </a>
  </div>
</section>

<style>
  .featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .project-card {
    background: rgba(26, 26, 46, 0.6);
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 1.75rem;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .project-card:hover {
    border-color: #00d4ff;
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .project-card.featured {
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.8));
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .folder-icon {
    width: 40px;
    height: 40px;
    color: #00d4ff;
  }

  .project-links {
    display: flex;
    gap: 0.75rem;
  }

  .project-links a,
  .project-header > a {
    color: #a1a1aa;
    transition: color 0.3s ease;
  }

  .project-links a:hover,
  .project-header > a:hover {
    color: #00d4ff;
  }

  h3 {
    font-size: 1.35rem;
    color: #e4e4e7;
    margin-bottom: 0.5rem;
  }

  h4 {
    font-size: 1.1rem;
    color: #e4e4e7;
    margin-bottom: 0.75rem;
  }

  .stars {
    color: #ffd700;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
    display: inline-block;
  }

  p {
    color: #a1a1aa;
    font-size: 0.95rem;
    flex-grow: 1;
    margin-bottom: 1.25rem;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }

  .tag {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-family: 'Fira Code', monospace;
  }

  .section-subtitle {
    font-size: 1.5rem;
    color: #e4e4e7;
    margin-bottom: 1.5rem;
  }

  .other-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .more-projects {
    text-align: center;
    margin-top: 2rem;
  }

  .view-more {
    display: inline-block;
    padding: 0.875rem 2rem;
    border: 1px solid #00d4ff;
    border-radius: 8px;
    color: #00d4ff;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .view-more:hover {
    background: rgba(0, 212, 255, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 400px) {
    .featured-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
