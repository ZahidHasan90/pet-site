🐾 Peddy - Pet Adoption Platform
Peddy is a modern pet adoption platform designed to connect people with their ideal pets. It allows users to browse pets, like their favorites, and start the adoption process with just a few clicks.

🚀 Features
Responsive Design: Fully responsive UI, optimized for mobile and desktop devices using Tailwind CSS.
Dynamic Categories: Users can filter pets by categories, ensuring a personalized browsing experience.
Sorting by Price: Sort pets by their price, helping users find the best deals.
Adopt Your Best Friend Section: Showcase for top pets available for adoption.
Like Feature: Allows users to like their favorite pets for quick reference.
Loading Spinner: Interactive loading spinner while fetching pets.
No Results Message: Displays a custom message when no pets are available in a selected category.
Adoption Confirmation Modal: Confirmation modal when a user proceeds with adopting a pet.
Modern Navbar & Footer: Clean and functional navigation and footer design.
Error Handling: Shows an error image/message when no pets are found in the selected category.
🖥️ Tech Stack
HTML5: For building the structure of the website.
Tailwind CSS: Utility-first CSS framework for styling the application.
JavaScript (Vanilla): For dynamic content and interactivity.
Font Awesome: For icons used throughout the project.
API Integration: To fetch pet data dynamically and populate the grid.
DaisyUI: Component library for Tailwind CSS to enhance UI elements.
📜 Pages Overview
Homepage (index.html):
Features a banner section introducing the adoption platform.
The main section allows users to browse and adopt pets.
Responsive layout with sorting options and dynamic pet categories.
Shop (shop.html):
Dedicated page for shop items related to pet care.
Contact (contact.html):
Contact form to allow users to reach out for support or inquiries.
📦 API Integration
The platform fetches data dynamically from an API to display available pets. Below is an example of how the API integration is structured in app.js:
const petsGrid = document.getElementById('pets-grid');

// Fetching pets from the API
fetch('https://openapi.programming-hero.com/api/peddy/categories')
  .then(response => response.json())
  .then(pets => {
    displayPets(pets);
  })
  .catch(error => {
    console.error('Error fetching pets:', error);
    showNoResultsMessage();
  });
📝 Usage
1. View Pets
Users can browse through available pets, sorted dynamically by categories.
2. Sort Pets
Users can sort pets by price.
3. Adopt a Pet
Clicking the "Adopt" button opens a modal to confirm the adoption process.
4. Like a Pet
Users can "like" pets to save them for later reference.
5. Shop for Pet Products
Users can browse pet-related products in the shop section.
🎨 Customization
Tailwind CSS: You can customize the theme and component styles using Tailwind.config.js if needed.
Dynamic Content: Modify the app.js file to handle different types of data or enhance the pet cards with more details (e.g., medical history, adoption fees).
📧 Contact
For support or inquiries, please reach out to:

Email: hasan.zahid@example.com
Location: 123 Hasan Zahid Avenue, Yokohama, Japan
🌐 Live Demo
You can view a live demo of the project here.
https://sensational-platypus-9bfe55.netlify.app/
