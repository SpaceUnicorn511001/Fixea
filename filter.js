document.addEventListener('DOMContentLoaded', function() {
  // 1. Configuración inicial mejorada
  const filters = {
    searchForm: document.querySelector('.search-hero .search-form'),
    searchInput: document.querySelector('.search-hero .search-input'),
    location: document.getElementById('location'),
    rating: document.getElementById('rating'),
    price: document.getElementById('price'),
    availability: document.getElementById('availability'),
    service: document.getElementById('service'),
    resetBtn: document.getElementById('reset-filters'),
    professionals: document.querySelectorAll('.pro-card'),
    resultsTitle: document.querySelector('.results-title'),
    resultsCount: document.querySelector('.results-count'),
    proGrid: document.querySelector('.pro-grid'),
    // Nuevos elementos para el sistema de filtros colapsables
    filtersToggle: document.getElementById('filters-toggle'),
    filtersContent: document.getElementById('filters-content'),
    filtersCount: document.getElementById('filters-count')
  };

  // 2. Verificar elementos críticos
  if (!filters.professionals.length || !filters.proGrid) {
    console.error('Elementos esenciales no encontrados');
    return;
  }

  // Inicializar funcionalidad de filtros colapsables
  initFilterToggle();

  // 3. Cargar parámetros iniciales de URL
  function loadInitialSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    const serviceParam = urlParams.get('service');

    // Aplicar búsqueda si existe
    if (searchQuery && filters.searchInput) {
      filters.searchInput.value = decodeURIComponent(searchQuery);
    }

    // Aplicar filtro de servicio si existe
    if (serviceParam && filters.service) {
      filters.service.value = serviceParam;
    }
  }

  // 4. Sistema de filtrado mejorado
  function filterProfessionals() {
    const searchTerm = filters.searchInput?.value.trim().toLowerCase() || '';
    const locationFilter = filters.location?.value || 'all';
    const ratingFilter = filters.rating?.value || 'all';
    const priceFilter = filters.price?.value || 'all';
    const availabilityFilter = filters.availability?.value || 'all';
    const serviceFilter = filters.service?.value || 'all';

    let visibleCount = 0;
    let hasSearchTerm = searchTerm.length > 0;

    // Contar filtros activos para el indicador
    updateActiveFiltersCount(searchTerm, locationFilter, ratingFilter, priceFilter, availabilityFilter, serviceFilter);

    filters.professionals.forEach(pro => {
      const proName = pro.querySelector('.pro-name')?.textContent.toLowerCase() || '';
      const proDesc = pro.querySelector('.pro-description')?.textContent.toLowerCase() || '';
      const proServices = pro.querySelector('.pro-services')?.textContent.toLowerCase() || '';
      const proTags = pro.dataset.services?.split(',') || [];

      // Verificar coincidencias
      const matches = {
        search: !hasSearchTerm ||
               proName.includes(searchTerm) ||
               proDesc.includes(searchTerm) ||
               proServices.includes(searchTerm) ||
               proTags.some(tag => tag.includes(searchTerm)),
        location: locationFilter === 'all' || pro.dataset.location === locationFilter,
        rating: ratingFilter === 'all' || parseFloat(pro.dataset.rating) >= parseFloat(ratingFilter),
        price: priceFilter === 'all' || pro.dataset.price === priceFilter,
        availability: availabilityFilter === 'all' || pro.dataset.availability === availabilityFilter,
        service: serviceFilter === 'all' || proTags.includes(serviceFilter)
      };

      // Mostrar/ocultar según filtros
      const shouldShow = Object.values(matches).every(Boolean);
      pro.style.display = shouldShow ? 'block' : 'none';
      if (shouldShow) visibleCount++;
    });

    // Actualizar UI
    updateResultsUI(visibleCount, searchTerm, serviceFilter);
  }

  // Función para actualizar el contador de filtros activos
  function updateActiveFiltersCount(searchTerm, location, rating, price, availability, service) {
    if (!filters.filtersCount) return;

    let activeCount = 0;

    if (searchTerm) activeCount++;
    if (location !== 'all') activeCount++;
    if (rating !== 'all') activeCount++;
    if (price !== 'all') activeCount++;
    if (availability !== 'all') activeCount++;
    if (service !== 'all') activeCount++;

    filters.filtersCount.textContent = activeCount;

    // Mostrar/ocultar contador
    if (activeCount > 0) {
      filters.filtersCount.style.display = 'inline-flex';
      // Si hay filtros activos y estamos en móvil, resaltar el botón
      if (window.innerWidth < 640) {
        filters.filtersToggle.classList.add('has-active-filters');
      }
    } else {
      filters.filtersCount.style.display = 'none';
      filters.filtersToggle.classList.remove('has-active-filters');
    }
  }

  // 5. Actualizar la interfaz de resultados
  function updateResultsUI(visibleCount, searchTerm, serviceFilter) {
    if (!filters.resultsTitle || !filters.resultsCount) return;

    // Título basado en búsqueda/filtros
    let title = 'Todos los servicios';

    if (searchTerm) {
      title = `Resultados para "${searchTerm}"`;
    } else if (serviceFilter !== 'all') {
      const serviceName = filters.service?.options[filters.service.selectedIndex]?.text || 'Servicio';
      title = serviceName;
    }

    // Actualizar elementos
    filters.resultsTitle.textContent = title;
    filters.resultsCount.textContent = `Mostrando ${visibleCount} de ${filters.professionals.length} profesionales`;

    // Ordenar resultados (los que coinciden con búsqueda primero)
    if (searchTerm) {
      const proArray = Array.from(filters.professionals);
      proArray.sort((a, b) => {
        const aName = a.querySelector('.pro-name')?.textContent.toLowerCase() || '';
        const bName = b.querySelector('.pro-name')?.textContent.toLowerCase() || '';
        const aMatches = aName.includes(searchTerm) ? 1 : 0;
        const bMatches = bName.includes(searchTerm) ? 1 : 0;
        return bMatches - aMatches;
      });

      proArray.forEach(pro => filters.proGrid.appendChild(pro));
    }
  }

  // Inicializar la funcionalidad de mostrar/ocultar filtros
  function initFilterToggle() {
    // Verificar que existan los elementos necesarios
    if (!filters.filtersToggle || !filters.filtersContent) {
      console.error('Elementos de filtros colapsables no encontrados');
      return;
    }

    // Asegurar que los filtros estén ocultos en móvil al cargar
    if (window.innerWidth < 640) {
      filters.filtersContent.style.display = 'none';
    }

    // Manejar clic en el botón de filtros
    filters.filtersToggle.addEventListener('click', function() {
      // Manera más directa y segura de alternar la visibilidad
      const isCurrentlyVisible = filters.filtersContent.style.display !== 'none';

      if (isCurrentlyVisible) {
        // Si está visible, ocultar
        filters.filtersContent.style.display = 'none';
        filters.filtersToggle.classList.remove('active');
        filters.filtersToggle.setAttribute('aria-expanded', 'false');
      } else {
        // Si está oculto, mostrar
        filters.filtersContent.style.display = 'grid';
        filters.filtersToggle.classList.add('active');
        filters.filtersToggle.setAttribute('aria-expanded', 'true');
      }
    });

    console.log('Inicialización de filtros colapsables completada');
  }

  // 6. Configurar event listeners
  function setupEventListeners() {
    // Búsqueda
    if (filters.searchForm) {
      filters.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        filterProfessionals();
      });

      if (filters.searchInput) {
        filters.searchInput.addEventListener('keyup', () => {
          // Agregar delay para búsquedas mientras se escribe
          clearTimeout(this.searchTimer);
          this.searchTimer = setTimeout(filterProfessionals, 300);
        });
      }
    }

    // Filtros
    [filters.location, filters.rating, filters.price, filters.availability, filters.service]
      .forEach(filter => {
        if (filter) filter.addEventListener('change', filterProfessionals);
      });

    // Reset
    if (filters.resetBtn) {
      filters.resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (filters.searchInput) filters.searchInput.value = '';
        if (filters.location) filters.location.value = 'all';
        if (filters.rating) filters.rating.value = 'all';
        if (filters.price) filters.price.value = 'all';
        if (filters.availability) filters.availability.value = 'all';
        if (filters.service) filters.service.value = 'all';
        filterProfessionals();
      });
    }
  }

  // Inicialización
  loadInitialSearch();
  setupEventListeners();
  filterProfessionals(); // Aplicar filtros iniciales
});
