// ===== GALERIA INTERATIVA =====

// Inicializar galeria quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    initTestimonials();
    initGalleryAnimations();
});

// Variáveis globais da galeria
let currentGalleryIndex = 0;
let galleryItems = [];
let currentFilter = 'all';

// Inicializar galeria
function initGallery() {
    // Selecionar elementos
    const filterButtons = document.querySelectorAll('.filter-btn');
    galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    // Criar mensagem de "nenhum resultado"
    createNoResultsMessage();
    
    // Configurar filtros
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover classe active de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Adicionar classe active ao botão clicado
                this.classList.add('active');
                
                // Adicionar efeito visual de clique
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Obter valor do filtro
                currentFilter = this.getAttribute('data-filter');
                
                // Aplicar filtro
                filterGallery(currentFilter);
            });
        });
    }
    
    // Configurar itens da galeria para abrir modal
    galleryItems.forEach((item, index) => {
        // Adicionar índice como atributo
        item.setAttribute('data-index', index);
        
        // Adicionar categoria como atributo para o CSS
        const category = item.getAttribute('data-category');
        item.setAttribute('data-category', category);
        
        // Adicionar efeito de hover com delay
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Adicionar evento de clique
        item.addEventListener('click', function(e) {
            e.preventDefault();
            currentGalleryIndex = parseInt(this.getAttribute('data-index'));
            openModal(currentGalleryIndex);
        });
        
        // Adicionar evento de teclado (acessibilidade)
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentGalleryIndex = parseInt(this.getAttribute('data-index'));
                openModal(currentGalleryIndex);
            }
        });
        
        // Tornar item focável para acessibilidade
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Ver ${item.querySelector('h3').textContent}`);
    });
    
    // Configurar modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalPrev) {
        modalPrev.addEventListener('click', showPrevImage);
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', showNextImage);
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
        
        // Navegação com teclado no modal
        if (modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Inicializar com todos os itens visíveis
    filterGallery('all');
}

// Criar mensagem de "nenhum resultado encontrado"
function createNoResultsMessage() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
        <i class="fas fa-search"></i>
        <h3>Nenhum resultado encontrado</h3>
        <p>Tente selecionar outra categoria ou entre em contato para saber mais sobre nossos espaços.</p>
        <button class="btn btn-primary mt-3" onclick="resetFilter()">Mostrar todos</button>
    `;
    
    galleryGrid.parentNode.insertBefore(noResults, galleryGrid.nextSibling);
}

// Filtrar galeria
function filterGallery(filterValue) {
    let visibleItems = 0;
    const galleryGrid = document.querySelector('.gallery-grid');
    const noResults = document.querySelector('.no-results');
    
    // Adicionar efeito de fade out
    galleryItems.forEach(item => {
        item.style.opacity = '0.5';
        item.style.transform = 'scale(0.95)';
        item.style.transition = 'all 0.4s ease';
    });
    
    // Aplicar filtro após um pequeno delay para efeito visual
    setTimeout(() => {
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filterValue === 'all' || filterValue === category) {
                item.style.display = 'block';
                
                // Adicionar animação de entrada
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
                
                visibleItems++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mostrar/ocultar mensagem de "nenhum resultado"
        if (noResults) {
            if (visibleItems === 0) {
                noResults.style.display = 'block';
                
                // Animar a mensagem
                noResults.style.opacity = '0';
                noResults.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    noResults.style.opacity = '1';
                    noResults.style.transform = 'translateY(0)';
                    noResults.style.transition = 'all 0.6s ease';
                }, 100);
            } else {
                noResults.style.display = 'none';
            }
        }
        
        // Animar o grid
        if (galleryGrid) {
            galleryGrid.style.opacity = '0.8';
            galleryGrid.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                galleryGrid.style.opacity = '1';
                galleryGrid.style.transform = 'translateY(0)';
                galleryGrid.style.transition = 'all 0.5s ease';
            }, 300);
        }
        
        // Rolar para o topo da galeria suavemente
        if (visibleItems > 0) {
            const gallerySection = document.querySelector('.gallery-section');
            if (gallerySection) {
                setTimeout(() => {
                    gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, 200);
}

// Resetar filtro (para o botão na mensagem de nenhum resultado)
function resetFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'all') {
            btn.click();
        }
    });
}

// Abrir modal
function openModal(index) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalCategory = document.getElementById('modalCategory');
    
    if (!galleryItems[index]) return;
    
    // Obter dados do item
    const item = galleryItems[index];
    const title = item.querySelector('h3').textContent;
    const description = item.querySelector('p').textContent;
    const category = item.getAttribute('data-category');
    const iconClass = item.querySelector('.gallery-img i').className;
    
    // Atualizar conteúdo do modal
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalCategory.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Criar nova imagem (ícone) para o modal
    modalImage.innerHTML = `<i class="${iconClass}"></i>`;
    
    // Atualizar título do modal para acessibilidade
    modal.setAttribute('aria-label', `Visualizando: ${title}`);
    
    // Mostrar modal com animação
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Atualizar índices de navegação
    currentGalleryIndex = index;
    
    // Adicionar foco no botão de fechar para acessibilidade
    setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }, 100);
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    
    // Adicionar animação de saída
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.classList.remove('active');
        modal.style.opacity = '';
        document.body.style.overflow = 'auto';
        
        // Retornar foco para o item da galeria que foi aberto
        if (galleryItems[currentGalleryIndex]) {
            galleryItems[currentGalleryIndex].focus();
        }
    }, 300);
}

// Mostrar imagem anterior
function showPrevImage() {
    // Encontrar itens visíveis na categoria atual
    const visibleItems = Array.from(galleryItems).filter(item => {
        if (currentFilter === 'all') return item.style.display !== 'none';
        
        const category = item.getAttribute('data-category');
        return item.style.display !== 'none' && category === currentFilter;
    });
    
    if (visibleItems.length === 0) return;
    
    // Encontrar índice atual entre os itens visíveis
    const currentItem = galleryItems[currentGalleryIndex];
    const currentVisibleIndex = visibleItems.indexOf(currentItem);
    
    // Calcular novo índice
    let newIndex;
    if (currentVisibleIndex <= 0) {
        // Ir para o último item
        const lastVisibleItem = visibleItems[visibleItems.length - 1];
        newIndex = parseInt(lastVisibleItem.getAttribute('data-index'));
    } else {
        // Ir para o item anterior
        const prevVisibleItem = visibleItems[currentVisibleIndex - 1];
        newIndex = parseInt(prevVisibleItem.getAttribute('data-index'));
    }
    
    // Abrir modal com novo item
    openModal(newIndex);
    
    // Adicionar efeito visual
    const modalPrev = document.querySelector('.modal-prev');
    if (modalPrev) {
        modalPrev.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modalPrev.style.transform = '';
        }, 150);
    }
}

// Mostrar próxima imagem
function showNextImage() {
    // Encontrar itens visíveis na categoria atual
    const visibleItems = Array.from(galleryItems).filter(item => {
        if (currentFilter === 'all') return item.style.display !== 'none';
        
        const category = item.getAttribute('data-category');
        return item.style.display !== 'none' && category === currentFilter;
    });
    
    if (visibleItems.length === 0) return;
    
    // Encontrar índice atual entre os itens visíveis
    const currentItem = galleryItems[currentGalleryIndex];
    const currentVisibleIndex = visibleItems.indexOf(currentItem);
    
    // Calcular novo índice
    let newIndex;
    if (currentVisibleIndex >= visibleItems.length - 1) {
        // Ir para o primeiro item
        const firstVisibleItem = visibleItems[0];
        newIndex = parseInt(firstVisibleItem.getAttribute('data-index'));
    } else {
        // Ir para o próximo item
        const nextVisibleItem = visibleItems[currentVisibleIndex + 1];
        newIndex = parseInt(nextVisibleItem.getAttribute('data-index'));
    }
    
    // Abrir modal com novo item
    openModal(newIndex);
    
    // Adicionar efeito visual
    const modalNext = document.querySelector('.modal-next');
    if (modalNext) {
        modalNext.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modalNext.style.transform = '';
        }, 150);
    }
}

// ===== DEPOIMENTOS (SLIDER) =====
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (testimonials.length === 0) return;
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Função para mostrar depoimento
    function showTestimonial(index) {
        // Validar índice
        if (index < 0) index = testimonials.length - 1;
        if (index >= testimonials.length) index = 0;
        
        // Remover classe active de todos os depoimentos
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remover active de todos os dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Mostrar depoimento atual com animação
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
        
        // Atualizar acessibilidade
        updateTestimonialAccessibility(index);
    }
    
    // Atualizar atributos de acessibilidade
    function updateTestimonialAccessibility(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.setAttribute('aria-hidden', i !== index);
            testimonial.setAttribute('tabindex', i === index ? '0' : '-1');
        });
        
        dots.forEach((dot, i) => {
            dot.setAttribute('aria-selected', i === index);
            dot.setAttribute('tabindex', i === index ? '0' : '-1');
        });
    }
    
    // Event listeners para dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            resetAutoSlide();
            showTestimonial(index);
        });
        
        // Acessibilidade com teclado
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                resetAutoSlide();
                showTestimonial(index);
            }
        });
    });
    
    // Botão anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            resetAutoSlide();
            showTestimonial(currentIndex - 1);
            
            // Efeito visual
            prevBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                prevBtn.style.transform = '';
            }, 150);
        });
    }
    
    // Botão próximo
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            resetAutoSlide();
            showTestimonial(currentIndex + 1);
            
            // Efeito visual
            nextBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                nextBtn.style.transform = '';
            }, 150);
        });
    }
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            resetAutoSlide();
            showTestimonial(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            resetAutoSlide();
            showTestimonial(currentIndex + 1);
        }
    });
    
    // Reiniciar auto-slide
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Iniciar auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showTestimonial(currentIndex + 1);
        }, 8000); // Mudar a cada 8 segundos
    }
    
    // Inicializar
    showTestimonial(0);
    startAutoSlide();
    
    // Pausar auto-slide quando o mouse estiver sobre o slider
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
}

// ===== ANIMAÇÕES ESPECÍFICAS DA GALERIA =====
function initGalleryAnimations() {
    // Animar entrada dos itens da galeria com delay
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        // Atraso progressivo baseado no índice
        const delay = index * 0.1;
        
        // Configurar animação inicial
        item.style.animationDelay = `${delay}s`;
        item.style.opacity = '0';
        
        // Garantir que a animação seja aplicada
        setTimeout(() => {
            item.classList.add('animated');
        }, 100);
    });
    
    // Observador de interseção para animações ao rolar
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Animar filtro quando entrar na view
                if (entry.target.classList.contains('gallery-filter')) {
                    animateFilterButtons();
                }
                
                // Animar CTA quando entrar na view
                if (entry.target.classList.contains('cta-agendamento')) {
                    animateCTA();
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos da galeria
    const elementsToObserve = document.querySelectorAll('.gallery-section > *');
    elementsToObserve.forEach(el => observer.observe(el));
}

// Animar botões do filtro
function animateFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach((btn, index) => {
        setTimeout(() => {
            btn.style.transform = 'translateY(0)';
            btn.style.opacity = '1';
            btn.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, index * 100);
    });
}

// Animar CTA
function animateCTA() {
    const cta = document.querySelector('.cta-agendamento-content');
    if (!cta) return;
    
    setTimeout(() => {
        cta.style.transform = 'translateY(0)';
        cta.style.opacity = '1';
        cta.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }, 300);
}

// ===== FUNÇÕES AUXILIARES =====

// Função para pré-carregar imagens (se fossem imagens reais)
function preloadGalleryImages() {
    // Esta função seria usada para pré-carregar imagens se estivéssemos usando imagens reais
    const imageUrls = [
        // URLs das imagens seriam inseridas aqui
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Função para adicionar efeito de parallax na galeria
function initGalleryParallax() {
    const gallerySection = document.querySelector('.gallery-section');
    if (!gallerySection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.1;
        
        const backgroundElements = gallerySection.querySelectorAll('.floating-img, .decoration-item');
        backgroundElements.forEach(el => {
            el.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Inicializar quando a página carregar
window.addEventListener('load', function() {
    // Iniciar pré-carregamento (se necessário)
    // preloadGalleryImages();
    
    // Iniciar efeito parallax
    initGalleryParallax();
    
    // Adicionar classe de carregamento completo
    document.body.classList.add('gallery-loaded');
    
    // Atualizar contador de itens na galeria
    updateGalleryCounter();
});

// Atualizar contador de itens visíveis
function updateGalleryCounter() {
    const visibleItems = document.querySelectorAll('.gallery-item[style*="display: block"]');
    const counterElement = document.getElementById('gallery-counter');
    
    if (!counterElement) {
        // Criar elemento do contador se não existir
        const filterContainer = document.querySelector('.gallery-filter');
        if (filterContainer) {
            const counter = document.createElement('div');
            counter.id = 'gallery-counter';
            counter.className = 'gallery-counter';
            counter.style.cssText = `
                text-align: center;
                margin-top: 10px;
                font-size: 0.9rem;
                color: var(--text-light);
                font-weight: 500;
            `;
            filterContainer.appendChild(counter);
        }
    }
    
    const counter = document.getElementById('gallery-counter');
    if (counter) {
        counter.textContent = `${visibleItems.length} de ${galleryItems.length} itens`;
        
        // Adicionar animação
        counter.style.opacity = '0.7';
        counter.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            counter.style.opacity = '1';
            counter.style.transform = 'scale(1)';
            counter.style.transition = 'all 0.3s ease';
        }, 100);
    }
}

// Chamar updateGalleryCounter quando o filtro mudar
document.addEventListener('filterChanged', updateGalleryCounter);

// Disparar evento personalizado quando o filtro muda
const originalFilterGallery = window.filterGallery;
window.filterGallery = function(filterValue) {
    originalFilterGallery(filterValue);
    
    // Disparar evento personalizado
    const event = new CustomEvent('filterChanged', {
        detail: { filter: filterValue }
    });
    document.dispatchEvent(event);
};

// Exportar funções para uso global
window.Gallery = {
    filter: filterGallery,
    openModal: openModal,
    closeModal: closeModal,
    nextImage: showNextImage,
    prevImage: showPrevImage,
    resetFilter: resetFilter
};

// Adicionar estilos dinâmicos para o contador
const counterStyles = document.createElement('style');
counterStyles.textContent = `
    .gallery-counter {
        grid-column: 1 / -1;
        text-align: center;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: var(--border-radius-sm);
        margin-top: 10px;
        font-size: 0.9rem;
        color: var(--text-light);
        font-weight: 500;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(counterStyles);