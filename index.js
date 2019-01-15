const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile.js');
const server = express();

//connect db 
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

const getById = (table, id) => {
  return db(table).where({ id })
}
const createAnimal = (table, body)=>{
  return db(table).insert(body)
}

const deleteAnimal = (table, id) =>{
  return db(table).where({ id }).del()
}

const updateAnimal = (table, id, body) =>{
  return db(table).where({ id }).update(body)
}
// endpoints here
  server.get('/', (req,res)=>{
      res.send('api working')
  })
// get list of animals
  server.get('/api/zoos', (req, res) => {
    db('zoos')
    .then(animals =>{
      res.status(200).json(animals)
    })
    .catch(err => 
      res.status(500).json(err)
      )
  })
// get by ID
  server.get('/api/zoos/:id', (req, res) => {
    const id = req.params.id;
      getById('zoos', id)
      .then(animal => {
        if(animal.length !=0){
        res.status(200).json(animal)
        } else{
          res.status(404).json({errorMessage: 'no animal found by that ID'})
        }
      })
      .catch(err =>
        res.status(500).json(err)
      )
})

// create a animal 
server.post('/api/zoos', (req,res)=>{
  const body = req.body

  if(!req.body.name){
    res.status(400).json({ errorMessage: 'please make sure you provided a name' })
  }
  createAnimal('zoos',body)
  .then(animal =>{
      res.status(201).json(animal);
  })
  .catch(err =>{
    res.status(500).json(err)
  })
})

// delete an animal
server.delete('/api/zoos/:id', (req,res)=>{
  const id = req.params.id
  deleteAnimal('zoos',id)
  .then(result =>{
    res.status(200).json(result)
  })
  .catch(err=>{
    res.status(500).json(err)
  })
})

// update an animal 

server.put('/api/zoos/:id', (req,res)=>{
  const id = req.params.id
  const body = req.body
  if (!req.body.name) {
    res.status(400).json({ errorMessage: 'please make sure you provided a name to update' })
  }
  updateAnimal('zoos',id,body)
  .then(result =>{
    res.status(200).json(result)
  })
  .catch(err=>{
    res.status(500).json(err)
  }
   
  )
})



const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
