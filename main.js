document.addEventListener('DOMContentLoaded', function() {
  // ======================
  // 1. MEJORAS EN EL SISTEMA DE BÚSQUEDA
  // ======================
  if (window.location.pathname.endsWith('/') || 
      window.location.pathname.endsWith('/index.html')) {
    
    const searchForm = document.querySelector('.hero-section .search-form');
    const searchInput = document.querySelector('.hero-section .search-input');
    const searchButton = document.querySelector('.hero-section .search-button');

    if (searchForm && searchInput) {
      // Función mejorada para redirección
      const handleSearchRedirect = () => {
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
          // Crear URL con parámetros de búsqueda
          const url = new URL('search.html', window.location.origin);
          url.searchParams.set('q', searchQuery);
          
          // Redirigir manteniendo cualquier parámetro existente
          window.location.href = url.toString();
        } else {
          window.location.href = 'search.html';
        }
      };

      // Manejar envío del formulario
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSearchRedirect();
      });

      // Manejar tecla Enter
      searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearchRedirect();
        }
      });

      // Mejorar UX del botón de búsqueda
      if (searchButton) {
        searchInput.addEventListener('input', function() {
          searchButton.disabled = !this.value.trim();
          searchButton.style.cursor = this.value.trim() ? 'pointer' : 'not-allowed';
        });
        // Estado inicial
        searchButton.disabled = !searchInput.value.trim();
        searchButton.style.cursor = searchInput.value.trim() ? 'pointer' : 'not-allowed';
      }
    }
  }

  // ======================
  // 2. DROPDOWNS (se mantiene igual)
  // ======================
  const dropdownButtons = document.querySelectorAll('.dropdown-button');
  
  dropdownButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const content = this.nextElementSibling;
      const isVisible = content.style.display === 'block';
      
      document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.style.display = 'none';
      });
      
      if (!isVisible) {
        content.style.display = 'block';
      }
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown-button')) {
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
      });
    }
  });

  // ======================
  // 3. ANIMACIONES (se mantiene igual)
  // ======================
  const animatedCards = document.querySelectorAll(
    '.service-card, .project-card, .cost-card, .resource-card'
  );

  animatedCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  console.log('Script main.js cargado correctamente');
});