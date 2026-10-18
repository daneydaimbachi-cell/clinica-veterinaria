const test = require("node:test");
const assert = require("node:assert/strict");

const {
    registrarPropietario,
    registrarMascota,
    consultarMascotasPorPropietario
} = require("../src/clientesMascotas");

test("CP-01: registrar propietario válido", () => {
    const propietario = registrarPropietario(
        "Carlos Pérez",
        "3001234567",
        "carlos@mail.com"
    );

    assert.equal(propietario.nombre, "Carlos Pérez");
    assert.equal(propietario.estado, "Activo");
});

test("CP-02: rechazar propietario sin nombre", () => {
    assert.throws(
        () => registrarPropietario(
            "",
            "3001234567",
            "carlos@mail.com"
        ),
        /nombre del propietario es obligatorio/
    );
});

test("CP-03: rechazar correo inválido", () => {
    assert.throws(
        () => registrarPropietario(
            "Ana Gómez",
            "3009876543",
            "correo_sin_arroba"
        ),
        /Formato de correo/
    );
});

test("CP-04: rechazar teléfono con letras", () => {
    assert.throws(
        () => registrarPropietario(
            "Pedro Luis",
            "TELEFONO123",
            "pedro@mail.com"
        ),
        /teléfono solo debe contener dígitos/
    );
});

test("CP-05 y CP-11: registrar y consultar mascotas", () => {
    const propietario = registrarPropietario(
        "María López",
        "3101234567",
        "maria@mail.com"
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

    const resultado =
        consultarMascotasPorPropietario(propietario.id);

    assert.equal(resultado.length, 2);
    assert.equal(resultado[0].nombre, "Lucas");
    assert.equal(resultado[1].nombre, "Pelusa");
});

test("CP-07: rechazar propietario inexistente", () => {
    assert.throws(
        () => registrarMascota(
            999999,
            "Rocky",
            "Perro"
        ),
        /propietario especificado no existe/
    );
});

test("CP-08: rechazar mascota sin especie", () => {
    const propietario = registrarPropietario(
        "Laura Díaz",
        "3151234567",
        "laura@mail.com"
    );

    assert.throws(
        () => registrarMascota(
            propietario.id,
            "Firulais",
            ""
        ),
        /especie de la mascota es obligatoria/
    );
});

test("CP-09: permitir mascota sin raza", () => {
    const propietario = registrarPropietario(
        "Andrés Ruiz",
        "3161234567",
        "andres@mail.com"
    );

    const mascota = registrarMascota(
        propietario.id,
        "Michi",
        "Gato"
    );

    assert.equal(mascota.raza, null);
});

test("CP-10: rechazar fecha de nacimiento futura", () => {
    const propietario = registrarPropietario(
        "Sofía Mora",
        "3171234567",
        "sofia@mail.com"
    );

    assert.throws(
        () => registrarMascota(
            propietario.id,
            "Max",
            "Perro",
            null,
            "2030-01-01"
        ),
        /fecha de nacimiento no puede ser futura/
    );
});