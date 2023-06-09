import './App.css';
import { useState, useEffect } from 'react'


function App() {
  const [students, setStudents] = useState([])
  useEffect(() => {
    async function fetchStudents() {
      let res = await fetch('http://localhost:8000/digitazon/2023/02/students')
      let json = await res.json()
      setStudents(json)
    }      
    fetchStudents()
  }, [students])    
  const [secrets, setSecrets] = useState(Array(students.length).fill(''))
  return (
    <div className="App">
      <h1>Welcome to League of Students</h1>
      <ul>
        {students.map((obj, id) => (
          <li>
            <h3>student {id + 1}</h3>
            <p>name: <b>{obj.name}</b></p>
            <p>lastname: <b>{obj.lastname}</b></p>
            <button
              onClick={() => {
                let s = secrets
                s[id] = obj.secret
                setSecrets(s)
              }}
            >reveal the secret</button> 
            <p>secret: {secrets[id]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
