export const validaciones = {

    validarCorreo: (correo: string): boolean => {
        let exprexionCorreo:RegExp=/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
        // if (exprexionCorreo.test(correo)) {
        //     console.log("La dirección de email " + correo + " es correcta.");
        // } 
        // else {
        //     console.log("La dirección de email es incorrecta.");
        // }
        return !exprexionCorreo.test(correo)
    },
    eliminarEspaciosEnBlanco: (texto:string):string =>{
        // este metodo eliminas los espacios en blanco left y right
        return texto.trim()
    },
    validarCadenaVacia: (texto:string):boolean => {
        return texto.length===0
    }

}