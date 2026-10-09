// ==========================================================================
// LÓGICA E FUNCIONALIDADES DO KOPESA EXPRESS
// ==========================================================================

let modoAuth = 'entrar';
let usuarioAtual = JSON.parse(localStorage.getItem('kopesa_usuario_atual')) || null;
let carrinho = JSON.parse(localStorage.getItem('kopesa_carrinho')) || [];

document.addEventListener('DOMContentLoaded', () => {
    verificarEstadoSessao();
    atualizarBadgeCarrinho();
});

// Alternar entre Entrar e Criar Conta no formulário
function mudarModoAuth(modo) {
    modoAuth = modo;
    const tabEntrar = document.getElementById('tab-entrar');
    const tabCriar = document.getElementById('tab-criar');
    const grupoNome = document.getElementById('grupo-nome');
    const btnSubmit = document.getElementById('btn-submit-auth');

    if (modo === 'entrar') {
        tabEntrar.classList.add('ativo');
        tabCriar.classList.remove('ativo');
        grupoNome.classList.add('oculto');
        btnSubmit.innerText = 'Entrar na Plataforma';
    } else {
        tabCriar.classList.add('ativo');
        tabEntrar.classList.remove('ativo');
        grupoNome.classList.remove('oculto');
        btnSubmit.innerText = 'Criar Conta';
    }
}

// Processar Autenticação (Login / Registo)
function processarAutenticacao(event) {
    event.preventDefault();
    const contacto = document.getElementById('auth-contacto').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    const perfil = document.getElementById('auth-perfil').value;
    const nome = document.getElementById('auth-nome').value.trim();

    let utilizadores = JSON.parse(localStorage.getItem('kopesa_utilizadores')) || [];

    if (modoAuth === 'criar') {
        if (!nome) {
            alert('Por favor, insira o seu nome.');
            return;
        }
        const existe = utilizadores.find(u => u.contacto === contacto);
        if (existe) {
            alert('Este contacto já está registado.');
            return;
        }
        const novoUser = { nome, contacto, password, tipo: perfil };
        utilizadores.push(novoUser);
        localStorage.setItem('kopesa_utilizadores', JSON.stringify(utilizadores));
        
        usuarioAtual = novoUser;
        alert('Conta criada com sucesso!');
    } else {
        const user = utilizadores.find(u => u.contacto === contacto && u.password === password);
        if (!user) {
            alert('Contacto ou palavra-passe incorretos.');
            return;
        }
        usuarioAtual = user;
    }

    localStorage.setItem('kopesa_usuario_atual', JSON.stringify(usuarioAtual));
    mostrarEcraEscolha();
}

// Terminar Sessão
function realizarLogout() {
    usuarioAtual = null;
    localStorage.removeItem('kopesa_usuario_atual');
    verificarEstadoSessao();
}

// Gestão de Ecrãs Ativos
function verificarEstadoSessao() {
    const ecraAuth = document.getElementById('ecra-auth');
    const ecraEscolha = document.getElementById('ecra-escolha');
    const ecraCliente = document.getElementById('ecra-cliente');
    const ecraVendedor = document.getElementById('ecra-vendedor');
    const ecraAdmin = document.getElementById('ecra-admin');
    const badgeUtilizador = document.getElementById('badge-utilizador');
    const btnCarrinho = document.getElementById('btn-carrinho');

    if (ecraAuth) ecraAuth.classList.add('oculto');
    if (ecraEscolha) ecraEscolha.classList.add('oculto');
    if (ecraCliente) ecraCliente.classList.add('oculto');
    if (ecraVendedor) ecraVendedor.classList.add('oculto');
    if (ecraAdmin) ecraAdmin.classList.add('oculto');

    if (usuarioAtual) {
        if (badgeUtilizador) badgeUtilizador.innerText = `${usuarioAtual.nome} (${usuarioAtual.tipo})`;
        logoutBtnVisibility(true);
        mostrarEcraEscolha();
    } else {
        if (ecraAuth) ecraAuth.classList.remove('oculto');
        if (badgeUtilizador) badgeUtilizador.innerText = '';
        logoutBtnVisibility(false);
        if (btnCarrinho) btnCarrinho.classList.add('oculto');
    }
}

function mostrarEcraEscolha() {
    const ecraAuth = document.getElementById('ecra-auth');
    const ecraEscolha = document.getElementById('ecra-escolha');
    const ecraCliente = document.getElementById('ecra-cliente');
    const ecraVendedor = document.getElementById('ecra-vendedor');
    const ecraAdmin = document.getElementById('ecra-admin');

    if (ecraAuth) ecraAuth.classList.add('oculto');
    if (ecraCliente) ecraCliente.classList.add('oculto');
    if (ecraVendedor) ecraVendedor.classList.add('oculto');
    if (ecraAdmin) ecraAdmin.classList.add('oculto');
    if (ecraEscolha) ecraEscolha.classList.remove('oculto');
    
    const btnCarrinho = document.getElementById('btn-carrinho');
    if (btnCarrinho) btnCarrinho.classList.add('oculto');
}

function irParaMarketplace() {
    const ecraEscolha = document.getElementById('ecra-escolha');
    const ecraCliente = document.getElementById('ecra-cliente');
    const btnCarrinho = document.getElementById('btn-carrinho');

    if (ecraEscolha) ecraEscolha.classList.add('oculto');
    if (ecraCliente) ecraCliente.classList.remove('oculto');
    if (btnCarrinho) btnCarrinho.classList.remove('oculto');
    carregarProdutosMarketplace();
}

function irParaPainelVendedor() {
    const ecraEscolha = document.getElementById('ecra-escolha');
    const ecraVendedor = document.getElementById('ecra-vendedor');

    if (ecraEscolha) ecraEscolha.classList.add('oculto');
    if (ecraVendedor) ecraVendedor.classList.remove('oculto');
    carregarPainelVendedorResumo();
}

function voltarParaEscolha() {
    mostrarEcraEscolha();
}

function logoutBtnVisibility(mostrar) {
    const btn = document.getElementById('btn-logout');
    if (btn) {
        if (mostrar) btn.classList.remove('oculto');
        else btn.classList.add('oculto');
    }
}

function irParaHome() {
    if (usuarioAtual) {
        mostrarEcraEscolha();
    } else {
        verificarEstadoSessao();
    }
}

// ==========================================
// PUBLICAÇÃO DE PRODUTOS (NO KOPESA MARKET)
// ==========================================
function abrirModalNovoProduto() {
    document.getElementById('modal-produto').classList.remove('oculto');
}

function fecharModalNovoProduto() {
    document.getElementById('modal-produto').classList.add('oculto');
}

function guardarNovoProduto(event) {
    event.preventDefault();
    const nome = document.getElementById('prod-nome').value.trim();
    const valor = Number(document.getElementById('prod-valor').value);
    const contacto = document.getElementById('prod-contacto').value.trim();
    const fotoInput = document.getElementById('prod-foto');

    let produtos = JSON.parse(localStorage.getItem('kopesa_produtos')) || [];

    const salvarItem = (imgUrl) => {
        const novoProd = {
            id: Date.now().toString(),
            nome,
            valor,
            contacto,
            vendedor: usuarioAtual ? usuarioAtual.nome : 'Anónimo',
            foto: imgUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'
        };
        produtos.push(novoProd);
        localStorage.setItem('kopesa_produtos', JSON.stringify(produtos));
        
        fecharModalNovoProduto();
        document.querySelector('#modal-produto form').reset();
        
        carregarProdutosMarketplace();
        alert('Produto publicado com sucesso no Kopesa Market!');
    };

    if (fotoInput.files && fotoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            salvarItem(e.target.result);
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        salvarItem('');
    }
}

// ==========================================
// PAINEL DO VENDEDOR (SÓ TOTAL E ESTADO)
// ==========================================
function carregarPainelVendedorResumo() {
    if (!usuarioAtual) return;
    let produtos = JSON.parse(localStorage.getItem('kopesa_produtos')) || [];
    const meusProdutos = produtos.filter(p => p.vendedor === usuarioAtual.nome);

    const statTotal = document.getElementById('stat-total-produtos');
    if (statTotal) statTotal.innerText = meusProdutos.length;
}

// ==========================================
// MARKETPLACE E CARRINHO (CLIENTE)
// ==========================================
function carregarProdutosMarketplace() {
    let produtos = JSON.parse(localStorage.getItem('kopesa_produtos')) || [];
    const lista = document.getElementById('lista-produtos-cliente');
    if (!lista) return;

    if (produtos.length === 0) {
        lista.innerHTML = `<p style="color: var(--texto-cinza); text-align: center; grid-column: 1/-1; padding: 20px;">Ainda não há produtos publicados.</p>`;
        return;
    }

    lista.innerHTML = '';
    produtos.forEach(p => {
        lista.innerHTML += `
            <div class="produto-card">
                <img src="${p.foto}" alt="${p.nome}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 6px; margin-bottom: 10px; background: #14100e;">
                <h4 style="font-size: 1rem; margin-bottom: 4px; color: var(--texto-claro);">${p.nome}</h4>
                <div style="color: var(--cor-destaque); font-weight: 600; margin-bottom: 8px;">${Number(p.valor).toLocaleString()} Kz</div>
                <p style="font-size: 0.75rem; color: var(--texto-cinza); margin-bottom: 12px;">Contacto: ${p.contacto}</p>
                <button class="btn-principal" style="padding: 8px; font-size: 0.85rem;" onclick='adicionarAoCarrinho(${JSON.stringify(p)})'>Adicionar ao Carrinho</button>
            </div>
        `;
    });
}

function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    localStorage.setItem('kopesa_carrinho', JSON.stringify(carrinho));
    atualizarBadgeCarrinho();
    alert('Produto adicionado ao carrinho!');
}

function atualizarBadgeCarrinho() {
    const badge = document.getElementById('badge-carrinho');
    if (badge) badge.innerText = carrinho.length;
}

function abrirCarrinho() {
    document.getElementById('modal-carrinho').classList.remove('oculto');
    const container = document.getElementById('itens-carrinho-lista');
    const totalEl = document.getElementById('carrinho-total-valor');

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="color: var(--texto-cinza); text-align: center;">O carrinho está vazio.</p>';
        totalEl.innerText = '0 Kz';
        return;
    }

    container.innerHTML = '';
    let total = 0;
    carrinho.forEach((item, index) => {
        total += item.valor;
        container.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid var(--borda-input); padding-bottom: 6px;">
                <div>
                    <span style="font-size: 0.9rem;">${item.nome}</span><br>
                    <small style="color: var(--cor-destaque);">${item.valor.toLocaleString()} Kz (Proprietário: ${item.contacto})</small>
                </div>
                <button class="btn-perigo" style="padding: 4px 8px; font-size: 0.7rem;" onclick="removerDoCarrinho(${index})">Remover</button>
            </div>
        `;
    });
    totalEl.innerText = total.toLocaleString() + ' Kz';
}

function fecharCarrinho() {
    document.getElementById('modal-carrinho').classList.add('oculto');
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('kopesa_carrinho', JSON.stringify(carrinho));
    atualizarBadgeCarrinho();
    abrirCarrinho();
}

function finalizarSolicacaoCompra() {
    if (carrinho.length === 0) return;

    let totalCompra = carrinho.reduce((acc, item) => acc + item.valor, 0);
    let comissaoCriador = totalCompra * 0.10;

    let adminDados = JSON.parse(localStorage.getItem('kopesa_admin_financeiro')) || { vendas: 0, comissoes: 0 };
    adminDados.vendas += totalCompra;
    adminDados.comissoes += comissaoCriador;
    localStorage.setItem('kopesa_admin_financeiro', JSON.stringify(adminDados));

    let contactosVendedores = carrinho.map(i => `${i.nome} (${i.contacto})`).join(', ');

    alert(`Compra solicitada com sucesso!\n\nA comissão da plataforma foi descontada.\nEntre em contacto direto com o(s) proprietário(s): ${contactosVendedores} para acertar a entrega.`);

    carrinho = [];
    localStorage.removeItem('kopesa_carrinho');
    atualizarBadgeCarrinho();
    fecharCarrinho();
}

// ==========================================
// PAINEL ADMINISTRADOR (PIN 1504)
// ==========================================
function solicitarPinAdmin() {
    const pin = prompt("Insira o PIN de 4 dígitos do Administrador:");
    if (pin === "1504") {
        abrirPainelAdmin();
    } else if (pin !== null) {
        alert("PIN incorreto.");
    }
}

function abrirPainelAdmin() {
    const ecraAuth = document.getElementById('ecra-auth');
    const ecraEscolha = document.getElementById('ecra-escolha');
    const ecraCliente = document.getElementById('ecra-cliente');
    const ecraVendedor = document.getElementById('ecra-vendedor');
    const ecraAdmin = document.getElementById('ecra-admin');

    if (ecraAuth) ecraAuth.classList.add('oculto');
    if (ecraEscolha) ecraEscolha.classList.add('oculto');
    if (ecraCliente) ecraCliente.classList.add('oculto');
    if (ecraVendedor) ecraVendedor.classList.add('oculto');
    if (ecraAdmin) ecraAdmin.classList.remove('oculto');

    let adminDados = JSON.parse(localStorage.getItem('kopesa_admin_financeiro')) || { vendas: 0, comissoes: 0 };
    document.getElementById('admin-total-vendas').innerText = adminDados.vendas.toLocaleString() + ' Kz';
    document.getElementById('admin-comissoes').innerText = adminDados.comissoes.toLocaleString() + ' Kz';
}

function realizarSaqueAdmin() {
    const conta = document.getElementById('admin-conta-saque').value.trim();
    const valor = Number(document.getElementById('admin-valor-saque').value);

    if (!conta || !valor) {
        alert('Preencha a conta/MCX e o valor do saque.');
        return;
    }

    let adminDados = JSON.parse(localStorage.getItem('kopesa_admin_financeiro')) || { vendas: 0, comissoes: 0 };
    if (valor > adminDados.comissoes) {
        alert('Saldo de comissões insuficiente para este saque.');
        return;
    }

    adminDados.comissoes -= valor;
    localStorage.setItem('kopesa_admin_financeiro', JSON.stringify(adminDados));

    alert(`Solicitação de saque de ${valor.toLocaleString()} Kz efetuada com sucesso para ${conta}!`);
    document.getElementById('admin-conta-saque').value = '';
    document.getElementById('admin-valor-saque').value = '';
    abrirPainelAdmin();
}