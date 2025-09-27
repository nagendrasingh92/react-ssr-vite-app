import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Home Page</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          This is the home page with SSR support!
        </p>
      </div>
    </div>
  )
}
