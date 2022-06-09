const { response } = require('express');
const express = require('express');

const app = express();

app.use(express.json());

const projects = [
  {
    "id": "1",
    "title": "Projeto Um"
  },
  {
    "id": "2",
    "title": "Projeto Dois"
  }
];

// GET -> lista todos os projetos
app.get('/projects', (req, res) => {
  return res.status(200).json(projects);
});

// POST -> cria um novo projeto
app.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = { id, title };
  projects.push(project);
  return res.status(201).json({ message: 'Projeto criado com sucesso!', project });
});

// PUT -> atualiza um projeto pelo id
app.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0) {
    return res.status(400).json({ message: 'Projeto não encontrado.' });
  }

  const project = { id, title };

  projects[projectIndex] = project;
  
  return res.status(200).json({ message: 'Projeto atualizado com sucesso!', project });

});

// DELETE -> apaga um projeto pelo id
app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  const  projectIndex = projects.findIndex(project => project.id === id);
  
  if(projectIndex < 0) {
    return res.status(400).json({ message: 'Projeto não encontrado.' });
  }

  projects.splice(projectIndex, 1);

  return res.status(200).json({ message: 'Projeto apagado com sucesso!' });
});

// POST -> insere tarefas em um projeto existente
app.post('/projects/:id/tasks', (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex >= 0) {
    const project = projects[projectIndex];
    project.tasks = tasks;
    return res.status(200).json({ message: 'Tasks cadastradas com sucesso!', id, tasks });
  }

  return res.status(200).json({ message: 'Não foi possivel completar esta operação.' });

});

// DELETE -> apaga tarefas de um projeto
app.delete('/projects/:id/tasks', (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  if(projectIndex >= 0){
    const project = projects[projectIndex];
    if (project.hasOwnProperty('tasks')){
      delete(project.tasks);
      return res.status(200).json({ message: 'Tasks do projeto apagadas com sucesso!', project });
    }else{
      return res.json({ message: 'Esse projeto ainda não possui tasks.'});
    }
  }
});

app.listen(8000, () => console.log('Servidor rodando na porta 8000'));