const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(express.static('dist'))

morgan.token('post-content', function (req, res) { return req.method === 'POST' ? JSON.stringify(req.body) : '' })

app.use(morgan(':method :url :status :res[content-length] :response-time ms :post-content'))

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/info', (request, response) => {
  const date = new Date()
  const info = `<p>Phonebook has info for ${phonebook.length} people</p><p>${date.toString()}</p>`
  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = phonebook.find(person => person.id === id)
  console.log(person)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  phonebook = phonebook.filter(person => person.id !== id)
 
  response.status(204).end()
})

const generateId = () => {
  return  Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log(body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name o number missing' 
    })
  }
  
  const exist = phonebook.find(person => person.name === body.name)

  if (exist) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  phonebook = phonebook.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})