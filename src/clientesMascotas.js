
const propietarios = [];
const mascotas = [];

let siguienteIdPropietario = 1;
let siguienteIdMascota = 1;

// Registrar un propietario
function registrarPropietario(nombre, telefono, correo) {
    if (!nombre || !nombre.trim()) {
        throw new Error(
            "El nombre del propietario es obligatorio"
        );
    }

    if (!/^\d+$/.test(telefono)) {
        throw new Error(
            "El teléfono solo debe contener dígitos"
        );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        throw new Error(
            "Formato de correo electrónico inválido"
        );
    }

    const propietario = {
        id: siguienteIdPropietario++,
        nombre,
        telefono,
        correo,
        estado: "Activo"
    };

    propietarios.push(propietario);

    return propietario;
}

// Cambiar el estado de un propietario
function actualizarEstadoPropietario(
    propietarioId,
    nuevoEstado
) {
    const propietario = propietarios.find(
        p => p.id === propietarioId
    );

    if (!propietario) {
        throw new Error(
            "El propietario especificado no existe"
        );
    }

    if (!["Activo", "Inactivo"].includes(nuevoEstado)) {
        throw new Error(
            "El estado del propietario no es válido"
        );
    }

    propietario.estado = nuevoEstado;

    return propietario;
}

// Registrar una mascota
function registrarMascota(
    propietarioId,
    nombre,
    especie,
    raza = null,
    fechaNacimiento = null
) {
    const propietario = propietarios.find(
        p => p.id === propietarioId
    );

    if (!propietario) {
        throw new Error(
            "El propietario especificado no existe"
        );
    }

    if (propietario.estado !== "Activo") {
        throw new Error(
            "No se puede asociar una mascota a un propietario inactivo"
        );
    }

    if (!nombre || !nombre.trim()) {
        throw new Error(
            "El nombre de la mascota es obligatorio"
        );
    }

    if (!especie || !especie.trim()) {
        throw new Error(
            "La especie de la mascota es obligatoria"
        );
    }

    if (fechaNacimiento) {
        const fecha = new Date(
            `${fechaNacimiento}T00:00:00`
        );

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (
            Number.isNaN(fecha.getTime()) ||
            fecha.toISOString().slice(0, 10) !== fechaNacimiento ||
            fecha > hoy
        ) {
            throw new Error(
                "La fecha de nacimiento no puede ser futura"
            );
        }
    }

    const mascota = {
        id: siguienteIdMascota++,
        propietarioId,
        nombre,
        especie,
        raza,
        fechaNacimiento
    };

    mascotas.push(mascota);

    return mascota;
}

// Consultar mascotas por propietario
function consultarMascotasPorPropietario(propietarioId) {
    return mascotas.filter(
        mascota => mascota.propietarioId === propietarioId
    );
}

// Exportar las funciones
module.exports = {
    registrarPropietario,
    actualizarEstadoPropietario,
    registrarMascota,
    consultarMascotasPorPropietario
};
