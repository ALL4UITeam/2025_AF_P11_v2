import "./modulepreload-polyfill.js";
let mapInstance = null;
function initGroupButtons(selector = ".group-btn", callback) {
  const groupButtons = document.querySelectorAll(selector);
  groupButtons.forEach((group) => {
    const buttons = group.querySelectorAll(".tool-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", function() {
        const isActive = this.classList.contains("active");
        buttons.forEach((btn) => btn.classList.remove("active"));
        if (!isActive) {
          this.classList.add("active");
        } else {
          this.classList.remove("active");
        }
      });
    });
  });
}
function initMenuButtons(menuSelector = ".menu-list button") {
  const menuButtons = document.querySelectorAll(menuSelector);
  const main = document.querySelector("body");
  menuButtons.forEach((button) => {
    button.addEventListener("click", function() {
      const parentLi = this.closest("li");
      const isCurrent = parentLi.classList.contains("current");
      const panelId = this.getAttribute("data-panel");
      const allMenuItems = document.querySelectorAll(".menu-list > li");
      allMenuItems.forEach((li) => {
        li.classList.remove("current");
        li.removeAttribute("title");
      });
      const allPanels = document.querySelectorAll("[data-panel-menu]");
      allPanels.forEach((panel) => panel.classList.remove("show"));
      main.classList.remove("open-depth-1");
      main.classList.remove("open-depth-2");
      if (isCurrent) {
        main.classList.remove("open-depth-1");
      } else {
        parentLi.classList.add("current");
        parentLi.setAttribute("title", "선택 됨");
        main.classList.add("open-depth-1");
        const layerPanelTitle = document.querySelector(".layer-panel-title");
        if (layerPanelTitle) {
          layerPanelTitle.textContent = button.textContent.trim();
        }
        if (panelId) {
          const targetPanel = document.querySelector(`[data-panel-menu="${panelId}"]`);
          if (targetPanel) {
            targetPanel.classList.add("show");
          }
        }
      }
    });
  });
}
function initFavButtons(selector = ".fav-layer-btn", callback) {
  const favButtons = document.querySelectorAll(selector);
  favButtons.forEach((button) => {
    button.addEventListener("click", function() {
      this.classList.contains("selected");
      this.classList.toggle("selected");
    });
  });
}
function initCategoryTabsToggle(toggleSelector = ".category-tabs-toggle", callback) {
  const categoryTabsToggle = document.querySelector(toggleSelector);
  if (categoryTabsToggle) {
    categoryTabsToggle.addEventListener("click", function() {
      const categoryTabs = this.closest(".category-tabs");
      categoryTabs.classList.contains("extend");
      categoryTabs.classList.toggle("extend");
    });
  }
}
function initCategoryTabs(tabSelector = ".category-tabs .tab", callback) {
  const categoryTabs = document.querySelectorAll(tabSelector);
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", function() {
      this.classList.contains("active");
      this.classList.toggle("active");
    });
  });
}
function initToolButtons(selector = "[data-option]", callback) {
  const toolButtons = document.querySelectorAll(selector);
  toolButtons.forEach((button) => {
    button.addEventListener("click", function(e) {
      e.stopPropagation();
      const option = this.dataset.option;
      const panel = document.querySelector(`#${option}`);
      const isActive = panel == null ? void 0 : panel.classList.contains("active");
      document.querySelectorAll("[data-option]").forEach((btn) => {
        const id = btn.dataset.option;
        const p = document.querySelector(`#${id}`);
        btn.classList.remove("active");
        if (p) p.classList.remove("active");
      });
      initOptionPanelCloseAll();
      if (!isActive) {
        this.classList.add("active");
        if (panel) panel.classList.add("active");
      } else {
        this.classList.remove("active");
        if (panel) panel.classList.remove("active");
      }
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-option]") && !e.target.closest(".option-panel")) {
      document.querySelectorAll("[data-option]").forEach((btn) => {
        const id = btn.dataset.option;
        const panel = document.querySelector(`#${id}`);
        btn.classList.remove("active");
        if (panel) panel.classList.remove("active");
      });
    }
  });
}
function initOptionPanelCloseAll() {
  document.querySelector("#measureToggleBtn").classList.remove("active");
  document.querySelector("#measureTools").style.display = "none";
  document.querySelectorAll(".measure-tool-btn").forEach((btn) => btn.classList.remove("active"));
}
function initOptionPanelClose(selector = ".option-panel-close", callback) {
  const closeBtns = document.querySelectorAll(selector);
  closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", function() {
      const optionPanel = this.closest(".option-panel");
      const panelId = optionPanel.id;
      const toolBtn = document.querySelector(`[data-option="${panelId}"]`);
      if (toolBtn) toolBtn.classList.remove("active");
      if (optionPanel) optionPanel.classList.remove("active");
    });
  });
}
function initOptionPanelZoom(zoomSelector = ".option-panel-zoom", callback) {
  const zoomBtn = document.querySelector(zoomSelector);
  if (zoomBtn) {
    zoomBtn.addEventListener("click", function() {
      const isZoomedIn = this.classList.contains("in");
      if (isZoomedIn) {
        zoomOutOptionPanel(zoomSelector);
      } else {
        zoomInOptionPanel(zoomSelector);
      }
    });
  }
}
function zoomInOptionPanel(selector = ".option-panel-zoom") {
  const zoomBtn = document.querySelector(selector);
  const panel = zoomBtn == null ? void 0 : zoomBtn.closest(".option-panel");
  if (zoomBtn) {
    zoomBtn.classList.add("in");
    zoomBtn.classList.remove("out");
  }
  if (panel) {
    panel.classList.remove("zoomed-in");
  }
}
function zoomOutOptionPanel(selector = ".option-panel-zoom") {
  const zoomBtn = document.querySelector(selector);
  const panel = zoomBtn == null ? void 0 : zoomBtn.closest(".option-panel");
  if (zoomBtn) {
    zoomBtn.classList.add("out");
    zoomBtn.classList.remove("in");
  }
  if (panel) {
    panel.classList.add("zoomed-in");
  }
}
function initHeaderToggle(toggleSelector = "#btnMenuOpen", headerSelector = "#map-nav", callback) {
  const headerToggle = document.querySelector(toggleSelector);
  if (headerToggle) {
    headerToggle.addEventListener("click", function() {
      const isActive = document.querySelector(headerSelector).classList.contains("active");
      if (isActive) {
        closeHeader();
      } else {
        openHeader();
      }
    });
  }
}
function initHeaderClose(selector = ".map-nav-header-btn", headerSelector = "#map-nav", callback) {
  const headerClose = document.querySelector(selector);
  if (headerClose) {
    headerClose.addEventListener("click", function() {
      const isActive = document.querySelector(headerSelector).classList.contains("active");
      if (window.innerWidth < 1e3) {
        if (isActive) {
          closeHeader();
        } else {
          openHeader();
        }
      } else {
        closeHeader();
      }
    });
  }
}
function closeHeader() {
  const mapHeader = document.querySelector("#map-nav");
  if (mapHeader) {
    mapHeader.classList.remove("active");
  }
}
function openHeader() {
  const mapHeader = document.querySelector("#map-nav");
  if (mapHeader) {
    mapHeader.classList.add("active");
  }
}
function initMap() {
  mapInstance = new ol.Map({
    target: "map",
    controls: ol.control.defaults.defaults({
      zoom: false
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([127.7669, 35.9078]),
      // 대한민국 중심 좌표
      zoom: 7
    })
  });
  return mapInstance;
}
function initMeasureTools(toggleSelector = "#measureToggleBtn", toolsSelector = "#measureTools", callback) {
  const measureToggleBtn = document.querySelector(toggleSelector);
  const measureTools = document.querySelector(toolsSelector);
  if (!measureToggleBtn || !measureTools) return;
  measureTools.style.display = "none";
  measureToggleBtn.classList.remove("active");
  measureToggleBtn.addEventListener("click", function() {
    const isCurrentlyVisible = measureTools.style.display !== "none";
    if (isCurrentlyVisible) {
      measureTools.style.display = "none";
      this.classList.remove("active");
    } else {
      measureTools.style.display = "flex";
      this.classList.add("active");
    }
  });
  const measureToolBtns = measureTools.querySelectorAll(".measure-tool-btn");
  measureToolBtns.forEach((btn) => {
    btn.addEventListener("click", function() {
      this.dataset.tool;
      measureToolBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });
}
function showMapInfoPopup(x, y) {
  const popup = document.getElementById("mapInfoPopup");
  if (!popup) return;
  popup.style.left = x + "px";
  popup.style.top = y + "px";
  popup.classList.add("active");
}
function initViewMoreToggle(selector = ".view-more-btn", callback) {
  const viewMoreBtn = document.querySelector(selector);
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", function() {
      const detailSection = document.querySelector('[data-section="detail"]');
      const isActive = this.classList.contains("active");
      if (isActive) {
        if (detailSection) detailSection.classList.add("detail-content-hidden");
        this.classList.remove("active");
      } else {
        if (detailSection) detailSection.classList.remove("detail-content-hidden");
        this.classList.add("active");
      }
    });
  }
}
function initLayerToggle() {
  const buttons = document.querySelectorAll("[data-layer-toggle]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = btn.closest(".layer-item, .layer-item-tree");
      if (!parent) return;
      parent.classList.toggle("active");
    });
  });
}
function initCollapseToggle(selector = ".collapse-toggle", callback) {
  const toggleButtons = document.querySelectorAll(selector);
  toggleButtons.forEach((button) => {
    button.addEventListener("click", function() {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      const controlsId = this.getAttribute("aria-controls");
      const panel = document.getElementById(controlsId);
      if (isExpanded) {
        this.setAttribute("aria-expanded", "false");
        this.classList.remove("active");
        if (panel) panel.classList.remove("active");
      } else {
        this.setAttribute("aria-expanded", "true");
        this.classList.add("active");
        if (panel) panel.classList.add("active");
      }
    });
  });
}
function initDetailPanelClose() {
  document.body.classList.remove("open-depth-2");
}
function initLayerUtilsBtnMeta() {
  const layerUtilsBtnMeta = document.querySelectorAll(".layer-utils-btn-meta");
  layerUtilsBtnMeta.forEach((btn) => {
    btn.addEventListener("click", function() {
      document.body.classList.add("open-depth-2");
    });
  });
}
function initMobilePanelToggle() {
  const mobileControls = document.querySelectorAll(".layer-mobile-control");
  mobileControls.forEach((control) => {
    control.addEventListener("click", function() {
      const body = document.body;
      const isCollapsed = body.classList.contains("layer-panel-collapsed");
      if (isCollapsed) {
        body.classList.remove("layer-panel-collapsed");
        body.classList.add("layer-panel-expanded");
      } else {
        body.classList.remove("layer-panel-expanded");
        body.classList.add("layer-panel-collapsed");
      }
    });
  });
}
function closeModal(modalId) {
  if (!modalId) {
    console.error("closeModal: modalId는 필수 매개변수입니다.");
    return;
  }
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`모달 요소를 찾을 수 없습니다. modalId: ${modalId}`);
    return;
  }
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (modal._triggerElement && typeof modal._triggerElement.focus === "function") {
    modal._triggerElement.focus();
  }
  if (modal._escapeHandler) {
    document.removeEventListener("keydown", modal._escapeHandler);
  }
  if (modal._backdropHandler) {
    modal.removeEventListener("click", modal._backdropHandler);
  }
  if (modal._closeHandler) {
    const modalClose = modal.querySelector(".modal-close");
    if (modalClose) {
      modalClose.removeEventListener("click", modal._closeHandler);
    }
  }
  delete modal._escapeHandler;
  delete modal._backdropHandler;
  delete modal._closeHandler;
  delete modal._triggerElement;
}
function initModalTriggers() {
  const modalTriggers = document.querySelectorAll("[data-modal]");
  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function(e) {
      e.preventDefault();
      const modalId = this.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (!modal) {
        console.error(`모달을 찾을 수 없습니다: ${modalId}`);
        return;
      }
      const modalTitle = modal.querySelector(".modal-title");
      const modalContent = modal.querySelector(".map-modal-content");
      if (!modalTitle || !modalContent) {
        console.error(`모달 구조가 올바르지 않습니다: ${modalId}`);
        return;
      }
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
      const modalClose = modal.querySelector(".modal-close");
      if (modalClose) modalClose.focus();
      modal._triggerElement = this;
      document.body.style.overflow = "hidden";
      const handleEscape = (e2) => {
        if (e2.key === "Escape") closeModal(modalId);
      };
      const handleBackdropClick = (e2) => {
        if (e2.target === modal) closeModal(modalId);
      };
      const handleCloseClick = () => {
        closeModal(modalId);
      };
      document.addEventListener("keydown", handleEscape);
      modal.addEventListener("click", handleBackdropClick);
      if (modalClose) modalClose.addEventListener("click", handleCloseClick);
      modal._escapeHandler = handleEscape;
      modal._backdropHandler = handleBackdropClick;
      modal._closeHandler = handleCloseClick;
    });
  });
}
function initZoomRangeValue() {
  const zoomInBtn = document.querySelector(".zoom-btn.zoom-in");
  const zoomOutBtn = document.querySelector(".zoom-btn.zoom-out");
  const zoomRange = document.querySelector(".zoom-range");
  const zoomValue = document.querySelector(".zoom-range-value");
  const zoomLevelValue = document.querySelector(".zoom-level-value");
  const gageBackground = document.querySelector(".gage-background");
  const minZoom = 1;
  const maxZoom = 14;
  let zoomLevel = 7;
  let isDragging = false;
  const updateZoomUI = () => {
    const percent = (zoomLevel - minZoom) / (maxZoom - minZoom) * 100;
    zoomValue.style.bottom = `${percent.toFixed(0)}%`;
    gageBackground.style.height = `calc(${percent.toFixed(0)}% - 0.1rem)`;
    zoomLevelValue.textContent = `LV${zoomLevel}`;
  };
  updateZoomUI();
  zoomInBtn.addEventListener("click", () => {
    if (zoomLevel < maxZoom) {
      zoomLevel++;
      updateZoomUI();
    }
  });
  zoomOutBtn.addEventListener("click", () => {
    if (zoomLevel > minZoom) {
      zoomLevel--;
      updateZoomUI();
    }
  });
  const updateZoomByMouse = (e) => {
    const rect = zoomRange.getBoundingClientRect();
    const offsetY = rect.bottom - e.clientY;
    let percent = offsetY / rect.height * 100;
    percent = Math.max(0, Math.min(100, percent));
    const level = Math.round(percent / 100 * (maxZoom - minZoom) + minZoom);
    zoomLevel = level;
    updateZoomUI();
  };
  zoomRange.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateZoomByMouse(e);
  });
  document.addEventListener("mousemove", (e) => {
    if (isDragging) updateZoomByMouse(e);
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}
function initFavLayersToggle() {
  const favLayerList = document.querySelector(".fav-layers");
  const btnMore = document.querySelector(".btn-more");
  btnMore.addEventListener("click", () => {
    favLayerList.classList.toggle("show-all");
    const expanded = favLayerList.classList.contains("show-all");
    btnMore.setAttribute("aria-expanded", expanded);
  });
}
function initToggleItem() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-toggle="item"]');
    if (!btn) return;
    btn.classList.toggle("active");
  });
}
function initTimeseriesRangeValue() {
  document.querySelectorAll('input[type="range"]').forEach((range) => {
    const max = parseFloat(range.getAttribute("max")) || 100;
    const min = parseFloat(range.getAttribute("min")) || 0;
    const calculatePercent = (val) => {
      return (val - min) / (max - min) * 100;
    };
    const initialPercent = calculatePercent(parseFloat(range.value) || min);
    range.style.setProperty("--value", initialPercent);
    range.addEventListener("input", (e) => {
      const currentValue = parseFloat(e.target.value);
      const percent = calculatePercent(currentValue);
      e.target.style.setProperty("--value", percent);
    });
  });
}
function initTransparencySliders(selector = ".transparency-slider", callback) {
  const sliders = document.querySelectorAll(selector);
  sliders.forEach((slider) => {
    const handle = slider.querySelector(".slider-handle");
    if (!handle) return;
    let isDragging = false;
    let currentValue = 50;
    handle.style.left = `${currentValue}%`;
    const updateValue = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let newValue = (clientX - rect.left) / rect.width * 100;
      newValue = Math.max(0, Math.min(100, newValue));
      currentValue = newValue;
      handle.style.left = `${currentValue}%`;
    };
    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      updateValue(e.clientX);
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
    handle.addEventListener("touchstart", (e) => {
      e.preventDefault();
      isDragging = true;
    });
    document.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      updateValue(touch.clientX);
    });
    document.addEventListener("touchend", () => {
      isDragging = false;
    });
    slider.addEventListener("click", (e) => {
      if (e.target === handle) return;
      updateValue(e.clientX);
    });
    slider.addEventListener("touchstart", (e) => {
      if (e.target === handle) return;
      const touch = e.touches[0];
      updateValue(touch.clientX);
    });
  });
}
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
initZoomRangeValue();
initFavLayersToggle();
initToggleItem();
initTimeseriesRangeValue();
initTransparencySliders();
if (mapInstance) {
  mapInstance.on("click", function(event) {
    event.coordinate;
    const pixel = event.pixel;
    showMapInfoPopup(pixel[0], pixel[1]);
  });
}
const detailPanelClose = document.querySelector(".detail-panel-close");
if (detailPanelClose) {
  detailPanelClose.addEventListener("click", function() {
    initDetailPanelClose();
  });
}
