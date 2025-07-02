
import { successToast, errorToast } from './toast.js'

let users = JSON.parse(localStorage.getItem("users")) || []

const formUser = document.getElementById('formUser')

//Valida los campos de entradas del formulario USER
const validate = (formUser) => {
  const connectors = ["_", "-", ".", "#", "@", "/", "+"]
  const { name, lastName, connector } = formUser

  const nameValue = name.value.trim().toLowerCase()
  const lastNameValue = lastName.value.trim().toLowerCase()
  const connectorValue = connector.value

  console.log({connector})
  if(nameValue.includes(' ') || !nameValue.length){
    handleError(name)
  }
  if(lastNameValue.includes(' ') || !lastNameValue.length){
    handleError(lastName)
  }
  if(!connectors.includes(connectorValue)){
    handleError(connector)
  }
  console.log(nameValue + connectorValue + lastNameValue)
  return `${nameValue}${connectorValue}${lastNameValue}`
}

//Setea el error
const handleError = (nodo) => {
  const span = nodo.nextElementSibling
  nodo.setAttribute('data-error', 'true')
  span.classList.add('inline')
}

//Removemos los errores
const inputs = document.querySelectorAll('input')
inputs.forEach(input => {
  input.addEventListener('input', () => {
    const error = input.getAttribute('data-error')
    if(error){
      const textError = input.nextElementSibling
      input.removeAttribute('data-error')
      textError.classList.remove('inline')
    }
  })
});


//Submit FORMUSER
formUser.addEventListener('submit', (e) => {
  e.preventDefault()
  //validamos los campos
  const newUser = validate(e.target)
  //Encuentra el primer error del formulario
  const firstError = formUser.querySelector('input[data-error="true"]');
  if (firstError) {
    firstError.focus();
  } else {
    //Verificamos que el usuario no se repita
    const existUser = users?.some((user) => user.name === newUser)
    if(existUser){
      errorToast()
    } else{
      users.unshift({name: newUser, date: new Date().toISOString()});
      localStorage.setItem("users", JSON.stringify(users))
      successToast()
      viewList()
      formUser.reset()
    }
  }
})


//Calculamos cuanto tiempo ha pasado desde una fecha
const getTime = (dateString) => {
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now - date;
  const diffInSeconds = Math.floor(diffInMs / 1000);

  if (diffInSeconds < 60) return 'hace unos segundos';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return rtf.format(-diffInMinutes, 'minute');
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return rtf.format(-diffInHours, 'hour');
  const diffInDays = Math.floor(diffInHours / 24);
  return rtf.format(-diffInDays, 'day');
}

const viewList = () => {
  let list = ``
  if(users.length) {
      for (const index in users) {
        const element = users[index]
          const relativeTime = getTime(element.date);
          list += `<li class="flex justify-between gap-x-6 py-5">
                      <div class="flex min-w-0 gap-x-4">
                        <img class="size-13 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        <div class="min-w-0 flex items-center">
                            <p class="text-sm/6 font-semibold text-gray-900">${element.name}</p>
                        </div>
                      </div>
                      <div class="hidden shrink-0 sm:flex sm:grid sm:items-center">
                        <p class="mt-1 text-xs/5 text-gray-400">Creado ${relativeTime}</p>
                      </div>
                      <div class="flex items-center gap-4">
                        <button data-index="${index}" class="btn-delete cursor-pointer bg-red-600  w-8 h-8 grid items-center rounded-md">
                          <span class="material-symbols-outlined text-white">delete</span>
                        </button>
                      </div>
                    </li>`
      }
    } else {
      list = `<li class="text-gray-400 text-sm px-4 py-2">No hay usuarios registrados.</li>`;
    }
    
  const nodeList = document.getElementById('list')
  nodeList.innerHTML = list
  
  //Removemos el usuario
  const btnDelete = document.querySelectorAll('.btn-delete')
  btnDelete.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.closest('button').dataset.index;
      if (index !== undefined) {
        users.splice(index, 1); // Elimina el usuario del array
        localStorage.setItem("users", JSON.stringify(users)); // Actualiza el localStorage
        viewList(users); // Vuelve a pintar la lista
      }
    });
  });
}

viewList()

//PASSWORD FORM

const formPassword = document.getElementById('formPassword')

const validatePassword = (formPassword) => {
  //Caracteres Especiales
  const reg = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "-", "=", "{", "}", "[", "]", ":", ";", '"', "'", "<", ">", ",", ".", "?", "/", "|", '~', '`']

  const { password, character, number, letter, specialCharacter } = formPassword

  //Valores de los campos de entrada
  const characterValue = parseInt(character.value)
  const numberValue = parseInt(number.value)
  const letterValue = parseInt(letter.value)
  const passwordValue = password.value
  const specialValue = specialCharacter.value

  //Validación de los campos de entrada
  if(numberValue <= 0 || isNaN(numberValue)) handleError(number)
  if(letterValue <= 0 || isNaN(letterValue)) handleError(letter)
  if(characterValue <= 0 || isNaN(characterValue)) handleError(character)
  if(passwordValue.length <= 0) handleError(password)
  if(!reg.includes(specialValue)) handleError(specialCharacter)

  //Primer error encontrado
  const firstError = formPassword.querySelector('input[data-error="true"]');
  const containerList = document.getElementById('containerError')
  if (firstError) {
    firstError.focus();
    containerList.innerHTML = ''
  } else {
    
    const totalCharacter = passwordValue.length
    const quantityNumber = passwordValue.match(/\d/g) ? passwordValue.match(/\d/g).length : 0
    const quantityLetter = passwordValue.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/g) ? passwordValue.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/g).length : 0
    const existCharacterSpecial = passwordValue.includes(specialValue)

    //Cumple con la validacion
    const validateCharacter = totalCharacter === characterValue
    const validateNumber = quantityNumber === numberValue
    const validateLetter = quantityLetter === letterValue
    const isValidPassword = validateCharacter && validateNumber && validateLetter && existCharacterSpecial

    
    const list = `
        <div  class="${isValidPassword ? 'bg-[#38ff201f]' : 'bg-[#ff101030]'} rounded-md p-2"> 
          <h3 class="">${isValidPassword ? "✔️ CONFORME: Contraseña valida" : "❌ ERRONEO: Contraseña invalida"}</h3>
          <ul class="text-sm/8 font-semibold">
            <li class="${validateCharacter ? "text-[#13b113]" : "text-red-600" } flex items-center gap-2">
              <span class="material-symbols-outlined">${validateCharacter ? 'check_circle' : "cancel"}</span>
              Total de caracteres: ${totalCharacter} de ${characterValue} requeridos
            </li>
            <li class="${validateNumber ? "text-[#13b113]" : "text-red-600" } flex items-center gap-2">
              <span class="material-symbols-outlined">${validateNumber ?'check_circle' : "cancel"}</span>
              Números: ${quantityNumber} de ${numberValue} requeridos
            </li>
            <li class="${validateLetter? "text-[#13b113]" : "text-red-600" } flex items-center gap-2">
              <span class="material-symbols-outlined">${validateLetter ?'check_circle' : "cancel"}</span>
              Letras: ${quantityLetter} de ${letterValue} requeridas
            </li>
            <li class="${existCharacterSpecial ? "text-[#13b113]" : "text-red-600" } flex items-center gap-2">
              <span class="material-symbols-outlined">${existCharacterSpecial ?'check_circle' : "cancel"}</span>
              Carácter especial "${specialValue}"  ${existCharacterSpecial ? "incluido" : "no incluido"}
              </li>
          </ul>
        </div>
    `;
    containerList.innerHTML = list
  }
  
}

//Sumbit FORMPASSWORD
formPassword.addEventListener('submit', (e) => {
  e.preventDefault()
  validatePassword(e.target)
})