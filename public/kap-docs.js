let materialsData = null;
let selectedCategory = 'すべて';
let searchQuery = '';
let sortOrder = 'new';

async function loadMaterials() {
  try {
    const response = await fetch('/kap-materials.json');
    if (!response.ok) {
      throw new Error('資料データの読み込みに失敗しました');
    }
    materialsData = await response.json();
    
    displayCategories();
    displayMaterials();
    setupEventListeners();
  } catch (error) {
    console.error('資料の読み込みエラー:', error);
    const materialsGrid = document.getElementById('materials-grid');
    materialsGrid.innerHTML = '<p class="no-results">資料データの読み込みに失敗しました。ページを再読み込みしてください。</p>';
  }
}

function displayCategories() {
  const categoryList = document.getElementById('category-list');
  categoryList.innerHTML = '';
  
  const allCategory = document.createElement('div');
  allCategory.className = 'category-item active';
  allCategory.textContent = 'すべて';
  allCategory.addEventListener('click', () => selectCategory('すべて', allCategory));
  categoryList.appendChild(allCategory);
  
  materialsData.categories.forEach(category => {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';
    categoryItem.textContent = category;
    categoryItem.addEventListener('click', () => selectCategory(category, categoryItem));
    categoryList.appendChild(categoryItem);
  });
}

function selectCategory(category, element) {
  selectedCategory = category;
  
  document.querySelectorAll('.category-item').forEach(item => {
    item.classList.remove('active');
  });
  element.classList.add('active');
  
  displayMaterials();
}

function displayMaterials() {
  const materialsGrid = document.getElementById('materials-grid');
  materialsGrid.innerHTML = '';
  
  let filteredMaterials = selectedCategory === 'すべて' 
    ? [...materialsData.materials]
    : materialsData.materials.filter(m => m.category === selectedCategory);
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredMaterials = filteredMaterials.filter(m => 
      m.title.toLowerCase().includes(query) || 
      m.description.toLowerCase().includes(query)
    );
  }
  
  filteredMaterials.sort((a, b) => {
    if (sortOrder === 'new') {
      return b.id - a.id;
    } else {
      return a.id - b.id;
    }
  });
  
  if (filteredMaterials.length === 0) {
    materialsGrid.innerHTML = '<p class="no-results">該当する資料がありません</p>';
    return;
  }
  
  filteredMaterials.forEach(material => {
    const card = document.createElement('div');
    card.className = 'material-card';
    
    const img = document.createElement('img');
    img.src = material.image;
    img.alt = material.title;
    img.className = 'material-image';
    img.loading = 'lazy';
    
    const info = document.createElement('div');
    info.className = 'material-info';
    
    const title = document.createElement('h3');
    title.textContent = material.title;
    title.className = 'material-title';
    
    const category = document.createElement('span');
    category.textContent = material.category;
    category.className = 'material-category';
    
    const description = document.createElement('p');
    description.textContent = material.description;
    description.className = 'material-description';
    
    info.appendChild(title);
    info.appendChild(category);
    info.appendChild(description);
    
    card.appendChild(img);
    card.appendChild(info);
    
    card.addEventListener('click', () => openModal(material.image));
    
    materialsGrid.appendChild(card);
  });
}

function openModal(imageSrc) {
  if (!imageSrc) {
    console.error('画像のパスが指定されていません');
    return;
  }
  
  const modal = document.getElementById('modal-overlay');
  const modalImage = document.getElementById('modal-image');
  
  modalImage.src = imageSrc;
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('modal-overlay');
  modal.classList.remove('active');
}

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    displayMaterials();
  });
  
  const sortNewButton = document.getElementById('sort-new');
  const sortOldButton = document.getElementById('sort-old');
  
  sortNewButton.addEventListener('click', () => {
    sortOrder = 'new';
    sortNewButton.classList.add('active');
    sortOldButton.classList.remove('active');
    displayMaterials();
  });
  
  sortOldButton.addEventListener('click', () => {
    sortOrder = 'old';
    sortOldButton.classList.add('active');
    sortNewButton.classList.remove('active');
    displayMaterials();
  });
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target.id === 'modal-overlay') {
    closeModal();
  }
});

loadMaterials();
