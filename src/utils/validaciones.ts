export const validaciones = {

    validarCorreo: (correo: string): boolean => {
        let exprexionCorreo:RegExp=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/
        if (exprexionCorreo.test(correo)) {
            console.log("La dirección de email " + correo + " es correcta.");
        } 
        else {
            console.log("La dirección de email es incorrecta.");
        }
        return exprexionCorreo.test(correo)
    },
    eliminarEspaciosEnBlanco: (texto:string):string =>{
        // este metodo eliminas los espacios en blanco left y right
        return texto.trim()
    },
    validarCadenaVacia: (texto:string):boolean => {
        return texto.length!==0
    }

}