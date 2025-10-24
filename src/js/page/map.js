import '../../scss/map.scss';

// ============================================
// 전역 변수
// ============================================
let mapInstance = null;

// ============================================
// 그룹 버튼 토글
// ============================================
function initGroupButtons(selector = '.group-btn', callback) {
  const groupButtons = document.querySelectorAll(selector);
  
  groupButtons.forEach(group => {
    const buttons = group.querySelectorAll('.tool-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const isActive = this.classList.contains('active');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        if (!isActive) {
          this.classList.add('active');
          if (this.classList.contains('map-type-btn1')) {
            document.querySelector('.map-type-opacity').classList.add('show');
          } else {
            document.querySelector('.map-type-opacity').classList.remove('show');
          }
        } else {
          document.querySelector('.map-type-opacity').classList.remove('show');
        }
        
        if (callback) callback(this, isActive);
      });
    });
  });
}

// ============================================
// 메뉴 버튼 토글
// ============================================
function initMenuButtons(menuSelector = '.menu-list button') {
  const menuButtons = document.querySelectorAll(menuSelector);
  const main = document.querySelector('body');
  
  menuButtons.forEach(button => {
    button.addEventListener('click', function() {
      const parentLi = this.closest('li');
      const isCurrent = parentLi.classList.contains('current');
      const panelId = this.getAttribute('data-panel');
      
      // 모든 메뉴 아이템에서 current 제거
      const allMenuItems = document.querySelectorAll('.menu-list > li');
      allMenuItems.forEach(li =>{
        li.classList.remove('current')
        li.removeAttribute('title')
      });
      
      // 모든 패널 닫기
      const allPanels = document.querySelectorAll('[data-panel-menu]');
      allPanels.forEach(panel => panel.classList.remove('show'));
      
      // main에서 open-depth-1 제거
      main.classList.remove('open-depth-1');

      if (isCurrent) {
        // 이미 열려있는 메뉴를 다시 클릭하면 닫기
        main.classList.remove('open-depth-1');
      } else {
        // 새 메뉴 열기
        parentLi.classList.add('current');
        parentLi.setAttribute('title', '선택 됨');
        main.classList.add('open-depth-1');
        
        // 패널 제목 변경
        const layerPanelTitle = document.querySelector('.layer-panel-title');
        if (layerPanelTitle) {
          layerPanelTitle.textContent = button.textContent.trim();
        }

        // 해당 패널 열기
        if (panelId) {
          const targetPanel = document.querySelector(`[data-panel-menu="${panelId}"]`);
          if (targetPanel) {
            targetPanel.classList.add('show');
          }
        }
      }
    });
  });
}

// ============================================
// 즐겨찾기 버튼 토글
// ============================================
function initFavButtons(selector = '.fav-layer-btn', callback) {
  const favButtons = document.querySelectorAll(selector);
  
  favButtons.forEach(button => {
    button.addEventListener('click', function() {
      const isActive = this.classList.contains('selected');
      this.classList.toggle('selected');
      
      if (callback) callback(this, isActive);
    });
  });
}

// ============================================
// 카테고리 탭
// ============================================
function initCategoryTabsToggle(toggleSelector = '.category-tabs-toggle', callback) {
  const categoryTabsToggle = document.querySelector(toggleSelector);
  
  if (categoryTabsToggle) {
    categoryTabsToggle.addEventListener('click', function() {
      const categoryTabs = this.closest('.category-tabs');
      const isExtended = categoryTabs.classList.contains('extend');
      categoryTabs.classList.toggle('extend');
      
      if (callback) callback(this, isExtended);
    });
  }
}

function initCategoryTabs(tabSelector = '.category-tabs .tab', callback) {
  const categoryTabs = document.querySelectorAll(tabSelector);
  
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const isActive = this.classList.contains('active');
      this.classList.toggle('active');
      
      if (callback) callback(this, isActive);
    });
  });
}

// ============================================
// 도구 버튼 & 옵션 패널
// ============================================
function initToolButtons(selector = '[data-option]', callback) {
  const toolButtons = document.querySelectorAll(selector);

  toolButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();

      const option = this.dataset.option;
      const panel = document.querySelector(`#${option}`);
      const isActive = panel?.classList.contains('active');

      // 맵 타입 버튼을 제외한 모든 버튼 비활성화
      document.querySelectorAll('[data-option]').forEach(btn => {
        if (btn.classList.contains('map-type-btn1') || btn.classList.contains('map-type-btn2')) return;
        
        const id = btn.dataset.option;
        const p = document.querySelector(`#${id}`);
        btn.classList.remove('active');
        if (p) p.classList.remove('active');
      });

      // 측정 도구 닫기
      initOptionPanelCloseAll();

      // 클릭한 패널만 토글
      if (!isActive) {
        this.classList.add('active');
        if (panel) panel.classList.add('active');
      } else {
        this.classList.remove('active');
        if (panel) panel.classList.remove('active');
      }

      if (callback) callback(this, option, isActive);
    });
  });

  // 외부 클릭 시 닫기 (맵 타입 버튼 제외)
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-option]') && !e.target.closest('.option-panel')) {
      document.querySelectorAll('[data-option]').forEach(btn => {
        if (btn.classList.contains('map-type-btn1') || btn.classList.contains('map-type-btn2')) return;
        
        const id = btn.dataset.option;
        const panel = document.querySelector(`#${id}`);
        btn.classList.remove('active');
        if (panel) panel.classList.remove('active');
      });
    }
  });
}

// 측정도구 닫기
function initOptionPanelCloseAll() {
  document.querySelector('#measureToggleBtn').classList.remove('active');
  document.querySelector('#measureTools').style.display = 'none';
  document.querySelectorAll('.measure-tool-btn').forEach(btn => btn.classList.remove('active'));
}

function initOptionPanelClose(selector = '.option-panel-close', callback) {
  const closeBtns = document.querySelectorAll(selector);
  
  closeBtns.forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
      const optionPanel = this.closest('.option-panel');
      const panelId = optionPanel.id;
      const toolBtn = document.querySelector(`[data-option="${panelId}"]`);
      
      if (toolBtn) toolBtn.classList.remove('active');
      if (optionPanel) optionPanel.classList.remove('active');
      
      if (callback) callback(this, optionPanel);
    });
  });
}

function initOptionPanelZoom(zoomSelector = '.option-panel-zoom', callback) {
  const zoomBtn = document.querySelector(zoomSelector);
  
  if (zoomBtn) {
    zoomBtn.addEventListener('click', function() {
      const isZoomedIn = this.classList.contains('in');
      
      if (isZoomedIn) {
        zoomOutOptionPanel(zoomSelector);
      } else {
        zoomInOptionPanel(zoomSelector);
      }
    });
  }
}

function zoomInOptionPanel(selector = '.option-panel-zoom') {
  const zoomBtn = document.querySelector(selector);
  const panel = zoomBtn?.closest('.option-panel');
  
  if (zoomBtn) {
    zoomBtn.classList.add('in');
    zoomBtn.classList.remove('out');
  }
  if (panel) {
    panel.classList.remove('zoomed-in');
  }
}

function zoomOutOptionPanel(selector = '.option-panel-zoom') {
  const zoomBtn = document.querySelector(selector);
  const panel = zoomBtn?.closest('.option-panel');
  
  if (zoomBtn) {
    zoomBtn.classList.add('out');
    zoomBtn.classList.remove('in');
  }
  if (panel) {
    panel.classList.add('zoomed-in');
  }
}

// ============================================
// 헤더 토글
// ============================================
function initHeaderToggle(toggleSelector = '#btnMenuOpen', headerSelector = '#map-nav', callback) {
  const headerToggle = document.querySelector(toggleSelector);
  
  if (headerToggle) {
    headerToggle.addEventListener('click', function() {
      const isActive = document.querySelector(headerSelector).classList.contains('active');
      
      if (isActive) {
        closeHeader();
      } else {
        openHeader();
      }
      
      if (callback) callback(this, isActive);
    });
  }
}

function initHeaderClose(selector = '.map-nav-header-btn', headerSelector = '#map-nav', callback) {
  const headerClose = document.querySelector(selector);
  
  if (headerClose) {
    headerClose.addEventListener('click', function() {
      const isActive = document.querySelector(headerSelector).classList.contains('active');
      
      if (window.innerWidth < 1000) {
        if (isActive) {
          closeHeader();
        } else {
          openHeader();
        }
      } else {
        closeHeader();
      }
      
      if (callback) callback(this, document.querySelector(headerSelector).classList.contains('active'));
    });
  }
}

function closeHeader() {
  const mapHeader = document.querySelector('#map-nav');
  if (mapHeader) {
    mapHeader.classList.remove('active');
  }
}

function openHeader() {
  const mapHeader = document.querySelector('#map-nav');
  if (mapHeader) {
    mapHeader.classList.add('active');
  }
}

// ============================================
// 지도 초기화
// ============================================
function initMap() {
  mapInstance = new ol.Map({
    target: 'map',
    controls: ol.control.defaults.defaults({
      zoom: false,
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([127.7669, 35.9078]), // 대한민국 중심 좌표
      zoom: 7,
    }),
  });
  
  return mapInstance;
}

function getMapInstance() {
  return mapInstance;
}

// ============================================
// 측정 도구
// ============================================
function initMeasureTools(toggleSelector = '#measureToggleBtn', toolsSelector = '#measureTools', callback) {
  const measureToggleBtn = document.querySelector(toggleSelector);
  const measureTools = document.querySelector(toolsSelector);
  
  if (!measureToggleBtn || !measureTools) return;
  
  // 초기 상태 설정
  measureTools.style.display = 'none';
  measureToggleBtn.classList.remove('active');
  
  measureToggleBtn.addEventListener('click', function() {
    const isCurrentlyVisible = measureTools.style.display !== 'none';
    
    if (isCurrentlyVisible) {
      measureTools.style.display = 'none';
      this.classList.remove('active');
    } else {
      measureTools.style.display = 'flex';
      this.classList.add('active');
    }
    
    if (callback) callback(this, isCurrentlyVisible);
  });
  
  // 측정 도구 버튼 이벤트
  const measureToolBtns = measureTools.querySelectorAll('.measure-tool-btn');
  measureToolBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tool = this.dataset.tool;
      
      measureToolBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      if (callback) callback(this, tool);
    });
  });
}


// ============================================
// 지도 정보 팝업
// ============================================
function showMapInfoPopup(x, y) {
  const popup = document.getElementById('mapInfoPopup');
  
  if (!popup) return;
  
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
  popup.classList.add('active');
}

function hideMapInfoPopup() {
  const popup = document.getElementById('mapInfoPopup');
  if (popup) {
    popup.classList.remove('active');
  }
}

// ============================================
// 상세정보 더보기 토글
// ============================================
function initViewMoreToggle(selector = '.view-more-btn', callback) {
  const viewMoreBtn = document.querySelector(selector);
  
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', function() {
      const detailSection = document.querySelector('[data-section="detail"]');
      const isActive = this.classList.contains('active');
      
      if (isActive) {
        if (detailSection) detailSection.classList.add('detail-content-hidden');
        this.classList.remove('active');
      } else {
        if (detailSection) detailSection.classList.remove('detail-content-hidden');
        this.classList.add('active');
      }
      
      if (callback) callback(this, isActive);
    });
  }
}

// ============================================
// 레이어 패널
// ============================================
function initLayerToggle() {
  const buttons = document.querySelectorAll('[data-layer-toggle]');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();

      const parent = btn.closest('.layer-item, .layer-item-tree');
      if (!parent) return;

      parent.classList.toggle('active');
    });
  });
}

function initCollapseToggle(selector = '.collapse-toggle', callback) {
  const toggleButtons = document.querySelectorAll(selector);
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const controlsId = this.getAttribute('aria-controls');
      const panel = document.getElementById(controlsId);
      
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        this.classList.remove('active');
        if (panel) panel.classList.remove('active');
      } else {
        this.setAttribute('aria-expanded', 'true');
        this.classList.add('active');
        if (panel) panel.classList.add('active');
      }
      
      if (callback) callback(this, isExpanded);
    });
  });
}

function initDetailPanelClose() {
  document.body.classList.remove('open-depth-2');
}

function initLayerUtilsBtnMeta() {
  const layerUtilsBtnMeta = document.querySelectorAll('.layer-utils-btn-meta');
  
  layerUtilsBtnMeta.forEach(btn => {
    btn.addEventListener('click', function() {
      document.body.classList.add('open-depth-2');
    });
  });
}

// ============================================
// 모바일 패널 토글
// ============================================
function initMobilePanelToggle() {
  const mobileControls = document.querySelectorAll('.layer-mobile-control');
  
  mobileControls.forEach(control => {
    control.addEventListener('click', function() {
      const body = document.body;
      const isCollapsed = body.classList.contains('layer-panel-collapsed');
      
      if (isCollapsed) {
        body.classList.remove('layer-panel-collapsed');
        body.classList.add('layer-panel-expanded');
      } else {
        body.classList.remove('layer-panel-expanded');
        body.classList.add('layer-panel-collapsed');
      }
    });
  });
}

function toggleLayerPanel() {
  const body = document.body;
  const isCollapsed = body.classList.contains('layer-panel-collapsed');
  
  if (isCollapsed) {
    expandLayerPanel();
  } else {
    collapseLayerPanel();
  }
}

function collapseLayerPanel() {
  document.body.classList.remove('layer-panel-expanded');
  document.body.classList.add('layer-panel-collapsed');
}

function expandLayerPanel() {
  document.body.classList.remove('layer-panel-collapsed');
  document.body.classList.add('layer-panel-expanded');
}

// ============================================
// 모달 관리
// ============================================
function openModal(title, content, modalId, triggerElement = null) {
  if (!title || !content || !modalId) {
    console.error('openModal: title, content, modalId는 필수 매개변수입니다.');
    return;
  }
  
  const modal = document.getElementById(modalId);
  const modalTitle = modal?.querySelector('.modal-title');
  const modalContent = modal?.querySelector('.map-modal-content');
  const modalClose = modal?.querySelector('.modal-close');
  
  if (!modal || !modalTitle || !modalContent) {
    console.error(`모달 요소를 찾을 수 없습니다. modalId: ${modalId}`);
    return;
  }
  
  // 제목과 내용 설정
  modalTitle.textContent = title;
  modalContent.innerHTML = content;
  
  // 모달 표시
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  
  // 포커스 관리
  modalClose.focus();
  modal._triggerElement = triggerElement;
  
  // body 스크롤 방지
  document.body.style.overflow = 'hidden';
  
  // 이벤트 핸들러
  const handleEscape = (e) => {
    if (e.key === 'Escape') closeModal(modalId);
  };
  
  const handleBackdropClick = (e) => {
    if (e.target === modal) closeModal(modalId);
  };
  
  const handleCloseClick = () => {
    closeModal(modalId);
  };
  
  // 이벤트 리스너 추가
  document.addEventListener('keydown', handleEscape);
  modal.addEventListener('click', handleBackdropClick);
  modalClose.addEventListener('click', handleCloseClick);
  
  // 핸들러 저장
  modal._escapeHandler = handleEscape;
  modal._backdropHandler = handleBackdropClick;
  modal._closeHandler = handleCloseClick;
}

function closeModal(modalId) {
  if (!modalId) {
    console.error('closeModal: modalId는 필수 매개변수입니다.');
    return;
  }
  
  const modal = document.getElementById(modalId);
  
  if (!modal) {
    console.error(`모달 요소를 찾을 수 없습니다. modalId: ${modalId}`);
    return;
  }
  
  // 모달 숨기기
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  
  // body 스크롤 복원
  document.body.style.overflow = '';
  
  // 포커스 복원
  if (modal._triggerElement && typeof modal._triggerElement.focus === 'function') {
    modal._triggerElement.focus();
  }
  
  // 이벤트 리스너 제거
  if (modal._escapeHandler) {
    document.removeEventListener('keydown', modal._escapeHandler);
  }
  if (modal._backdropHandler) {
    modal.removeEventListener('click', modal._backdropHandler);
  }
  if (modal._closeHandler) {
    const modalClose = modal.querySelector('.modal-close');
    if (modalClose) {
      modalClose.removeEventListener('click', modal._closeHandler);
    }
  }
  
  // 핸들러 정리
  delete modal._escapeHandler;
  delete modal._backdropHandler;
  delete modal._closeHandler;
  delete modal._triggerElement;
}

function initModal(modalId) {
  if (!modalId) {
    console.error('initModal: modalId는 필수 매개변수입니다.');
    return;
  }
  
  const modal = document.getElementById(modalId);
  
  if (!modal) {
    console.error(`모달 요소를 찾을 수 없습니다. modalId: ${modalId}`);
    return;
  }
  
  // 초기 상태 설정
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  
  // aria-labelledby 설정
  const modalTitle = modal.querySelector('.modal-title');
  const modalContainer = modal.querySelector('.modal-container');
  
  if (modalTitle && modalContainer) {
    const titleId = modalId + '-title';
    modalTitle.id = titleId;
    modalContainer.setAttribute('aria-labelledby', titleId);
  }
}

function initModals(modalIds) {
  if (!Array.isArray(modalIds)) {
    console.error('initModals: modalIds는 배열이어야 합니다.');
    return;
  }
  
  modalIds.forEach(modalId => initModal(modalId));
}

function closeAllModals() {
  const allModals = document.querySelectorAll('.map-modal');
  allModals.forEach(modal => {
    if (modal.style.display !== 'none') {
      closeModal(modal.id);
    }
  });
}

function initModalTriggers() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (!modal) {
        console.error(`모달을 찾을 수 없습니다: ${modalId}`);
        return;
      }
      
      const modalTitle = modal.querySelector('.modal-title');
      const modalContent = modal.querySelector('.map-modal-content');
      
      if (!modalTitle || !modalContent) {
        console.error(`모달 구조가 올바르지 않습니다: ${modalId}`);
        return;
      }
      
      // 모달 표시
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      
      // 포커스 관리
      const modalClose = modal.querySelector('.modal-close');
      if (modalClose) modalClose.focus();
      
      modal._triggerElement = this;
      
      // body 스크롤 방지
      document.body.style.overflow = 'hidden';
      
      // 이벤트 핸들러
      const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal(modalId);
      };
      
      const handleBackdropClick = (e) => {
        if (e.target === modal) closeModal(modalId);
      };
      
      const handleCloseClick = () => {
        closeModal(modalId);
      };
      
      // 이벤트 리스너 추가
      document.addEventListener('keydown', handleEscape);
      modal.addEventListener('click', handleBackdropClick);
      if (modalClose) modalClose.addEventListener('click', handleCloseClick);
      
      // 핸들러 저장
      modal._escapeHandler = handleEscape;
      modal._backdropHandler = handleBackdropClick;
      modal._closeHandler = handleCloseClick;
    });
  });
}

// ============================================
// 줌 레인지 컨트롤
// ============================================
function initZoomRangeValue() {
  const zoomInBtn = document.querySelector('.zoom-btn.zoom-in');
  const zoomOutBtn = document.querySelector('.zoom-btn.zoom-out');
  const zoomRange = document.querySelector('.zoom-range');
  const zoomValue = document.querySelector('.zoom-range-value');
  const zoomLevelValue = document.querySelector('.zoom-level-value');
  const gageBackground = document.querySelector('.gage-background');

  const minZoom = 1;
  const maxZoom = 14;
  let zoomLevel = 7;
  let isDragging = false;

  const updateZoomUI = () => {
    const percent = ((zoomLevel - minZoom) / (maxZoom - minZoom)) * 100;
    zoomValue.style.bottom = `${percent.toFixed(0)}%`;
    gageBackground.style.height = `calc(${percent.toFixed(0)}% - 0.1rem)`;
    zoomLevelValue.textContent = `LV${zoomLevel}`;
  };

  updateZoomUI();

  // 확대/축소 버튼
  zoomInBtn.addEventListener('click', () => {
    if (zoomLevel < maxZoom) {
      zoomLevel++;
      updateZoomUI();
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    if (zoomLevel > minZoom) {
      zoomLevel--;
      updateZoomUI();
    }
  });

  // 드래그로 줌 조절
  const updateZoomByMouse = (e) => {
    const rect = zoomRange.getBoundingClientRect();
    const offsetY = rect.bottom - e.clientY;
    let percent = (offsetY / rect.height) * 100;

    percent = Math.max(0, Math.min(100, percent));

    const level = Math.round((percent / 100) * (maxZoom - minZoom) + minZoom);
    zoomLevel = level;
    updateZoomUI();
  };

  zoomRange.addEventListener('mousedown', e => {
    isDragging = true;
    updateZoomByMouse(e);
  });

  document.addEventListener('mousemove', e => {
    if (isDragging) updateZoomByMouse(e);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function initFavLayersToggle() {
  const favLayerList = document.querySelector('.fav-layers');
  const btnMore = document.querySelector('.btn-more');

  btnMore.addEventListener('click', () => {
    favLayerList.classList.toggle('show-all');

    // 버튼 상태에 따라 아이콘/텍스트 변경
    const expanded = favLayerList.classList.contains('show-all');
    btnMore.setAttribute('aria-expanded', expanded);
  });
}

function initToggleItem() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toggle="item"]');
    if (!btn) return;
    btn.classList.toggle('active');
  });
}

function initTimeseriesRangeValue() {
  document.querySelectorAll('input[type="range"]').forEach(range => {
    // 초기값 반영
    range.style.setProperty('--value', range.value);
  
    // 값 변경 시 갱신
    range.addEventListener('input', e => {
      e.target.style.setProperty('--value', e.target.value);
    });
  });
}

// ============================================
// 초기화 실행
// ============================================
initLayerToggle();
initMenuButtons();
initGroupButtons();
initFavButtons();
initCategoryTabsToggle();
initCategoryTabs();
initHeaderToggle();
initHeaderClose();
initToolButtons();
initOptionPanelClose();
initMeasureTools();
initOptionPanelZoom();
initViewMoreToggle();
initCollapseToggle();
initMap();
initMobilePanelToggle();
initModalTriggers();
initLayerUtilsBtnMeta();
//initDetailPanelClose();
initZoomRangeValue();
initFavLayersToggle();
initToggleItem();
initTimeseriesRangeValue();
// ============================================
// 지도 클릭 이벤트
// ============================================
if (mapInstance) {
  mapInstance.on('click', function(event) {
    const coordinate = event.coordinate;
    const pixel = event.pixel;
    
    showMapInfoPopup(pixel[0], pixel[1]);
  });
}

// ============================================
// 디테일 패널 닫기 이벤트
// ============================================
const detailPanelClose = document.querySelector('.detail-panel-close');
if (detailPanelClose) {
  detailPanelClose.addEventListener('click', function() {
    initDetailPanelClose();
  });
}