
const portal = {};

let appliedConditions = [];

portal.initMobileMenu = function() {
  const btnAllmenu = document.querySelector('#btnAllMenu');
  const closeSitemapBtn = document.querySelector('.close-sitemap-btn');
  
  if (btnAllmenu) {
    btnAllmenu.addEventListener('click', () => {
      const mobileNav = document.querySelector('#mobile-nav');
      if (mobileNav) {
        mobileNav.classList.toggle('active');
      }
    });
  }

  if (closeSitemapBtn) {
    closeSitemapBtn.addEventListener('click', () => {
      const mobileNav = document.querySelector('#mobile-nav');
      if (mobileNav) {
        mobileNav.classList.remove('active');
      }
    });
  }
}


portal.initPortalBoard = function() {
  const sortTypeBtns = document.querySelectorAll('.sort-type-btn');
  sortTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(!btn.classList.contains('active')){
        sortTypeBtns.forEach(btns => {
          btns.classList.remove('active');
        });
        btn.classList.add('active');
      } else {
        //btn.classList.remove('active');
      }
    });
  });
}

portal.initDetailSearch = function() {
  const detailSearchToggle = document.getElementById('detailSearchToggle');
  const detailSearchFilters = document.getElementById('detailSearchFilters');
  const filterSelects = document.querySelectorAll('.krds-form-select');
  const resetConditions = document.getElementById('resetConditions');

  // 상세검색 토글
  if (detailSearchToggle && detailSearchFilters) {
    detailSearchToggle.addEventListener('click', function () {
      detailSearchToggle.classList.toggle('active');
      detailSearchFilters.classList.toggle('active');
    });
  }

  // 필터 변경 시 적용된 조건 업데이트
  filterSelects.forEach(select => {
    select.addEventListener('change', function () {
      portal.updateAppliedConditions();
    });
  });

  // 모든 조건 초기화
  if (resetConditions) {
    resetConditions.addEventListener('click', function () {
      filterSelects.forEach(select => {
        select.value = '';
      });
      portal.updateAppliedConditions();
    });
  }
}

portal.updateAppliedConditions = function() {
  const filterSelects = document.querySelectorAll('.krds-form-select');
  const conditionCount = document.querySelector('.condition-count');
  
  appliedConditions = [];

  filterSelects.forEach(select => {
    if (select.value && select.value !== '') {
      const filterItem = select.closest('.filter-item');
      const label = filterItem.querySelector('.filter-label').textContent;
      appliedConditions.push({
        label: label,
        value: select.value,
        select: select
      });
    }
  });

  // 조건 개수 업데이트
  if (conditionCount) {
    conditionCount.textContent = appliedConditions.length;
  }
  
  // 태그 생성
  portal.renderConditionTags();
}

portal.renderConditionTags = function() {
  const conditionTags = document.getElementById('conditionTags');
  if (!conditionTags) return;

  conditionTags.innerHTML = '';

  appliedConditions.forEach(condition => {
    const tag = document.createElement('div');
    tag.className = 'condition-tag';
    tag.innerHTML = `
      <span>${condition.value}</span>
      <button type="button" class="remove-tag" data-value="${condition.value}">
        <i class="icon-close"></i>
      </button>
    `;

    // 태그 제거 이벤트
    const removeBtn = tag.querySelector('.remove-tag');
    removeBtn.addEventListener('click', function () {
      condition.select.value = '';
      portal.updateAppliedConditions();
    });

    conditionTags.appendChild(tag);
  });
}

portal.initSearch = function() {
  const searchBtn = document.querySelector('.search-btn');
  const searchInput = document.querySelector('.search-input');

  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      portal.performSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        portal.performSearch();
      }
    });
  }
}

portal.performSearch = function() {
  const searchInput = document.querySelector('.search-input');
  const filterSelects = document.querySelectorAll('.krds-form-select');
  
  const searchTerm = searchInput ? searchInput.value.trim() : '';
  const filters = {};

  filterSelects.forEach(select => {
    if (select.value && select.value !== '') {
      const filterItem = select.closest('.filter-item');
      const label = filterItem.querySelector('.filter-label').textContent;
      filters[label] = select.value;
    }
  });
  
  // 여기에 실제 검색 로직을 구현하세요
  console.log('검색어:', searchTerm, '필터:', filters);
}

portal.initMobileTable = function() {
  portal.addLabelsToTable();
  portal.handleResize();
  
  // 리사이즈 이벤트
  window.addEventListener('resize', function() {
    portal.handleResize();
  });
}

portal.addLabelsToTable = function() {
  const tables = document.querySelectorAll('.board-list__body table, .table__list table');

  tables.forEach(table => {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    if (!thead || !tbody) return;

    // 헤더 텍스트 가져오기 (번호 제외)
    const headers = Array.from(thead.querySelectorAll('th')).slice(1).map(th => th.textContent.trim());

    // 각 행의 td에 라벨 추가 (번호 제외)
    tbody.querySelectorAll('tr').forEach(row => {
      const cells = Array.from(row.querySelectorAll('td')).slice(1); // 번호 제외

      cells.forEach((cell, index) => {
        if (index < headers.length) {
          const originalContent = cell.innerHTML;
          cell.innerHTML = `<span class="mobile-label">${headers[index]}:</span> ${originalContent}`;
        }
      });
    });
  });
}

portal.handleResize = function() {
  const isMobile = window.innerWidth <= 768;
  const mobileLabels = document.querySelectorAll('.mobile-label');

  mobileLabels.forEach(label => {
    label.style.display = isMobile ? 'inline' : 'none';
  });
}

portal.initTabNav = function() {
  const tabNavContainers = document.querySelectorAll('.tab-nav-container');
  
  tabNavContainers.forEach(container => {
    const toggle = container.querySelector('.toggle');
    const tabNav = container.querySelector('.tab-nav');
    const tabItems = container.querySelectorAll('.tab-nav-item');
    
    // 모바일 토글 버튼
    if (toggle) {
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
      });
    }
    
    // 탭 아이템 클릭 이벤트
    tabItems.forEach(tab => {
      tab.addEventListener('click', function() {
        // 모든 탭에서 active 제거
        tabItems.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-current', 'false');
        });
        
        // 클릭한 탭에 active 추가
        this.classList.add('active');
        this.setAttribute('aria-current', 'page');
        
        // 모바일에서 탭 선택 시 토글 닫기 및 텍스트 업데이트
        if (window.innerWidth <= 767 && toggle) {
          toggle.classList.remove('active');
          const toggleText = toggle.querySelector('.toggle-text');
          if (toggleText) {
            toggleText.textContent = this.textContent.trim();
          }
        }
      });
    });
  });
  
  // 외부 클릭 시 모바일 메뉴 닫기
  document.addEventListener('click', function(e) {
    tabNavContainers.forEach(container => {
      const toggle = container.querySelector('.toggle');
      if (toggle && window.innerWidth <= 767) {
        if (!container.contains(e.target)) {
          toggle.classList.remove('active');
        }
      }
    });
  });
}

portal.initCategoryTabs = function() {
  const categoryToggle = document.querySelector('.category-toggle');
  const categoryTabs = document.querySelectorAll('.category-tab');
  
  // 모바일 토글 버튼
  if (categoryToggle) {
    categoryToggle.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  }
  
  // 카테고리 탭 클릭 이벤트
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // 모든 탭에서 active 제거
      categoryTabs.forEach(t => t.classList.remove('active'));
      // 클릭한 탭에 active 추가
      this.classList.add('active');
      
      // 모바일에서 탭 선택 시 토글 닫기 및 텍스트 업데이트
      if (window.innerWidth <= 767 && categoryToggle) {
        categoryToggle.classList.remove('active');
        const toggleText = categoryToggle.querySelector('.toggle-text');
        if (toggleText) {
          toggleText.textContent = this.textContent.trim();
        }
      }
    });
  });
  
  // 외부 클릭 시 모바일 메뉴 닫기
  document.addEventListener('click', function(e) {
    if (categoryToggle && window.innerWidth <= 767) {
      const container = categoryToggle.closest('.category-tabs-container');
      if (container && !container.contains(e.target)) {
        categoryToggle.classList.remove('active');
      }
    }
  });
}

// 초기화 함수 호출
portal.initMobileMenu();
portal.initPortalBoard();
portal.initDetailSearch();
portal.initSearch();
portal.initMobileTable();
portal.initTabNav();
portal.initCategoryTabs();