document.addEventListener('DOMContentLoaded', () => {
	
	const session = JSON.parse(localStorage.getItem('session')) || null;
	if (!session || session.role !== 'Administrador') {
		alert('Acceso restringido. Inicie sesión como administrador.');
		window.location.href = 'login.html';
		return;
	}

	
	const menuLinks = document.querySelectorAll('.admin-menu a[data-view]');
	const views = {
		dashboard: document.getElementById('view-dashboard'),
		products: document.getElementById('view-products'),
		users: document.getElementById('view-users')
	};
	const viewTitle = document.getElementById('viewTitle');
	const logoutLink = document.getElementById('logoutLink');

	
	const PRODUCTS_KEY = 'productosData';
    const USERS_KEY = 'usuariosAdmin';
    const PUBLIC_USERS_KEY = 'usuarios';
	const CATEGORIES_KEY = 'categoriasData';

	
	if (!localStorage.getItem(CATEGORIES_KEY)) {
		localStorage.setItem(CATEGORIES_KEY, JSON.stringify(window.CATEGORIAS || [
			{ id: 'deportes', nombre: 'Deportes' },
			{ id: 'indumentaria', nombre: 'Indumentaria' },
			{ id: 'accesorios', nombre: 'Accesorios' }
		]));
	}

	
	if (!localStorage.getItem(PRODUCTS_KEY)) {
		const seed = [
			{ codigo:'P-1', nombre:'Zapatos de Fútbol', descripcion:'Zapatos de fútbol con buena tracción.', precio:49990, stock:10, stockCritico:2, categoria:'deportes', imagen:'img/zapatos.jpg' },
			{ codigo:'P-2', nombre:'Polerón Deportivo', descripcion:'Polerón transpirable para entrenar.', precio:19990, stock:20, stockCritico:5, categoria:'indumentaria', imagen:'img/poleron.webp' },
			{ codigo:'P-3', nombre:'Shorts Deportivo', descripcion:'Shorts cómodos y flexibles.', precio:14990, stock:15, stockCritico:3, categoria:'indumentaria', imagen:'img/shorts.avif' },
			{ codigo:'P-4', nombre:'Calcetines Deportivos', descripcion:'Calcetines resistentes y cómodos.', precio:4990, stock:25, stockCritico:5, categoria:'indumentaria', imagen:'img/calcetines.webp' }
		];
		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seed));
	}

	// Navigation
	function setActive(view) {
		menuLinks.forEach(a => a.classList.toggle('active', a.dataset.view === view));
		Object.entries(views).forEach(([k, el]) => {
			if (!el) return;
			el.classList.toggle('hidden', k !== view);
		});
		viewTitle.textContent = view === 'dashboard' ? 'Inicio' : (view === 'products' ? 'Productos' : 'Usuarios');
	}
	menuLinks.forEach(a => a.addEventListener('click', e => {
		e.preventDefault();
		setActive(a.dataset.view);
		if (a.dataset.view === 'products') renderProducts();
		if (a.dataset.view === 'users') renderUsers();
	}));
	setActive('dashboard');

	logoutLink.addEventListener('click', (e) => {
		e.preventDefault();
		localStorage.removeItem('session');
		window.location.href = 'login.html';
	});

	
	const productsTableBody = document.querySelector('#productsTable tbody');
	const productSearch = document.getElementById('productSearch');
	const btnNewProduct = document.getElementById('btnNewProduct');
	const productFormCard = document.getElementById('productFormCard');
	const productForm = document.getElementById('productForm');
	const productFormTitle = document.getElementById('productFormTitle');
	const cancelProductForm = document.getElementById('cancelProductForm');
	const p_categoria = document.getElementById('p_categoria');

	function getCategories() {
		return JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];
	}
	function getProducts() {
		return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
	}
	function saveProducts(list) {
		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
	}
	function populateCategories() {
		p_categoria.innerHTML = '<option value="">Seleccione categoría</option>' + getCategories().map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
	}
	populateCategories();

	let editingCode = null;

	function renderProducts() {
		const term = (productSearch.value || '').toLowerCase();
		const rows = getProducts().filter(p =>
			!term || p.codigo.toLowerCase().includes(term) || p.nombre.toLowerCase().includes(term)
		).map(p => {
			const categoria = getCategories().find(c => c.id === p.categoria);
			const alerta = p.stockCritico != null && Number.isFinite(p.stockCritico) && p.stock <= p.stockCritico ? ' style="color:#b91c1c; font-weight:600;"' : '';
			return `<tr>
				<td>${p.codigo}</td>
				<td>${p.nombre}</td>
				<td>$${Number(p.precio).toFixed(2)}</td>
				<td${alerta}>${p.stock}</td>
				<td>${categoria ? categoria.nombre : ''}</td>
				<td class="actions">
					<button class="btn secondary" data-action="edit" data-code="${p.codigo}">Editar</button>
					<button class="btn" style="background:#dc2626" data-action="delete" data-code="${p.codigo}">Eliminar</button>
				</td>
			</tr>`;
		}).join('');
		productsTableBody.innerHTML = rows || '<tr><td colspan="6">Sin resultados</td></tr>';
	}

	productSearch.addEventListener('input', renderProducts);
	btnNewProduct.addEventListener('click', () => {
		editingCode = null;
		productForm.reset();
		populateCategories();
		productFormTitle.textContent = 'Nuevo Producto';
		productFormCard.classList.remove('hidden');
	});
	cancelProductForm.addEventListener('click', () => {
		productFormCard.classList.add('hidden');
	});

	productsTableBody.addEventListener('click', (e) => {
		const btn = e.target.closest('button[data-action]');
		if (!btn) return;
		const code = btn.getAttribute('data-code');
		if (btn.dataset.action === 'edit') {
			const prod = getProducts().find(p => p.codigo === code);
			if (!prod) return;
			editingCode = prod.codigo;
			productFormTitle.textContent = 'Editar Producto';
			productFormCard.classList.remove('hidden');
			document.getElementById('p_codigo').value = prod.codigo;
			document.getElementById('p_nombre').value = prod.nombre;
			document.getElementById('p_descripcion').value = prod.descripcion || '';
			document.getElementById('p_precio').value = prod.precio;
			document.getElementById('p_stock').value = prod.stock;
			document.getElementById('p_stockCritico').value = prod.stockCritico ?? '';
			populateCategories();
			document.getElementById('p_categoria').value = prod.categoria || '';
			document.getElementById('p_imagen').value = prod.imagen || '';
		}
		if (btn.dataset.action === 'delete') {
			if (!confirm('¿Eliminar producto?')) return;
			saveProducts(getProducts().filter(p => p.codigo !== code));
			renderProducts();
		}
	});

	function validateProductForm() {
		const codigo = document.getElementById('p_codigo').value.trim();
		const nombre = document.getElementById('p_nombre').value.trim();
		const descripcion = document.getElementById('p_descripcion').value.trim();
		const precio = parseFloat(document.getElementById('p_precio').value);
		const stock = parseInt(document.getElementById('p_stock').value, 10);
		const stockCriticoStr = document.getElementById('p_stockCritico').value.trim();
		const categoria = document.getElementById('p_categoria').value;
		const imagen = document.getElementById('p_imagen').value.trim();

		if (!codigo || codigo.length < 3) return { ok:false, msg:'Código requerido (mín 3).' };
		if (!nombre || nombre.length > 100) return { ok:false, msg:'Nombre requerido (máx 100).' };
		if (descripcion.length > 500) return { ok:false, msg:'Descripción máx 500.' };
		if (isNaN(precio) || precio < 0) return { ok:false, msg:'Precio inválido (>= 0).' };
		if (!Number.isInteger(stock) || stock < 0) return { ok:false, msg:'Stock inválido (entero >= 0).' };
		if (stockCriticoStr !== '') {
			const stockCritico = parseInt(stockCriticoStr, 10);
			if (!Number.isInteger(stockCritico) || stockCritico < 0) return { ok:false, msg:'Stock crítico inválido (entero >= 0).' };
		}
		if (!categoria) return { ok:false, msg:'Seleccione categoría.' };
		return { ok:true, data:{ codigo, nombre, descripcion, precio, stock, stockCritico: stockCriticoStr === '' ? null : parseInt(stockCriticoStr, 10), categoria, imagen } };
	}

	productForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const v = validateProductForm();
		if (!v.ok) { alert(v.msg); return; }
		const list = getProducts();
		if (editingCode) {
			const idx = list.findIndex(p => p.codigo === editingCode);
			if (idx !== -1) list[idx] = v.data;
		} else {
			// Prevent duplicate code
			if (list.some(p => p.codigo.toLowerCase() === v.data.codigo.toLowerCase())) {
				alert('Código ya existe.');
				return;
			}
			list.push(v.data);
		}
		saveProducts(list);
		productFormCard.classList.add('hidden');
		renderProducts();
	});

	// Users CRUD
	const usersTableBody = document.querySelector('#usersTable tbody');
	const userSearch = document.getElementById('userSearch');
	const btnNewUser = document.getElementById('btnNewUser');
	const userFormCard = document.getElementById('userFormCard');
	const userForm = document.getElementById('userForm');
	const userFormTitle = document.getElementById('userFormTitle');
	const cancelUserForm = document.getElementById('cancelUserForm');
	const regionSelect = document.getElementById('u_region');
	const comunaSelect = document.getElementById('u_comuna');

    function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    function saveUsers(list) { localStorage.setItem(USERS_KEY, JSON.stringify(list)); }
    function upsertPublicUsers(syncUser){
        // Mantener una lista pública para login de clientes y personal
        const pub = JSON.parse(localStorage.getItem(PUBLIC_USERS_KEY)) || [];
        const idx = pub.findIndex(u => u.email && u.email.toLowerCase() === (syncUser.correo||'').toLowerCase());
        const record = {
            nombre: syncUser.nombre,
            apellido: syncUser.apellidos || '',
            email: syncUser.correo,
            password: syncUser.password || '',
            role: syncUser.tipo || 'Cliente'
        };
        if (idx >= 0) pub[idx] = record; else pub.push(record);
        localStorage.setItem(PUBLIC_USERS_KEY, JSON.stringify(pub));
    }

	function populateRegiones() {
		const regiones = window.REGIONES || [];
		regionSelect.innerHTML = '<option value="">Seleccione región</option>' + regiones.map(r => `<option value="${r.nombre}">${r.nombre}</option>`).join('');
		comunaSelect.innerHTML = '<option value="">Seleccione comuna</option>';
	}
	regionSelect.addEventListener('change', () => {
		const regiones = window.REGIONES || [];
		const r = regiones.find(x => x.nombre === regionSelect.value);
		const comunas = r ? r.comunas : [];
		comunaSelect.innerHTML = '<option value="">Seleccione comuna</option>' + comunas.map(c => `<option value="${c}">${c}</option>`).join('');
	});
	populateRegiones();

	let editingRun = null;

	function renderUsers() {
		const term = (userSearch.value || '').toLowerCase();
		const rows = getUsers().filter(u =>
			!term || u.run.toLowerCase().includes(term) || u.nombre.toLowerCase().includes(term) || u.apellidos.toLowerCase().includes(term) || u.correo.toLowerCase().includes(term)
		).map(u => `
			<tr>
				<td>${u.run}</td>
				<td>${u.nombre}</td>
				<td>${u.apellidos}</td>
				<td>${u.correo}</td>
				<td>${u.tipo}</td>
				<td class="actions">
					<button class="btn secondary" data-action="edit-u" data-run="${u.run}">Editar</button>
					<button class="btn" style="background:#dc2626" data-action="delete-u" data-run="${u.run}">Eliminar</button>
				</td>
			</tr>`).join('');
		usersTableBody.innerHTML = rows || '<tr><td colspan="6">Sin resultados</td></tr>';
	}

	userSearch.addEventListener('input', renderUsers);
	btnNewUser.addEventListener('click', () => {
		editingRun = null;
		userForm.reset();
		populateRegiones();
		userFormTitle.textContent = 'Nuevo Usuario';
		userFormCard.classList.remove('hidden');
	});
	cancelUserForm.addEventListener('click', () => userFormCard.classList.add('hidden'));

	usersTableBody.addEventListener('click', (e) => {
		const btn = e.target.closest('button[data-action]');
		if (!btn) return;
		const run = btn.getAttribute('data-run');
		if (btn.dataset.action === 'edit-u') {
			const u = getUsers().find(x => x.run === run);
			if (!u) return;
			editingRun = u.run;
			userFormTitle.textContent = 'Editar Usuario';
			userFormCard.classList.remove('hidden');
			document.getElementById('u_run').value = u.run;
			document.getElementById('u_nombre').value = u.nombre;
			document.getElementById('u_apellidos').value = u.apellidos;
			document.getElementById('u_correo').value = u.correo;
            document.getElementById('u_password').value = u.password || '';
			document.getElementById('u_fecha').value = u.fecha || '';
			document.getElementById('u_tipo').value = u.tipo;
			populateRegiones();
			regionSelect.value = u.region || '';
			regionSelect.dispatchEvent(new Event('change'));
			comunaSelect.value = u.comuna || '';
			document.getElementById('u_direccion').value = u.direccion || '';
		}
		if (btn.dataset.action === 'delete-u') {
			if (!confirm('¿Eliminar usuario?')) return;
			saveUsers(getUsers().filter(x => x.run !== run));
			renderUsers();
		}
	});

	function validarRun(run) {
		// Validar largo y caracteres (sin puntos ni guion)
		if (!/^[0-9kK]{7,9}$/.test(run)) return false;
		// Validación de dígito verificador chileno
		const cuerpo = run.slice(0, -1);
		let dv = run.slice(-1).toUpperCase();
		let suma = 0; let multiplicador = 2;
		for (let i = cuerpo.length - 1; i >= 0; i--) {
			suma += parseInt(cuerpo[i], 10) * multiplicador;
			multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
		}
		const resto = 11 - (suma % 11);
		const dvCalculado = resto === 11 ? '0' : (resto === 10 ? 'K' : String(resto));
		return dv === dvCalculado;
	}

    function validateUserForm() {
		const run = document.getElementById('u_run').value.trim();
		const nombre = document.getElementById('u_nombre').value.trim();
		const apellidos = document.getElementById('u_apellidos').value.trim();
		const correo = document.getElementById('u_correo').value.trim();
        const password = document.getElementById('u_password').value.trim();
		const fecha = document.getElementById('u_fecha').value;
		const tipo = document.getElementById('u_tipo').value;
		const region = regionSelect.value;
		const comuna = comunaSelect.value;
		const direccion = document.getElementById('u_direccion').value.trim();

		if (!run || run.length < 7 || run.length > 9 || !validarRun(run)) return { ok:false, msg:'RUN inválido. Ej: 19011022K' };
		if (!nombre || nombre.length > 50) return { ok:false, msg:'Nombre requerido (máx 50).' };
		if (!apellidos || apellidos.length > 100) return { ok:false, msg:'Apellidos requeridos (máx 100).' };
		if (!correo || correo.length > 100) return { ok:false, msg:'Correo requerido (máx 100).' };
		if (!/^.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo)) return { ok:false, msg:'Dominio de correo no permitido.' };
        if (!tipo) return { ok:false, msg:'Seleccione tipo de usuario.' };
        if (password && (password.length < 4 || password.length > 50)) return { ok:false, msg:'Contraseña 4-50 caracteres o déjela vacía.' };
		if (!direccion || direccion.length > 300) return { ok:false, msg:'Dirección requerida (máx 300).' };
        return { ok:true, data:{ run, nombre, apellidos, correo, password, fecha, tipo, region, comuna, direccion } };
	}

	userForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const v = validateUserForm();
		if (!v.ok) { alert(v.msg); return; }
		const list = getUsers();
        if (editingRun) {
			const idx = list.findIndex(u => u.run === editingRun);
            if (idx !== -1) list[idx] = v.data;
		} else {
			if (list.some(u => u.run.toLowerCase() === v.data.run.toLowerCase())) {
				alert('RUN ya existe.');
				return;
			}
			list.push(v.data);
		}
		saveUsers(list);
        // sincronizar con la lista pública para login
        upsertPublicUsers(v.data);
		userFormCard.classList.add('hidden');
		renderUsers();
	});

	// Initial renders when switching to each view
	// (leave dashboard by default)
});


