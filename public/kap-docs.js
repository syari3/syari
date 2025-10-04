let materialsData = null;
let selectedCategory = 'すべて';

async function loadMaterials() {
  try {
    const response = await fetch('/kap-materials.json');
    materialsData = await response.json();
    
    displayCategories();
    displayMaterials();
  } catch (error) {
    console.error('資料の読み込みエラー:', error);
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
  
  const filteredMaterials = selectedCategory === 'すべて' 
    ? materialsData.materials 
    : materialsData.materials.filter(m => m.category === selectedCategory);
  
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
  const modal = document.getElementById('modal-overlay');
  const modalImage = document.getElementById('modal-image');
  
  modalImage.src = imageSrc;
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('modal-overlay');
  modal.classList.remove('active');
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target.id === 'modal-overlay') {
    closeModal();
  }
});

loadMaterials();
