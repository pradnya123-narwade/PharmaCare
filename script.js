
// =====================================================
// PHARMACARE - PHARMACY INVENTORY MANAGEMENT SYSTEM
// Program 1: HTML, CSS and JavaScript
// =====================================================

// API Configuration
const API_URL = "https://dummyjson.com/products";

// Application Data
let medicines = [];
let editingId = null;
let nextId = 10000;


// =====================================================
// 1. SAMPLE MEDICINE DATA
// =====================================================

const sampleMedicines = [
    {
        id: 101,
        name: "Paracetamol 500mg",
        manufacturer: "Cipla",
        category: "Tablet",
        price: 25,
        quantity: 120,
        expiryDate: "2027-08-15"
    },
    {
        id: 102,
        name: "Amoxicillin 250mg",
        manufacturer: "Sun Pharma",
        category: "Capsule",
        price: 65,
        quantity: 45,
        expiryDate: "2027-05-20"
    },
    {
        id: 103,
        name: "Cough Relief Syrup",
        manufacturer: "Dr. Reddy's",
        category: "Syrup",
        price: 95,
        quantity: 8,
        expiryDate: "2027-12-10"
    },
    {
        id: 104,
        name: "Vitamin C Tablets",
        manufacturer: "Himalaya",
        category: "Tablet",
        price: 40,
        quantity: 200,
        expiryDate: "2028-01-12"
    },
    {
        id: 105,
        name: "Antiseptic Ointment",
        manufacturer: "Glenmark",
        category: "Ointment",
        price: 55,
        quantity: 0,
        expiryDate: "2027-09-30"
    },
    {
        id: 106,
        name: "Azithromycin 500mg",
        manufacturer: "Zydus",
        category: "Tablet",
        price: 110,
        quantity: 12,
        expiryDate: "2027-11-18"
    }
];


// =====================================================
// 2. DATE DISPLAY
// =====================================================

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });


// =====================================================
// 3. FETCH API - GET MEDICINES
// =====================================================

async function loadMedicines() {

    const refreshButton = document.querySelector(".text-btn");

    if (refreshButton) {
        refreshButton.textContent = "Loading...";
    }

    try {

        // Send GET request using Fetch API
        const response = await fetch(`${API_URL}?limit=6`);

        // Check server response
        if (!response.ok) {
            throw new Error("Failed to fetch medicine data");
        }

        // Convert JSON response into JavaScript object
        const data = await response.json();

        // Sample API products mapped to pharmacy records
        const categories = [
            "Tablet",
            "Capsule",
            "Syrup",
            "Injection",
            "Ointment",
            "Tablet"
        ];

        const quantities = [120, 45, 8, 200, 0, 12];

        medicines = data.products.map((product, index) => {

            return {
                id: product.id,
                name: product.title,
                manufacturer: product.brand || "Generic Manufacturer",
                category: categories[index % categories.length],
                price: Number(product.price),
                quantity: quantities[index % quantities.length],
                expiryDate: "2027-12-31"
            };

        });

        showToast("Medicine data fetched successfully!");

        console.log("GET API Response:", data);

    } catch (error) {

        console.error("GET API Error:", error);

        // Use sample records if API is unavailable
        medicines = sampleMedicines.map(item => ({ ...item }));

        showToast("API unavailable. Sample data loaded.");

    } finally {

        if (refreshButton) {
            refreshButton.textContent = "Refresh Inventory";
        }

        displayMedicines();
        updateStatistics();
    }
}


// =====================================================
// 4. DISPLAY MEDICINES USING DOM MANIPULATION
// =====================================================

function displayMedicines() {

    const table = document.getElementById("medicineTable");
    const emptyState = document.getElementById("emptyState");

    const searchValue = document
        .getElementById("searchInput")
        .value.toLowerCase()
        .trim();

    const categoryValue =
        document.getElementById("categoryFilter").value;

    const stockValue =
        document.getElementById("stockFilter").value;


    // Search and filtering
    const filteredMedicines = medicines.filter(medicine => {

        const matchesSearch =
            medicine.name.toLowerCase().includes(searchValue) ||
            medicine.manufacturer.toLowerCase().includes(searchValue);

        const matchesCategory =
            categoryValue === "All" ||
            medicine.category === categoryValue;

        let matchesStock = true;

        if (stockValue === "Available") {
            matchesStock = medicine.quantity > 10;
        }

        else if (stockValue === "Low") {
            matchesStock =
                medicine.quantity > 0 &&
                medicine.quantity <= 10;
        }

        else if (stockValue === "Out") {
            matchesStock = medicine.quantity === 0;
        }

        return matchesSearch && matchesCategory && matchesStock;

    });


    // Clear previous records
    table.innerHTML = "";


    // Display empty state
    emptyState.hidden = filteredMedicines.length !== 0;


    // Create table rows dynamically
    filteredMedicines.forEach(medicine => {

        let status = "Available";
        let statusClass = "available";

        if (medicine.quantity === 0) {
            status = "Out of Stock";
            statusClass = "out";
        }

        else if (medicine.quantity <= 10) {
            status = "Low Stock";
            statusClass = "low";
        }


        const row = document.createElement("tr");


        // Medicine Name
        const nameCell = document.createElement("td");

        const name = document.createElement("span");
        name.className = "medicine-name";
        name.textContent = medicine.name;

        const company = document.createElement("span");
        company.className = "medicine-company";
        company.textContent = medicine.manufacturer;

        nameCell.append(name, company);


        // Medicine ID
        const idCell = document.createElement("td");
        idCell.className = "medicine-id";
        idCell.textContent = "MED-" + medicine.id;


        // Category
        const categoryCell = document.createElement("td");

        const category = document.createElement("span");
        category.className = "category-tag";
        category.textContent = medicine.category;

        categoryCell.appendChild(category);


        // Price
        const priceCell = document.createElement("td");
        priceCell.textContent =
            "₹" + Number(medicine.price).toFixed(2);


        // Quantity
        const quantityCell = document.createElement("td");
        quantityCell.textContent = medicine.quantity;


        // Expiry Date
        const expiryCell = document.createElement("td");
        expiryCell.textContent = medicine.expiryDate;


        // Stock Status
        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");
        statusBadge.className = "status " + statusClass;
        statusBadge.textContent = status;

        statusCell.appendChild(statusBadge);


        // Action Buttons
        const actionCell = document.createElement("td");

        const actionButtons = document.createElement("div");
        actionButtons.className = "action-buttons";


        // Edit Button
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editMedicine(medicine.id);
        });


        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteMedicine(medicine.id);
        });


        actionButtons.append(editButton, deleteButton);
        actionCell.appendChild(actionButtons);


        // Append all cells to row
        row.append(
            nameCell,
            idCell,
            categoryCell,
            priceCell,
            quantityCell,
            expiryCell,
            statusCell,
            actionCell
        );

        table.appendChild(row);

    });


    // Update record count
    document.getElementById("recordCount").textContent =
        filteredMedicines.length + " Records";

    document.getElementById("tableSummary").textContent =
        `Showing ${filteredMedicines.length} of ${medicines.length} medicines`;

}


// =====================================================
// 5. UPDATE DASHBOARD STATISTICS
// =====================================================

function updateStatistics() {

    const totalMedicines = medicines.length;

    const totalUnits = medicines.reduce(
        (sum, medicine) => sum + Number(medicine.quantity),
        0
    );

    const lowStock = medicines.filter(
        medicine =>
            medicine.quantity > 0 &&
            medicine.quantity <= 10
    ).length;

    const inventoryValue = medicines.reduce(
        (sum, medicine) =>
            sum + medicine.price * medicine.quantity,
        0
    );


    document.getElementById("totalMedicines").textContent =
        totalMedicines;

    document.getElementById("totalUnits").textContent =
        totalUnits.toLocaleString("en-IN");

    document.getElementById("lowStock").textContent =
        lowStock;

    document.getElementById("inventoryValue").textContent =
        "₹" + inventoryValue.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });

}


// =====================================================
// 6. INPUT VALIDATION
// =====================================================

function validateMedicine(data) {

    const message = document.getElementById("formMessage");

    message.textContent = "";
    message.style.color = "#ce5353";


    // Empty field validation
    if (
        !data.title ||
        !data.brand ||
        !data.category ||
        !data.expiryDate
    ) {

        message.textContent =
            "All fields are required. Please complete the form.";

        return false;
    }


    // Medicine name validation
    if (data.title.length < 3) {

        message.textContent =
            "Medicine name must contain at least 3 characters.";

        return false;
    }


    // Manufacturer validation
    if (data.brand.length < 2) {

        message.textContent =
            "Please enter a valid manufacturer name.";

        return false;
    }


    // Price validation
    if (
        !Number.isFinite(data.price) ||
        data.price <= 0
    ) {

        message.textContent =
            "Price must be greater than zero.";

        return false;
    }


    // Quantity validation
    if (
        !Number.isInteger(data.quantity) ||
        data.quantity < 0
    ) {

        message.textContent =
            "Quantity must be a non-negative whole number.";

        return false;
    }


    // Expiry date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(data.expiryDate + "T00:00:00");

    if (
        Number.isNaN(expiry.getTime()) ||
        expiry <= today
    ) {

        message.textContent =
            "Expiry date must be a future date.";

        return false;
    }


    return true;
}


// =====================================================
// 7. ADD AND UPDATE MEDICINE
// =====================================================

document.getElementById("medicineForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        // Collect form values
        const medicineData = {

            title: document.getElementById("medicineName")
                .value.trim(),

            brand: document.getElementById("manufacturer")
                .value.trim(),

            category: document.getElementById("category")
                .value,

            price: Number(document.getElementById("price").value),

            quantity: Number(document.getElementById("quantity").value),

            expiryDate: document.getElementById("expiryDate").value

        };


        // Validate form data
        if (!validateMedicine(medicineData)) {
            return;
        }


        const message = document.getElementById("formMessage");

        const submitButton = document.getElementById("submitBtn");

        submitButton.disabled = true;
        submitButton.textContent = "Processing...";


        try {

            if (editingId !== null) {

                // PUT REQUEST - UPDATE MEDICINE

                const response = await fetch(
                    `${API_URL}/${editingId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(medicineData)
                    }
                );


                if (!response.ok) {
                    throw new Error("Medicine update failed");
                }


                const result = await response.json();

                console.log("PUT JSON Response:", result);


                // Update local application data
                medicines = medicines.map(medicine => {

                    if (medicine.id === editingId) {

                        return {
                            id: editingId,
                            name: medicineData.title,
                            manufacturer: medicineData.brand,
                            category: medicineData.category,
                            price: medicineData.price,
                            quantity: medicineData.quantity,
                            expiryDate: medicineData.expiryDate
                        };

                    }

                    return medicine;

                });


                showToast("Medicine updated successfully!");


            } else {

                // POST REQUEST - ADD MEDICINE

                const response = await fetch(
                    `${API_URL}/add`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(medicineData)
                    }
                );


                if (!response.ok) {
                    throw new Error("Medicine addition failed");
                }


                const result = await response.json();

                console.log("POST JSON Response:", result);


                // Generate a unique local ID
                const newMedicine = {

                    id: nextId++,

                    name: medicineData.title,

                    manufacturer: medicineData.brand,

                    category: medicineData.category,

                    price: medicineData.price,

                    quantity: medicineData.quantity,

                    expiryDate: medicineData.expiryDate

                };


                medicines.unshift(newMedicine);


                showToast("New medicine added successfully!");

            }


            // Refresh interface
            resetForm();

            displayMedicines();

            updateStatistics();


        } catch (error) {

            console.error("POST/PUT API Error:", error);

            message.textContent =
                "Unable to complete the API operation. Please try again.";

            message.style.color = "#ce5353";

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                editingId !== null
                    ? "Update Medicine"
                    : "Save Medicine";

        }

    });


// =====================================================
// 8. EDIT MEDICINE
// =====================================================

function editMedicine(id) {

    const medicine = medicines.find(
        item => item.id === id
    );

    if (!medicine) return;


    editingId = id;


    document.getElementById("medicineId").value = id;

    document.getElementById("medicineName").value =
        medicine.name;

    document.getElementById("manufacturer").value =
        medicine.manufacturer;

    document.getElementById("category").value =
        medicine.category;

    document.getElementById("price").value =
        medicine.price;

    document.getElementById("quantity").value =
        medicine.quantity;

    document.getElementById("expiryDate").value =
        medicine.expiryDate;


    document.getElementById("formHeading").textContent =
        "Edit Medicine";

    document.getElementById("submitBtn").textContent =
        "Update Medicine";


    document.getElementById("addMedicine").scrollIntoView({
        behavior: "smooth"
    });

}


// =====================================================
// 9. DELETE MEDICINE
// =====================================================

async function deleteMedicine(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this medicine?"
    );

    if (!confirmed) return;


    try {

        // DELETE REQUEST
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error("Medicine deletion failed");
        }


        const result = await response.json();

        console.log("DELETE JSON Response:", result);


        // Remove medicine from local data
        medicines = medicines.filter(
            medicine => medicine.id !== id
        );


        displayMedicines();

        updateStatistics();


        showToast("Medicine deleted successfully!");


    } catch (error) {

        console.error("DELETE API Error:", error);

        showToast("Unable to delete medicine.");

    }

}


// =====================================================
// 10. SEARCH AND FILTER EVENT HANDLING
// =====================================================

document.getElementById("searchInput")
    .addEventListener("input", displayMedicines);


document.getElementById("categoryFilter")
    .addEventListener("change", displayMedicines);


document.getElementById("stockFilter")
    .addEventListener("change", displayMedicines);


// =====================================================
// 11. RESET FORM
// =====================================================

function resetForm() {

    document.getElementById("medicineForm").reset();

    editingId = null;

    document.getElementById("medicineId").value = "";

    document.getElementById("formHeading").textContent =
        "Add New Medicine";

    document.getElementById("submitBtn").textContent =
        "Save Medicine";

    document.getElementById("formMessage").textContent = "";

}


// =====================================================
// 12. OPEN ADD MEDICINE FORM
// =====================================================

function openForm() {

    resetForm();

    document.getElementById("addMedicine").scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("medicineName").focus();

}


// =====================================================
// 13. TOAST NOTIFICATIONS
// =====================================================

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// =====================================================
// 14. INITIALIZE APPLICATION
// =====================================================

// Load medicine records when page opens
loadMedicines();
