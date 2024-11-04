// Wait for the DOM to be fully loaded before running the app
document.addEventListener("DOMContentLoaded", () => {
  // State management: Keep track of current pets, liked pets, and sorting order
  let currentPets = [];
  let likedPets = new Set();
  let isDescendingPrice = true;

  // Utility function: Format date or return 'Not specified' if date is missing
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  // Utility function: Countdown animation for adopt button
  const countdown = async (button) => {
    const modal = document.getElementById("adopt-confirmation-modal");
    const countdownDisplay = document.getElementById("countdown-number");

    // Show the modal
    modal.showModal();

    button.disabled = true;

    // Start countdown
    for (let i = 3; i > 0; i--) {
      countdownDisplay.textContent = i;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Close modal
    modal.close();

    // Update button
    button.textContent = "Adopted";
    button.classList.add("btn-success");
    button.classList.remove("text-teal-600");
    button.classList.add("text-white");
  };

  // Utility function: Create HTML for a pet card
  const createPetCard = (pet) => {
    return `
    <div class="card rounded-xl p-4 border border-gray-200">
      <figure>
        <img 
          src="${pet.image}" 
          alt="${pet.pet_name}" 
          class="rounded-xl w-full object-cover" 
        />
      </figure>
      <div class="mt-4">
        <h2 class="text-2xl font-bold text-black mb-4">${pet.pet_name}</h2>
        
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-gray-600">
            <i class="fas fa-th"></i>
            <span>Breed: ${pet.breed || "Not specified"}</span>
          </div>
          
          <div class="flex items-center gap-2 text-gray-600">
            <i class="far fa-calendar"></i>
            <span>Birth: ${formatDate(pet.date_of_birth)}</span>
          </div>
          
          <div class="flex items-center gap-2 text-gray-600">
            <i class="fas fa-venus-mars"></i>
            <span>Gender: ${pet.gender || "Not specified"}</span>
          </div>
          
          <div class="flex items-center gap-2 text-gray-600">
            <i class="fas fa-dollar-sign"></i>
            <span>Price : ${pet.price || "Not specified"}$</span>
          </div>
        </div>
        </br>
        <hr class="my-4 border-gray-200">
        </br>
        <div class="flex justify-between">
        <button class="btn rounded-full w-12 h-12 flex items-center justify-center bg-white hover:bg-blue-50 border border-gray-200 transition-all duration-300 like-btn ${
          likedPets.has(pet.petId)
            ? "active bg-blue-500 hover:bg-blue-600 text-white"
            : "text-gray-600"
        }" data-pet-id="${pet.petId}">
          <i class="far fa-heart ${
            likedPets.has(pet.petId) ? "fas text-white" : "far text-gray-600"
          }"></i>
        </button>
        <button class="btn px-6 py-2 text-teal-600 font-medium bg-white rounded-lg border border-gray-200 adopt-btn" data-pet-id="${
          pet.petId
        }">
          Adopt
        </button>
        <button class="btn px-6 py-2 text-teal-600 font-medium bg-white rounded-lg border border-gray-200 details-btn" data-pet-id="${
          pet.petId
        }">
          Details
        </button>
      </div>
      </div>
    </div>
  `;
  };

  // API call: Fetch all pets
  const fetchAllPets = async () => {
    try {
      const response = await fetch(
        "https://openapi.programming-hero.com/api/peddy/pets"
      );
      const data = await response.json();
      return data.pets;
    } catch (error) {
      console.error("Error fetching all pets:", error);
      throw error;
    }
  };

  // API call: Fetch a specific pet by ID
  const fetchPetById = async (petId) => {
    try {
      const response = await fetch(
        `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching pet by ID:", error);
      throw error;
    }
  };

  // API call: Fetch all pet categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://openapi.programming-hero.com/api/peddy/categories"
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  // API call: Fetch pets by category
  const fetchPetsByCategory = async (category) => {
    try {
      const response = await fetch(
        `https://openapi.programming-hero.com/api/peddy/category/${category}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching pets by category:", error);
      throw error;
    }
  };

  // UI setup: Initialize mobile menu toggle
  const setupMobileMenu = () => {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  };

  // UI setup: Initialize sort button
  const setupSortButton = () => {
    const sortBtn = document.getElementById("sort-price-btn");
    sortBtn.addEventListener("click", () => {
      isDescendingPrice = !isDescendingPrice;
      currentPets.sort((a, b) =>
        isDescendingPrice ? b.price - a.price : a.price - b.price
      );
      renderPets(currentPets);
    });
  };

  // UI render: Display pet categories and set up category filter
  const renderCategories = (categories) => {
    const container = document.getElementById("pet-categories");
    const template = document.getElementById("category-button-template");
    const petsGrid = document.getElementById("pets-grid");
    const loadingSpinner = document.getElementById("loading-spinner");

    // Clear existing buttons
    container.innerHTML = "";

    // Create and append buttons for each category
    categories.forEach((category) => {
      const button = template.content
        .cloneNode(true)
        .querySelector(".category-btn");
      const icon = button.querySelector(".category-icon");
      const name = button.querySelector(".category-name");

      // Set button data and content
      button.dataset.category = category.category.toLowerCase();
      icon.src = category.category_icon;
      icon.alt = category.category;
      name.textContent = category.category;

      // Add initial styling classes
      button.classList.add(
        "bg-gradient-to-br",
        "from-white",
        "to-gray-50",
        "shadow-md"
      );

      container.appendChild(button);
    });

    // Add click event listener to container (event delegation)
    container.addEventListener("click", async (e) => {
      const categoryBtn = e.target.closest(".category-btn");
      if (!categoryBtn) return;

      const category = categoryBtn.dataset.category;

      // Update button states
      document.querySelectorAll(".category-btn").forEach((btn) => {
        // Reset all buttons
        btn.classList.remove(
          "from-teal-500",
          "to-purple-500",
          "border-teal-200",
          "rounded-full"
        );
        btn.classList.add("from-white", "to-gray-50", "rounded-xl");

        // Reset text color
        const nameSpan = btn.querySelector(".category-name");
        nameSpan.classList.remove("text-white");
        nameSpan.classList.add("text-gray-700");

        // Reset icon container
        const iconContainer = btn.querySelector(".icon-container");
        iconContainer.classList.remove("from-teal-100");
        iconContainer.classList.add("from-gray-50");
      });

      // Style active button
      categoryBtn.classList.remove("from-white", "to-gray-50", "rounded-xl");
      categoryBtn.classList.add(
        "from-teal-500",
        "to-purple-500",
        "border-teal-200",
        "rounded-full"
      );

      // Style active button text
      const activeName = categoryBtn.querySelector(".category-name");
      activeName.classList.remove("text-gray-700");
      activeName.classList.add("text-white");

      // Style active icon container
      const activeIconContainer = categoryBtn.querySelector(".icon-container");
      activeIconContainer.classList.remove("from-gray-50");
      activeIconContainer.classList.add("from-teal-100");

      // Clear grid and show loading spinner
      petsGrid.innerHTML = "";
      loadingSpinner.classList.remove("hidden");

      try {
        // Create a promise that resolves after 2 seconds
        const delay = new Promise((resolve) => setTimeout(resolve, 2000));

        // Fetch data and wait for delay in parallel
        const [response] = await Promise.all([
          fetchPetsByCategory(category),
          delay,
        ]);

        // Hide loading spinner
        loadingSpinner.classList.add("hidden");

        currentPets = response.data;
        currentPets.length === 0
          ? showNoResultsMessage()
          : renderPets(currentPets);
      } catch (error) {
        console.error("Error fetching category pets:", error);
        loadingSpinner.classList.add("hidden");
        showErrorMessage("Failed to load pets for this category.");
      }
    });
  };

  // UI render: Display pets and set up event listeners
  const renderPets = (pets) => {
    const container = document.getElementById("pets-grid");
    container.innerHTML = pets.map((pet) => createPetCard(pet)).join("");

    // Add event listeners for like, adopt, and details buttons
    container.querySelectorAll(".like-btn").forEach((btn) => {
      btn.addEventListener("click", () => toggleLikedPet(btn.dataset.petId));
    });

    container.querySelectorAll(".adopt-btn").forEach((btn) => {
      btn.addEventListener("click", () => countdown(btn));
    });

    container.querySelectorAll(".details-btn").forEach((btn) => {
      btn.addEventListener("click", () => showPetDetails(btn.dataset.petId));
    });
  };

  // UI message: Show message when no pets are found
  const showNoResultsMessage = () => {
    const container = document.getElementById("pets-grid");
    container.innerHTML = `
      <div class="col-span-full text-center py-12 border-gray-400 rounded-2xl">
        <img class="fas fa-search text-4xl text-gray-400 mb-4" src="images/error.webp">
        <h3 class="text-4xl font-bold mb-2">No Pets Found</h3>
        <p class="text-gray-600">No pets available in this category right now.</p>
      </div>
    `;
  };

  // UI message: Show error message
  const showErrorMessage = (message) => {
    const container = document.getElementById("pets-grid");
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <h3 class="text-xl font-semibold mb-2">Error</h3>
        <p class="text-gray-600">${message}</p>
      </div>
    `;
  };

  // UI interaction: Toggle liked status for a pet
  const toggleLikedPet = (petId) => {
    const pet = currentPets.find((p) => p.petId === parseInt(petId));
    if (!pet) return;

    const likeBtn = document.querySelector(`.like-btn[data-pet-id="${petId}"]`);
    const heartIcon = likeBtn.querySelector("i");

    if (likedPets.has(parseInt(petId))) {
      likedPets.delete(parseInt(petId));
      likeBtn.classList.remove(
        "active",
        "bg-blue-500",
        "hover:bg-blue-600",
        "text-white"
      );
      likeBtn.classList.add("text-gray-600", "hover:bg-blue-50");
      heartIcon.classList.remove("fas", "text-white");
      heartIcon.classList.add("far", "text-gray-600");
    } else {
      likedPets.add(parseInt(petId));
      likeBtn.classList.add(
        "active",
        "bg-blue-500",
        "hover:bg-blue-600",
        "text-blue"
      );
      likeBtn.classList.remove("text-gray-600", "hover:bg-blue-50");
      heartIcon.classList.remove("far", "text-gray-600");
      heartIcon.classList.add("fas", "text-blue");
    }

    updateLikedPetsPanel();
  };

  // UI update: Refresh the liked pets panel
  const updateLikedPetsPanel = () => {
    const likedPetsGrid = document.getElementById("liked-pets-grid");

    // Clear existing content
    likedPetsGrid.innerHTML = "";

    // Create and append pet thumbnails
    likedPets.forEach(async (petId) => {
      try {
        const petData = await fetchPetById(petId);
        const pet = petData.petData;

        const petElement = document.createElement("div");
        petElement.innerHTML = `
        <div class= "p-2 border border-gray-400 rounded-xl">
          <img 
          src="${pet.image}" 
          alt="${pet.pet_name}" 
          class="w-full h-24 object-cover rounded-xl cursor-pointer"
          onclick="toggleLikedPet('${petId}')"
          />
        </div>
      `;

        likedPetsGrid.appendChild(petElement);
      } catch (error) {
        console.error("Error fetching liked pet details:", error);
      }
    });
  };
  // UI interaction: Show detailed information for a pet
  const showPetDetails = async (petId) => {
    try {
      const petData = await fetchPetById(petId);
      const modal = document.getElementById("pet-modal");
      const modalContent = document.getElementById("modal-content");

      // Checking if the modal and modal content elements exist
      if (!modal || !modalContent) {
        console.error("Modal or modal content element not found");
        return;
      }

      // Populate the modal content
      modalContent.innerHTML = `
        <div class="max-w-2xl mx-auto p-6 rounded-xl">
          <img 
            src="${petData.petData.image}" 
            alt="${petData.petData.pet_name}" 
            class="w-full h-64 object-cover rounded-xl mb-6"
          >
          <h2 class="text-2xl font-bold mb-6">${petData.petData.pet_name}</h2>
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="flex items-center gap-2 text-gray-600">
              <i class="fas fa-paw"></i>
              <span>Breed: ${petData.petData.breed}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <i class="fas fa-calendar"></i>
              <span>Birth: ${formatDate(petData.petData.date_of_birth)}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <i class="fas fa-venus"></i>
              <span>Gender: ${petData.petData.gender}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <i class="fas fa-dollar-sign"></i>
              <span>Price: ${petData.petData.price}$</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <i class="fas fa-syringe"></i>
              <span>Vaccinated status: ${
                petData.petData.vaccinated_status
              }</span>
            </div>
          </div>
  
          <div class="mt-6">
            <h3 class="text-xl font-bold mb-4">Details Information</h3>
            <p class="text-gray-600 mb-3">
              ${petData.petData.pet_details}
            </p>
          </div>
        </div>
      `;

      modal.showModal();
    } catch (error) {
      console.error("Error fetching pet details:", error);
      showErrorMessage("Failed to load pet details.");
    }
  };

  // Scroll to adopt section
  window.scrollToAdopt = () => {
    document
      .getElementById("adopt-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // Initialize the application
  const init = async () => {
    try {
      const categoriesResponse = await fetchCategories();
      renderCategories(categoriesResponse.categories);

      const petsResponse = await fetchAllPets();
      currentPets = petsResponse;
      renderPets(currentPets);

      setupSortButton();
    } catch (error) {
      console.error("Error initializing app:", error);
      showErrorMessage("Failed to load pet data. Please try again later.");
    }
  };

  // Start the app
  setupMobileMenu();
  init();
});