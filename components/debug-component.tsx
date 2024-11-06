'use client'

import { useState, useEffect } from 'react'

export default function DebugComponent() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('Component rendered:', count)
    // Uncomment the line below to simulate an infinite loop
    // setCount(prevCount => prevCount + 1)
  }, [count])

  return (
    <div>
      <h1>Debugging Component</h1>
      <p>Render count: {count}</p>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        Increment
      </button>
    </div>
  )
}