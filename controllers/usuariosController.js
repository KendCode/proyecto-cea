import {
    crearUsuario
}
from "../services/usuariosService.js";

const btnGuardar =
    document.getElementById(
        "btnGuardarUsuario"
    );

btnGuardar.addEventListener(
    "click",
    async () => {

        const nombre =
            document.getElementById(
                "fNombre"
            ).value.trim();

        const apPat =
            document.getElementById(
                "fApPat"
            ).value.trim();

        const ci =
            document.getElementById(
                "fCi"
            ).value.trim();

        const rol =
            document.getElementById(
                "fRol"
            ).value;

        // VALIDACIONES
        if (
            !nombre ||
            !apPat ||
            !ci ||
            !rol
        ) {

            alert(
                "Completa los campos obligatorios"
            );

            return;

        }

        const primerNombre =
            nombre
                .trim()
                .split(" ")[0]
                .toLowerCase();

        const usuario =
            `${primerNombre}_${ci}`;

        const correo =
            `${usuario}@sistema.com`;

        const apMat =
            document.getElementById(
                "fApMat"
            ).value.trim();

        const celular =
            document.getElementById(
                "fCelular"
            ).value.trim();

        const carrera =
            document.getElementById(
                "fCarrera"
            ).value;

        const nivel =
            document.getElementById(
                "fNivel"
            ).value;

        const sexo =
            document.getElementById(
                "fSexo"
            ).value;

        const fechaNac =
            document.getElementById(
                'fFechaNac'
            ).value;

        // PASSWORD AUTOMÁTICA
        let pass = '';

        if (fechaNac) {

            const partes =
                fechaNac.split('-');

            pass =
                `${partes[2]}-${partes[1]}-${partes[0]}`;

        }

        const data = {

            usuario,

            nombre,

            ap_paterno: apPat,

            ap_materno: apMat,

            ci,

            correo,

            nro_celular: celular,

            rol,

            carrera,

            nivel,

            sexo,

            fecha_nac: fechaNac,

            password: pass

        };

        try {

            btnGuardar.disabled = true;

            btnGuardar.innerHTML =
                'Guardando...';

            await crearUsuario(data);

            alert(
                "Usuario creado correctamente"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Error al crear usuario"
            );

        } finally {

            btnGuardar.disabled = false;

            btnGuardar.innerHTML =
                'Guardar Usuario';

        }

    });