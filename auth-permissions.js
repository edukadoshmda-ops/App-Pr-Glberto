/**
 * auth-permissions.js
 * Gerenciador Central de Permissões, Degustação de 7 Dias e Controle de Acesso
 * 
 * Regras:
 * 1. Degustação de 7 dias grátis:
 *    - Vídeos: TODOS LIBERADOS para assistir.
 *    - Outros itens (Audiobook, Play Books, Artigos): LIBERA APENAS 1 ITEM de demonstração.
 * 2. Usuário Comum:
 *    - Vê abas: Painel, Audio Book, Play Books, Vídeos, Artigos, Configurações, Apoio.
 *    - NÃO vê: Relatórios, Usuários, Criar.
 *    - NÃO posta/publica e NÃO exclui conteúdos.
 * 3. Administrador (Admin):
 *    - Vê tudo, posta tudo, edita tudo e exclui tudo.
 */

(function() {
    const adminEmails = [
        'gilbertobertho@gmail.com',
        'gilbertbertho@gmail.com'
    ];

    function isUserAdmin() {
        const userEmail = (localStorage.getItem('userEmail') || '').toLowerCase().trim();
        const isAdminFlag = localStorage.getItem('isAdmin') === 'true';
        return isAdminFlag || adminEmails.includes(userEmail);
    }

    function isSubscriber() {
        if (isUserAdmin()) return true;
        const status = localStorage.getItem('userStatus');
        const isSub = localStorage.getItem('isSubscriber') === 'true' || localStorage.getItem('hasPaidPlan') === 'true';
        return isSub && status === 'approved';
    }

    function getTrialStatus() {
        if (isUserAdmin() || isSubscriber()) {
            return { isTrial: false, isExpired: false, daysRemaining: 7, isSubscriber: true };
        }

        const createdAtStr = localStorage.getItem('userCreatedAt') || localStorage.getItem('loginDate');
        const createdAt = createdAtStr ? new Date(createdAtStr) : new Date();
        const now = new Date();
        const diffMs = now - createdAt;
        const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, 7 - daysPassed);
        const isExpired = daysPassed > 7;

        return {
            isTrial: !isExpired,
            isExpired: isExpired,
            daysRemaining: daysRemaining,
            isSubscriber: false
        };
    }

    /**
     * Valida acesso a um item específico
     * @param {string} moduleType 'videos' | 'playbooks' | 'audiobook' | 'artigos'
     * @param {string|number} itemIdentifier ID do item
     * @param {number} itemIndex Índice do item na lista (0-based)
     */
    function checkItemAccess(moduleType, itemIdentifier, itemIndex = 0) {
        if (isUserAdmin() || isSubscriber()) return true;

        const trial = getTrialStatus();

        if (trial.isExpired) {
            showAccessModal(
                'Período de Degustação Encerrado',
                'Seu período de teste grátis de 7 dias encerrou. Adquira o acesso completo para continuar aproveitando todos os conteúdos exclusivos do Pr. Gilberto Penido Bertho!'
            );
            return false;
        }

        // Durante o período de degustação (7 dias grátis):
        // 1. Vídeos: TODOS LIBERADOS
        if (moduleType === 'videos') {
            return true;
        }

        // 2. Audiobook, Play Books, Artigos: Libera SOMENTE 1 item (item de degustação liberado)
        let isFirstItem = false;
        if (moduleType === 'audiobook') {
            isFirstItem = (itemIdentifier === 'lideranca' || itemIndex === 0);
        } else if (moduleType === 'playbooks') {
            isFirstItem = (itemIdentifier === 'lideranca' || itemIdentifier === 'habitos' || itemIndex === 0);
        } else if (moduleType === 'artigos') {
            isFirstItem = (itemIndex === 0 || itemIdentifier === 'artigo-01');
        } else {
            isFirstItem = (itemIndex === 0);
        }

        if (isFirstItem) {
            return true;
        }

        const moduleNames = {
            'audiobook': 'Audiobooks',
            'playbooks': 'Play Books',
            'artigos': 'Artigos',
            'projetos': 'Projetos'
        };

        const moduleName = moduleNames[moduleType] || 'Conteúdo';

        showAccessModal(
            'Item Bloqueado na Degustação Grátis (7 Dias)',
            `Durante a degustação de 7 dias grátis, você tem <strong>acesso liberado a 1 ${moduleName.slice(0, -1)} de demonstração</strong> e a <strong>todos os Vídeos</strong>.<br><br>Para desbloquear todos os ${moduleName}, assine o plano completo da plataforma!`
        );
        return false;
    }

    // Modal Elegante de Assinatura / Upgrade
    function showAccessModal(title, message) {
        let modal = document.getElementById('accessRestrictionModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'accessRestrictionModal';
            modal.style.cssText = `
                display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.85); z-index: 99999; justify-content: center;
                align-items: center; backdrop-filter: blur(6px);
            `;
            modal.innerHTML = `
                <div style="
                    background: #0a1329; border: 1.5px solid #cda451; border-radius: 20px;
                    padding: 32px 26px; max-width: 450px; width: 90%; text-align: center;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.7);
                ">
                    <div style="
                        width: 64px; height: 64px; border-radius: 50%; background: rgba(245, 181, 46, 0.15);
                        border: 1.5px solid #f5b52e; color: #f5b52e; display: flex; align-items: center;
                        justify-content: center; font-size: 26px; margin: 0 auto 16px auto;
                    ">
                        <i class="fas fa-crown"></i>
                    </div>
                    <h3 id="accessModalTitle" style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;"></h3>
                    <p id="accessModalMessage" style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;"></p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <button onclick="document.getElementById('accessRestrictionModal').style.display='none'" style="
                            padding: 12px 18px; border-radius: 10px; background: rgba(255,255,255,0.08);
                            border: 1px solid rgba(255,255,255,0.15); color: #ffffff; font-weight: 600; cursor: pointer;
                        ">Entendido</button>
                        <a href="compra.html" style="
                            padding: 12px 22px; border-radius: 10px; background: linear-gradient(135deg, #f5b52e, #d99a18);
                            color: #0a0f1d; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center;
                            gap: 8px; cursor: pointer;
                        "><i class="fas fa-unlock-alt"></i> Assinar Plano</a>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        document.getElementById('accessModalTitle').innerHTML = title;
        document.getElementById('accessModalMessage').innerHTML = message;
        modal.style.display = 'flex';
    }

    // Aplica regras de visibilidade e proteção de rotas
    function applyUserPermissions() {
        const isAdmin = isUserAdmin();
        const currentPath = window.location.pathname.toLowerCase();

        // 1. Proteger páginas administrativas diretas
        const adminOnlyPages = [
            'usuarios.html',
            'relatorios.html',
            'criar.html',
            'adicionar-video.html',
            'adicionar-artigo.html',
            'adicionar-projeto.html',
            'estudio-audio.html',
            'painel-root.html'
        ];

        const isCurrentPageAdminOnly = adminOnlyPages.some(page => currentPath.endsWith(page));
        if (isCurrentPageAdminOnly && !isAdmin) {
            alert('Acesso Restrito: Esta área é exclusiva para administradores.');
            window.location.href = 'dashboard.html';
            return;
        }

        // 2. Se for Usuário Comum:
        if (!isAdmin) {
            // Ocultar itens administrativos do menu da sidebar
            const menuLinks = document.querySelectorAll('.menu-item, .sidebar-nav a, nav a');
            menuLinks.forEach(link => {
                const href = (link.getAttribute('href') || '').toLowerCase();
                if (href.includes('usuarios.html') || href.includes('relatorios.html') || href.includes('criar.html')) {
                    link.style.display = 'none';
                }
            });

            // Ocultar botões de exclusão e criação em todas as telas
            const selectorsToHide = [
                '.delete-btn',
                '.delete-audiobook-btn',
                '.delete-playbook-btn',
                '.delete-article-btn',
                '.delete-video-btn',
                'button[onclick*="deleteVideo"]',
                'button[onclick*="deleteArticle"]',
                'button[onclick*="deletePlaybook"]',
                'button[onclick*="deleteAudiobook"]',
                'button[onclick*="openNewUserModal"]',
                'a[href="criar.html"]',
                'a[href="adicionar-video.html"]',
                'a[href="adicionar-artigo.html"]',
                'a[href="adicionar-projeto.html"]'
            ];

            selectorsToHide.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.display = 'none';
                });
            });
        }
    }

    function getUserStatus() {
        if (isUserAdmin()) return 'approved';
        return localStorage.getItem('userStatus') || 'pending';
    }

    // Disponibiliza na janela global
    window.AppPermissions = {
        isUserAdmin,
        isSubscriber,
        getUserStatus,
        getTrialStatus,
        checkItemAccess,
        showAccessModal,
        applyUserPermissions
    };

    // Executa ao carregar o DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyUserPermissions);
    } else {
        applyUserPermissions();
    }
})();
