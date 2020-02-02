const express = require('express');
const server = express();

server.use(express.json());

let requests = 0;

server.use((req, res, next) => {
  requests++;
  console.log(`Requests made until now ${requests}`);

  next();
});

let projects = [
  {
    id: 1,
    title: "Projeto 1",
    tasks: [
      "Tarefa 1",
      "Tarefa 2"
    ]
  },
  {
    id: 2,
    title: "Projeto 2",
    tasks: [
      "Tarefa 1",
      "Tarefa 2",
      "Tarefa 3"
    ]
  }
];

const checkProjectExists = (req, res, next) => {
  const {id} = req.params;

  const project = projects.filter(project => {
    return project.id == id;
  });

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  return next();
};

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const {id, title, tasks} = req.body;

  projects.push({id, title, tasks});

  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const {title} = req.body;
  const {id} = req.params;

  const updatedProjects = projects.map((project) => {
    if(project.id == id){
      project.title = title
    }

    return project;
  });

  projects = updatedProjects;

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const updatedProjects = projects.filter((project) => {
    return project.id != id;
  });

  projects = updatedProjects;

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const {title} = req.body;
  const {id} = req.params;

  const updatedProjects = projects.map((project) => {
    if (project.id == id) {
      if(!project.tasks){
        project.tasks = [title];
      }else{
        project.tasks.push(title);
      }
    }

    return project;
  });

  projects = updatedProjects;

  return res.json(projects);
});

server.listen(3000);