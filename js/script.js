//
// Lista de tareas
//
//
// MODELO
// Variables
const uid = 1;
// Lista de tareas (Array).
let tareas = [];
// Lista de tareas (DOM).
const lista = document.getElementById('task-list');
// Formulario para añadir tareas.
const formulario = document.getElementById('new-task-form');
// Esconder Tareas
const completar = document.getElementById('hide-completed');
completar.addEventListener('click',(event) =>{
  const status = event.currentTarget.checked;
  const uncomplete = tareas.filter((tarea)=>{
    return !tarea.complete;
  })
  if(status === true){
    refreshTasksDOM(uncomplete);
  }else{
    refreshTasksDOM(tareas);
  }
})
// taskStatus(): Actualiza el estado de una tarea.
function taskStatus(id, complete) {
  const tareaEncon = tareas.find((tarea) => tarea._id === id);
  if (tareaEncon) {
    tareaEncon.complete = complete;
    const tareaCambiada = {
      name: tareaEncon.name,
      complete,
      date: tareaEncon.date,
    };
    const fetchOptions = {
      method: 'PUT',
      body: JSON.stringify(tareaCambiada),
    };
    fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=${18}`, fetchOptions)
      .then((response) => response.json())
      .then((data) => {
      });
  }
}
// deleteTask(): Borra una tarea.
function deleteTask(id) {
  // Recorre la lista de tareas.
  for (let i = 0; i < tareas.length; i += 1) {
    // Cuando encuentra la tarea con el id correcto la borra.
    if (tareas[i]._id === id) {
      tareas.splice(i, 1);
      const fetchOptions = {
        method: 'DELETE',
      };
      fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=${18}`, fetchOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
      break;
    }
  }
}
//
// Vista.
//
function appendTaskDOM(tarea) {
  // Item de la lista
  const item = document.createElement('li');
  item.className = 'task-list__item';
  // Checkbox.
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('id', `tarea-${tarea._id}`);
  checkbox.checked = tarea.complete;
  checkbox.dataset.taskId = tarea._id;
  // Label.
  const label = document.createElement('label');
  label.setAttribute('for', `tarea-${tarea._id}`);
  label.innerHTML = `${tarea.name} - ${tarea.date}`;
  // Botón de borrar.
  const buttonDelete = document.createElement('button');
  buttonDelete.className = 'task-list__delete';
  buttonDelete.setAttribute('id', `delete-${tarea._id}`);
  buttonDelete.dataset.taskId = tarea._id;
  buttonDelete.innerHTML = 'Borrar';
  // Se agregan elementos.
  item.appendChild(checkbox);
  item.appendChild(label);
  item.appendChild(buttonDelete);
  lista.appendChild(item);
  // Evento para marcar tareas como completas.
  checkbox.addEventListener('click', (event) => {
    const complete = event.currentTarget.checked;
    const taskId = event.currentTarget.dataset.taskId;
    taskStatus(taskId, complete);
  });
  // Evento para borrar tareas.
  buttonDelete.addEventListener('click', (event) => {
    const taskId = event.currentTarget.dataset.taskId;
    deleteTask(taskId);
    // Borra la tarea en el DOM.
    event.currentTarget.parentNode.remove();
  });
}
// Refresca la lista completa de tareas en el DOM.
function refreshTasksDOM(tasks) {
  lista.innerHTML = '';
  tasks.forEach((task) => {
    appendTaskDOM(task);
  });
}
// Agrega una tarea en la lista.
function addTask(nombreTarea, fechaTarea, completoTarea) {
  // Crea un objeto que representa la nueva tarea.
  const nuevaTarea = {
    name: nombreTarea,
    complete: completoTarea,
    date: fechaTarea,
  };
  // Agrega el objeto en el array.
  tareas.push(nuevaTarea);
  // Envía la nueva tarea al API.
  // Opciones para el fetch.
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify(nuevaTarea),
  };
  // Ejecuta el fetch.
  fetch(`https://js2-tareas-api.netlify.app/api/tareas?uid=${18}`, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      // Agrega la tarea al DOM.
      appendTaskDOM(data);
    });
}
//
// Controlador.
//
// Event handler para el evento 'submit' del formulario.
// Crea una nueva tarea.
formulario.addEventListener('submit', (event) => {
  // Se cancela el comportamiento default del formulario.
  event.preventDefault();
  // Agrega el nuevo ítem al modelo.
  addTask(formulario.elements[0].value, formulario.elements[1].value, false);
  // Reseteamos el form.
  formulario.elements[0].value = '';
  formulario.elements[1].value = '';
});

fetch(`https://js2-tareas-api.netlify.app/api/tareas?uid=${18}`)
  .then((response) => response.json())
  .then((data) => {
    tareas = data;
    refreshTasksDOM(tareas);
  });
//118240946
