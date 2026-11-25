// Cuentas iniciales creadas automáticamente la primera vez que se abre la web
const baseInicial = [
    { user: 'admin', pass: '1234', nombre: 'Administrador NBA', rol: 'Administrador', url: 'admin.html' },
    { user: 'fan1', pass: '1234', nombre: 'Aficionado Lakers', rol: 'Usuario', url: 'nba.html' },
    { user: 'fan2', pass: '1234', nombre: 'Aficionado Celtics', rol: 'Usuario', url: 'nba.html' }
];

// Obtiene la lista de cuentas registradas desde localStorage
function obtenerUsuarios() {
    const guardado = localStorage.getItem('nba_usuarios_sistema');
    if (guardado === null) {
        localStorage.setItem('nba_usuarios_sistema', JSON.stringify(baseInicial));
        return [...baseInicial];
    }
    return JSON.parse(guardado) || [];
}

// Guarda la lista actualizada de cuentas
function guardarUsuarios(lista) {
    localStorage.setItem('nba_usuarios_sistema', JSON.stringify(lista));
}

// Registra usuarios conectados actualmente para mostrarlos en las estadísticas del Admin
function registrarConexionActiva(usuarioObj) {
    let activos = JSON.parse(localStorage.getItem('nba_usuarios_conectados')) || [];
    const ahora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    activos = activos.filter(a => a.user !== usuarioObj.user);
    activos.push({
        user: usuarioObj.user,
        nombre: usuarioObj.nombre || usuarioObj.user,
        rol: usuarioObj.rol,
        hora: ahora
    });
    localStorage.setItem('nba_usuarios_conectados', JSON.stringify(activos));
}

// Quita al usuario de la lista de conectados al cerrar sesión
function eliminarConexionActiva(user) {
    let activos = JSON.parse(localStorage.getItem('nba_usuarios_conectados')) || [];
    activos = activos.filter(a => a.user !== user);
    localStorage.setItem('nba_usuarios_conectados', JSON.stringify(activos));
}

// Decide a qué pantalla enviar según el rol
function obtenerRutaDestino(usuarioObj) {
    return usuarioObj.rol === 'Administrador' ? 'admin.html' : 'nba.html';
}

// Inicio de sesión
function iniciarSesion(e) {
    e.preventDefault();
    const inputUser = document.getElementById('inputUser').value.trim();
    const inputPass = document.getElementById('inputPass').value.trim();
    const base = obtenerUsuarios();

    const usuarioAutenticado = base.find(
        u => u.user === inputUser && u.pass === inputPass
    );

    if (usuarioAutenticado) {
        sessionStorage.setItem('sesionActiva', JSON.stringify(usuarioAutenticado));
        registrarConexionActiva(usuarioAutenticado);
        window.location.replace(obtenerRutaDestino(usuarioAutenticado));
    } else {
        document.getElementById('errorMsg').classList.remove('d-none');
    }
}

// Registro de nuevo usuario
function registrarUsuario(e) {
    e.preventDefault();

    const nombre = document.getElementById('regNombre').value.trim();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    const passConfirm = document.getElementById('regPassConfirm').value.trim();
    const errorBox = document.getElementById('regErrorMsg');

    errorBox.classList.add('d-none');

    if (pass !== passConfirm) {
        errorBox.textContent = 'Las contraseñas no coinciden.';
        errorBox.classList.remove('d-none');
        return;
    }

    const lista = obtenerUsuarios();
    const yaExiste = lista.some(u => u.user.toLowerCase() === user.toLowerCase());

    if (yaExiste) {
        errorBox.textContent = 'Ese nombre de usuario ya está en uso. Elige otro.';
        errorBox.classList.remove('d-none');
        return;
    }

    const nuevoUsuario = {
        user: user,
        pass: pass,
        nombre: nombre,
        rol: 'Usuario',
        url: 'nba.html'
    };

    lista.push(nuevoUsuario);
    guardarUsuarios(lista);

    sessionStorage.setItem('sesionActiva', JSON.stringify(nuevoUsuario));
    registrarConexionActiva(nuevoUsuario);
    window.location.replace('nba.html');
}

// Evita volver a mostrar login si ya hay sesión iniciada
function saltarLoginSiAutenticado() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
    if (sesion && sesion.user) {
        window.location.replace(obtenerRutaDestino(sesion));
    }
}

// Cierra sesión y vuelve a index.html
function cerrarSesion() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
    if (sesion && sesion.user) {
        eliminarConexionActiva(sesion.user);
    }
    sessionStorage.removeItem('sesionActiva');
    window.location.replace('index.html');
}

// Protege pantallas internas
function verificarSesion() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
    if (!sesion || !sesion.user) {
        sessionStorage.removeItem('sesionActiva');
        window.location.replace('index.html');
        return null;
    }
    registrarConexionActiva(sesion);
    return sesion;
}

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        saltarLoginSiAutenticado();
        formLogin.addEventListener('submit', iniciarSesion);
    }

    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', registrarUsuario);
    }

    const btnSalir = document.getElementById('btnSalir');
    if (btnSalir) {
        btnSalir.addEventListener('click', cerrarSesion);
    }
});