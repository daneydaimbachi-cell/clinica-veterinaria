
const test = require("node:test");
const assert = require("node:assert/strict");

const {
    registrarPropietario,
    actualizarEstadoPropietario,
    registrarMascota,
    consultarMascotasPorPropietario
} = require("../src/clientesMascotas");

// CP-01: Registrar propietario válido
test("CP-01: registrar propietario válido", () => {
    const propietario = registrarPropietario(
        "Carlos Pérez",
        "3001234567",
        "carlos@mail.com"
    );

    assert.equal(propietario.nombre, "Carlos Pérez");
    assert.equal(propietario.estado, "Activo");
    assert.ok(propietario.id);
});

// CP-02: Rechazar propietario sin nombre
test("CP-02: rechazar propietario sin nombre", () => {
    assert.throws(
        () => registrarPropietario(
            "",
            "3001234567",
            "carlos@mail.com"
        ),
        /El nombre del propietario es obligatorio/
    );
});

// CP-03: Rechazar correo inválido
test("CP-03: rechazar correo inválido", () => {
    assert.throws(
        () => registrarPropietario(
            "Ana Gómez",
            "3009876543",
            "correo_sin_arroba.com"
        ),
        /Formato de correo electrónico inválido/
    );
});

// CP-04: Rechazar teléfono con caracteres no numéricos
test("CP-04: rechazar teléfono con letras", () => {
    assert.throws(
        () => registrarPropietario(
            "Pedro Luis",
            "TELEFONO123",
            "pedro@mail.com"
        ),
        /El teléfono solo debe contener dígitos/
    );
});

// CP-05: Registrar mascota con propietario activo
test("CP-05: registrar mascota con propietario activo", () => {
    const propietario = registrarPropietario(
        "Carlos Pérez",
        "3011111111",
        "carlos.perez@mail.com"
    );

    const mascota = registrarMascota(
        propietario.id,
        "Lucas",
        "Perro",
        "Labrador",
        "2022-05-10"
    );

    assert.equal(mascota.nombre, "Lucas");
    assert.equal(mascota.especie, "Perro");
    assert.equal(mascota.raza, "Labrador");
    assert.equal(mascota.propietarioId, propietario.id);
});

// CP-06: Rechazar mascota de propietario inactivo
test("CP-06: rechazar mascota de propietario inactivo", () => {
    const propietario = registrarPropietario(
        "Pedro Gómez",
        "3022222222",
        "pedro.gomez@mail.com"
    );

    actualizarEstadoPropietario(
        propietario.id,
        "Inactivo"
    );

    assert.throws(
        () => registrarMascota(
            propietario.id,
            "Michi",
            "Gato"
        ),
        /No se puede asociar una mascota a un propietario inactivo/
    );
});

// CP-07: Rechazar propietario inexistente
test("CP-07: rechazar propietario inexistente", () => {
    assert.throws(
        () => registrarMascota(
            999,
            "Rocky",
            "Perro"
        ),
        /El propietario especificado no existe/
    );
});

// CP-08: Rechazar mascota sin especie
test("CP-08: rechazar mascota sin especie", () => {
    const propietario = registrarPropietario(
        "Laura Díaz",
        "3033333333",
        "laura.diaz@mail.com"
    );

    assert.throws(
        () => registrarMascota(
            propietario.id,
            "Firulais",
            ""
        ),
        /La especie de la mascota es obligatoria/
    );
});

// CP-09: Registrar mascota sin raza
test("CP-09: registrar mascota sin raza", () => {
    const propietario = registrarPropietario(
        "Andrés Ruiz",
        "3044444444",
        "andres.ruiz@mail.com"
    );

    const mascota = registrarMascota(
        propietario.id,
        "Pelusa",
        "Gato"
    );

    assert.equal(mascota.nombre, "Pelusa");
    assert.equal(mascota.raza, null);
});

// CP-10: Rechazar fecha de nacimiento futura
test("CP-10: rechazar fecha de nacimiento futura", () => {
    const propietario = registrarPropietario(
        "Sofía Mora",
        "3055555555",
        "sofia.mora@mail.com"
    );

    assert.throws(
        () => registrarMascota(
            propietario.id,
            "Snoopy",
            "Perro",
            null,
            "2030-01-01"
        ),
        /La fecha de nacimiento no puede ser futura/
    );
});

// CP-11: Consultar mascotas de un propietario
test("CP-11: consultar mascotas del propietario", () => {
    const propietario = registrarPropietario(
        "María López",
        "3066666666",
        "maria.lopez@mail.com"
    );

    registrarMascota(
        propietario.id,
        "Lucas",
        "Perro",
        "Labrador",
        "2022-05-10"
    );

    registrarMascota(
        propietario.id,
        "Pelusa",
        "Gato"
    );

    const mascotas = consultarMascotasPorPropietario(
        propietario.id
    );

    assert.equal(mascotas.length, 2);
    assert.equal(mascotas[0].nombre, "Lucas");
    assert.equal(mascotas[1].nombre, "Pelusa");
});

// CP-12: Cambiar estado y bloquear nuevas asociaciones
test("CP-12: cambiar propietario a inactivo", () => {
    const propietario = registrarPropietario(
        "Juan Torres",
        "3077777777",
        "juan.torres@mail.com"
    );

    const actualizado = actualizarEstadoPropietario(
        propietario.id,
        "Inactivo"
    );

    assert.equal(actualizado.estado, "Inactivo");

    assert.throws(
        () => registrarMascota(
            propietario.id,
            "Max",
            "Perro"
        ),
        /No se puede asociar una mascota a un propietario inactivo/
    );
});
