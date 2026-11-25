// Verifica que quien entró sea Administrador
const sesionAdmin = verificarSesion();
if (sesionAdmin && sesionAdmin.rol !== 'Administrador') {
    window.location.replace('nba.html');
}

// Actualiza los contadores de estadísticas de la página
function actualizarEstadisticas() {
    const usuarios = obtenerUsuarios();
    const conectados = JSON.parse(localStorage.getItem('nba_usuarios_conectados')) || [];
    const consultasApi = parseInt(localStorage.getItem('nba_consultas_api')) || 0;

    // Cuenta cuántos partidos favoritos han guardado todos los usuarios
    let totalFavoritos = 0;
    usuarios.forEach(u => {
        const favs = JSON.parse(localStorage.getItem(`nba_favs_${u.user}`)) || [];
        totalFavoritos += favs.length;
    });

    document.getElementById('statConectados').textContent = conectados.length;
    document.getElementById('statTotalUsuarios').textContent = usuarios.length;
    document.getElementById('statConsultasApi').textContent = consultasApi;
    document.getElementById('statPartidosGuardados').textContent = totalFavoritos;

    // Dibuja los badges de personas conectadas al momento
    const contenedorConectados = document.getElementById('listaConectados');
    contenedorConectados.innerHTML = '';

    if (conectados.length === 0) {
        contenedorConectados.innerHTML = '<span class="text-muted small">No hay usuarios conectados en este instante.</span>';
        return;
    }

    conectados.forEach(c => {
        const badge = document.createElement('div');
        badge.className = 'badge bg-light text-dark border p-2 px-3 rounded-pill d-flex align-items-center gap-2';
        badge.innerHTML = `
            <span class="text-success">●</span>
            <strong>${c.nombre}</strong>
            <span class="text-muted">(@${c.user} - ${c.rol})</span>
            <small class="text-secondary">desde ${c.hora}</small>
        `;
        contenedorConectados.appendChild(badge);
    });
}

// Dibuja la tabla de cuentas
function dibujarTabla() {
    const lista = obtenerUsuarios();
    const tbody = document.getElementById('tablaUsuarios');
    tbody.innerHTML = '';

    lista.forEach((u, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="fw-bold">${u.nombre || u.user}</td>
            <td><code>${u.user}</code></td>
            <td>${u.pass}</td>
            <td><span class="badge ${u.rol === 'Administrador' ? 'bg-dark' : 'bg-primary'}">${u.rol}</span></td>
            <td class="text-end">
                <button type="button" class="btn btn-sm btn-outline-primary btn-editar">Editar</button>
                <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar" ${u.user === 'admin' ? 'disabled' : ''}>Eliminar</button>
            </td>
        `;

        fila.querySelector('.btn-editar').addEventListener('click', () => editarCuenta(index));
        fila.querySelector('.btn-eliminar').addEventListener('click', () => eliminarCuenta(index));

        tbody.appendChild(fila);
    });

    actualizarEstadisticas();
}

function editarCuenta(index) {
    const u = obtenerUsuarios()[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('campoNombre').value = u.nombre || u.user;
    document.getElementById('campoUser').value = u.user;
    document.getElementById('campoPass').value = u.pass;
    document.getElementById('campoRol').value = u.rol;

    document.getElementById('tituloForm').textContent = 'Modificar Cuenta';
    document.getElementById('btnCancelarEdicion').classList.remove('d-none');
}

function eliminarCuenta(index) {
    if (!confirm('¿Eliminar esta cuenta y sus partidos guardados?')) return;
    const lista = obtenerUsuarios();
    const usuarioEliminado = lista[index];

    if (usuarioEliminado && usuarioEliminado.user) {
        localStorage.removeItem(`nba_favs_${usuarioEliminado.user}`);
        eliminarConexionActiva(usuarioEliminado.user);
    }

    lista.splice(index, 1);
    guardarUsuarios(lista);
    dibujarTabla();
}

function resetearFormulario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('editIndex').value = '-1';
    document.getElementById('tituloForm').textContent = 'Agregar Cuenta';
    document.getElementById('btnCancelarEdicion').classList.add('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
    dibujarTabla();

    document.getElementById('formUsuario').addEventListener('submit', (e) => {
        e.preventDefault();
        const lista = obtenerUsuarios();
        const index = parseInt(document.getElementById('editIndex').value);
        const rol = document.getElementById('campoRol').value;

        const datosCuenta = {
            nombre: document.getElementById('campoNombre').value.trim(),
            user: document.getElementById('campoUser').value.trim(),
            pass: document.getElementById('campoPass').value.trim(),
            rol: rol,
            url: rol === 'Administrador' ? 'admin.html' : 'nba.html'
        };

        if (index === -1) {
            lista.push(datosCuenta);
        } else {
            lista[index] = datosCuenta;
        }

        guardarUsuarios(lista);
        resetearFormulario();
        dibujarTabla();
    });

    document.getElementById('btnCancelarEdicion').addEventListener('click', resetearFormulario);

    // Botón para probar cómo sube el contador de conectados en vivo durante tu exposición
    document.getElementById('btnSimularVisita').addEventListener('click', () => {
        const conectados = JSON.parse(localStorage.getItem('nba_usuarios_conectados')) || [];
        const num = conectados.length + 1;
        const ahora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        conectados.push({
            user: `visitante_${num}`,
            nombre: `Fan Invitado #${num}`,
            rol: 'Usuario',
            hora: ahora
        });
        localStorage.setItem('nba_usuarios_conectados', JSON.stringify(conectados));
        actualizarEstadisticas();
    });
});