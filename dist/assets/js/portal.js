const portal = {};
let appliedConditions = [];
portal.initMobileMenu = function() {
  const btnAllmenu = document.querySelector("#btnAllMenu");
  const closeSitemapBtn = document.querySelector(".close-sitemap-btn");
  if (btnAllmenu) {
    btnAllmenu.addEventListener("click", () => {
      const mobileNav = document.querySelector("#mobile-nav");
      if (mobileNav) {
        mobileNav.classList.toggle("active");
      }
    });
  }
  if (closeSitemapBtn) {
    closeSitemapBtn.addEventListener("click", () => {
      const mobileNav = document.querySelector("#mobile-nav");
      if (mobileNav) {
        mobileNav.classList.remove("active");
      }
    });
  }
};
portal.initPortalBoard = function() {
  const sortTypeBtns = document.querySelectorAll(".sort-type-btn");
  sortTypeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!btn.classList.contains("active")) {
        sortTypeBtns.forEach((btns) => {
          btns.classList.remove("active");
        });
        btn.classList.add("active");
      }
    });
  });
};
portal.initDetailSearch = function() {
  const detailSearchToggle = document.getElementById("detailSearchToggle");
  const detailSearchFilters = document.getElementById("detailSearchFilters");
  const filterSelects = document.querySelectorAll(".krds-form-select");
  const resetConditions = document.getElementById("resetConditions");
  if (detailSearchToggle && detailSearchFilters) {
    detailSearchToggle.addEventListener("click", function() {
      detailSearchToggle.classList.toggle("active");
      detailSearchFilters.classList.toggle("active");
    });
  }
  filterSelects.forEach((select) => {
    select.addEventListener("change", function() {
      portal.updateAppliedConditions();
    });
  });
  if (resetConditions) {
    resetConditions.addEventListener("click", function() {
      filterSelects.forEach((select) => {
        select.value = "";
      });
      portal.updateAppliedConditions();
    });
  }
};
portal.updateAppliedConditions = function() {
  const filterSelects = document.querySelectorAll(".krds-form-select");
  const conditionCount = document.querySelector(".condition-count");
  appliedConditions = [];
  filterSelects.forEach((select) => {
    if (select.value && select.value !== "") {
      const filterItem = select.closest(".filter-item");
      const label = filterItem.querySelector(".filter-label").textContent;
      appliedConditions.push({
        label,
        value: select.value,
        select
      });
    }
  });
  if (conditionCount) {
    conditionCount.textContent = appliedConditions.length;
  }
  portal.renderConditionTags();
};
portal.renderConditionTags = function() {
  const conditionTags = document.getElementById("conditionTags");
  if (!conditionTags) return;
  conditionTags.innerHTML = "";
  appliedConditions.forEach((condition) => {
    const tag = document.createElement("div");
    tag.className = "condition-tag";
    tag.innerHTML = `
      <span>${condition.value}</span>
      <button type="button" class="remove-tag" data-value="${condition.value}">
        <i class="icon-close"></i>
      </button>
    `;
    const removeBtn = tag.querySelector(".remove-tag");
    removeBtn.addEventListener("click", function() {
      condition.select.value = "";
      portal.updateAppliedConditions();
    });
    conditionTags.appendChild(tag);
  });
};
portal.initSearch = function() {
  const searchBtn = document.querySelector(".search-btn");
  const searchInput = document.querySelector(".search-input");
  if (searchBtn) {
    searchBtn.addEventListener("click", function() {
      portal.performSearch();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        portal.performSearch();
      }
    });
  }
};
portal.performSearch = function() {
  const searchInput = document.querySelector(".search-input");
  const filterSelects = document.querySelectorAll(".krds-form-select");
  const searchTerm = searchInput ? searchInput.value.trim() : "";
  const filters = {};
  filterSelects.forEach((select) => {
    if (select.value && select.value !== "") {
      const filterItem = select.closest(".filter-item");
      const label = filterItem.querySelector(".filter-label").textContent;
      filters[label] = select.value;
    }
  });
  console.log("검색어:", searchTerm, "필터:", filters);
};
portal.initMobileTable = function() {
  portal.addLabelsToTable();
  portal.handleResize();
  window.addEventListener("resize", function() {
    portal.handleResize();
  });
};
portal.addLabelsToTable = function() {
  const tables = document.querySelectorAll(".board-list__body table, .table__list table");
  tables.forEach((table) => {
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    if (!thead || !tbody) return;
    const headers = Array.from(thead.querySelectorAll("th")).slice(1).map((th) => th.textContent.trim());
    tbody.querySelectorAll("tr").forEach((row) => {
      const cells = Array.from(row.querySelectorAll("td")).slice(1);
      cells.forEach((cell, index) => {
        if (index < headers.length) {
          const originalContent = cell.innerHTML;
          cell.innerHTML = `<span class="mobile-label">${headers[index]}:</span> ${originalContent}`;
        }
      });
    });
  });
};
portal.handleResize = function() {
  const isMobile = window.innerWidth <= 768;
  const mobileLabels = document.querySelectorAll(".mobile-label");
  mobileLabels.forEach((label) => {
    label.style.display = isMobile ? "inline" : "none";
  });
};
portal.initTabNav = function() {
  const tabNavContainers = document.querySelectorAll(".tab-nav-container");
  tabNavContainers.forEach((container) => {
    const toggle = container.querySelector(".toggle");
    container.querySelector(".tab-nav");
    const tabItems = container.querySelectorAll(".tab-nav-item");
    if (toggle) {
      toggle.addEventListener("click", function(e) {
        e.stopPropagation();
        this.classList.toggle("active");
      });
    }
    tabItems.forEach((tab) => {
      tab.addEventListener("click", function() {
        tabItems.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-current", "false");
        });
        this.classList.add("active");
        this.setAttribute("aria-current", "page");
        if (window.innerWidth <= 767 && toggle) {
          toggle.classList.remove("active");
          const toggleText = toggle.querySelector(".toggle-text");
          if (toggleText) {
            toggleText.textContent = this.textContent.trim();
          }
        }
      });
    });
  });
  document.addEventListener("click", function(e) {
    tabNavContainers.forEach((container) => {
      const toggle = container.querySelector(".toggle");
      if (toggle && window.innerWidth <= 767) {
        if (!container.contains(e.target)) {
          toggle.classList.remove("active");
        }
      }
    });
  });
};
portal.initCategoryTabs = function() {
  const categoryToggle = document.querySelector(".category-toggle");
  const categoryTabs = document.querySelectorAll(".category-tab");
  if (categoryToggle) {
    categoryToggle.addEventListener("click", function() {
      this.classList.toggle("active");
    });
  }
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", function() {
      categoryTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      if (window.innerWidth <= 767 && categoryToggle) {
        categoryToggle.classList.remove("active");
        const toggleText = categoryToggle.querySelector(".toggle-text");
        if (toggleText) {
          toggleText.textContent = this.textContent.trim();
        }
      }
    });
  });
  document.addEventListener("click", function(e) {
    if (categoryToggle && window.innerWidth <= 767) {
      const container = categoryToggle.closest(".category-tabs-container");
      if (container && !container.contains(e.target)) {
        categoryToggle.classList.remove("active");
      }
    }
  });
};
portal.initMobileMenu();
portal.initPortalBoard();
portal.initDetailSearch();
portal.initSearch();
portal.initMobileTable();
portal.initTabNav();
portal.initCategoryTabs();
