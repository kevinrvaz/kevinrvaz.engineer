const codeExamples = [
  { lang: 'python', code: 'model = Sequential([\n    Dense(128, activation="relu"),\n    Dense(10, activation="softmax")\n])' },
  { lang: 'js', code: 'const sum = (a, b) => a + b;' },
  { lang: 'python', code: 'from transformers import GPT2Model\nmodel = GPT2Model.from_pretrained("gpt2")' },
  { lang: 'js', code: 'async function fetchData() {\n  return await api.get();\n}' },
  { lang: 'python', code: 'X_train, X_test = train_test_split(\n    data, test_size=0.2\n)' },
  { lang: 'js', code: 'const arr = [1, 2, 3].map(x => x * 2);' },
  { lang: 'python', code: 'loss = nn.CrossEntropyLoss()\noptimizer = torch.optim.Adam(\n    model.parameters(), lr=0.001\n)' },
  { lang: 'js', code: 'document.querySelector(".btn")\n  .addEventListener("click", fn);' },
  { lang: 'python', code: 'embeddings = model.encode(sentences)\nsimilarity = cosine_similarity(embeddings)' },
  { lang: 'python', code: 'response = openai.ChatCompletion.create(\n    model="gpt-4",\n    messages=messages\n)' },
];

const spawnPositions = [
  { x: 3, y: 5 },
  { x: 75, y: 8 },
  { x: 5, y: 25 },
  { x: 80, y: 30 },
  { x: 3, y: 50 },
  { x: 78, y: 55 },
  { x: 5, y: 75 },
  { x: 75, y: 80 },
];

export function createCodeSnippetManager(onChange) {
  let snippets = [];
  let snippetId = 0;
  let nextPositionIndex = 0;
  let intervalId;

  function getNextPosition() {
    const pos = spawnPositions[nextPositionIndex];
    nextPositionIndex = (nextPositionIndex + 1) % spawnPositions.length;
    return pos;
  }

  function notify() {
    onChange([...snippets]);
  }

  function spawnCodeSnippet() {
    if (snippets.length >= 3) return;

    const example = codeExamples[Math.floor(Math.random() * codeExamples.length)];
    const id = snippetId++;
    const pos = getNextPosition();
    const snippet = {
      id,
      lang: example.lang,
      code: example.code,
      displayedCode: '',
      x: pos.x,
      y: pos.y,
      opacity: 0,
      charIndex: 0,
    };
    snippets = [...snippets, snippet];

    setTimeout(() => {
      snippets = snippets.map(s => s.id === id ? { ...s, opacity: 0.15 } : s);
      notify();
    }, 50);

    const typeInterval = setInterval(() => {
      snippets = snippets.map(s => {
        if (s.id === id && s.charIndex < s.code.length) {
          return {
            ...s,
            displayedCode: s.code.substring(0, s.charIndex + 1),
            charIndex: s.charIndex + 1
          };
        }
        return s;
      });
      notify();

      const currentSnippet = snippets.find(s => s.id === id);
      if (currentSnippet && currentSnippet.charIndex >= currentSnippet.code.length) {
        clearInterval(typeInterval);

        setTimeout(() => {
          snippets = snippets.map(s => s.id === id ? { ...s, opacity: 0 } : s);
          notify();

          setTimeout(() => {
            snippets = snippets.filter(s => s.id !== id);
            notify();
          }, 1000);
        }, 2000);
      }
    }, 50);
  }

  function start() {
    spawnCodeSnippet();
    intervalId = setInterval(spawnCodeSnippet, 3500);
  }

  function stop() {
    clearInterval(intervalId);
  }

  return { start, stop };
}
