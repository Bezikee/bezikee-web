import { useState, useEffect } from 'react'

const codeSnippets = [
  {
    language: 'React',
    code: `const App = () => {
  const [isAwesome, setIsAwesome] = useState(true);

  return (
    <div className="bezikee-magic">
      {isAwesome && <YourDreamProject />}
    </div>
  );
};`
  },
  {
    language: 'TypeScript',
    code: `interface Project {
  name: string;
  client: string;
  success: boolean;
}

const deliverExcellence = async (
  project: Project
): Promise<Result> => {
  return await bezikee.build(project);
};`
  },
  {
    language: 'Next.js',
    code: `export default async function Page() {
  const data = await fetchData();

  return (
    <main className="stunning-design">
      <Hero data={data} />
      <Features />
      <ContactForm />
    </main>
  );
}`
  }
]

export function CodeTypingAnimation() {
  const [currentSnippet, setCurrentSnippet] = useState(0)
  const [displayedCode, setDisplayedCode] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const snippet = codeSnippets[currentSnippet]
    let charIndex = 0
    setDisplayedCode('')
    setIsTyping(true)

    const typeInterval = setInterval(() => {
      if (charIndex < snippet.code.length) {
        setDisplayedCode(snippet.code.slice(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)

        // Wait and then switch to next snippet
        setTimeout(() => {
          setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length)
        }, 3000)
      }
    }, 35)

    return () => clearInterval(typeInterval)
  }, [currentSnippet])

  const snippet = codeSnippets[currentSnippet]

  return (
    <div className="relative w-full max-w-2xl">
      {/* Window Chrome */}
      <div className="bg-dark-card border border-dark-border rounded-t-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-dark-bg border-b border-dark-border">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-zinc-500 text-sm font-mono">{snippet.language}</span>
          </div>
          <div className="w-14"></div>
        </div>
      </div>

      {/* Code Area */}
      <div className="bg-[#0d1117] border-x border-b border-dark-border rounded-b-xl p-6 min-h-[280px] overflow-hidden">
        <pre className="font-mono text-sm leading-relaxed">
          <code>
            {displayedCode.split('\n').map((line, lineIndex) => (
              <div key={lineIndex} className="flex">
                <span className="text-zinc-600 w-8 flex-shrink-0 select-none">
                  {lineIndex + 1}
                </span>
                <span className="text-zinc-300">
                  {highlightSyntax(line)}
                </span>
              </div>
            ))}
            {isTyping && (
              <span
                className={`inline-block w-2 h-5 bg-neon-green ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ verticalAlign: 'text-bottom' }}
              />
            )}
          </code>
        </pre>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/20 via-emerald-500/20 to-teal-500/20 rounded-xl blur-xl -z-10 opacity-50"></div>
    </div>
  )
}

function highlightSyntax(line: string): React.ReactNode {
  // Simple syntax highlighting
  const keywords = ['const', 'let', 'var', 'function', 'return', 'async', 'await', 'export', 'default', 'interface', 'type', 'import', 'from']
  const types = ['string', 'number', 'boolean', 'Promise', 'Project', 'Result']

  let result = line

  // Highlight strings
  result = result.replace(/(["'`])(.*?)\1/g, '<span class="text-amber-400">$1$2$1</span>')

  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
    result = result.replace(regex, '<span class="text-purple-400">$1</span>')
  })

  // Highlight types
  types.forEach(type => {
    const regex = new RegExp(`\\b(${type})\\b`, 'g')
    result = result.replace(regex, '<span class="text-cyan-400">$1</span>')
  })

  // Highlight JSX tags
  result = result.replace(/(&lt;|<)(\/?)(\w+)/g, '$1$2<span class="text-red-400">$3</span>')

  // Highlight functions
  result = result.replace(/(\w+)(\s*\()/g, '<span class="text-blue-400">$1</span>$2')

  // Highlight comments
  result = result.replace(/(\/\/.*$)/g, '<span class="text-zinc-500">$1</span>')

  return <span dangerouslySetInnerHTML={{ __html: result }} />
}
