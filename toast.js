
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseleave = Swal.resumeTimer;
  },
    showConfirmButton: false,
  didClose: () => {
    // Recién cuando se cierre, recargamos
  }
});

export const successToast = () => {
  Toast.fire({
    icon: "success",
    title: "Creado correctamente",
    color: "white",
    iconColor:"white",
    background: "#10B981", 
  });
}

export const errorToast = () => {
  Toast.fire({
    icon: "error",
    title: "El usuario ya existe",
    color: "white",
    iconColor:"white",
    background: "red", 
  });
}
