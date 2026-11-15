import { Medicine } from "../models/Medicine.js";
import { initialMedicines } from "../data/seedData.js";

// Helper: Generate unique MED-XXXX ID
async function generateUniqueId() {
  let isUnique = false;
  let newId = "";
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    newId = `MED-${Math.floor(1000 + Math.random() * 9000)}`;
    const existing = await Medicine.findOne({ id: newId });
    if (!existing) {
      isUnique = true;
    }
  }
  return newId;
}

// @desc    Get all medicines with optional search, category, stockLevel, and sorting
// @route   GET /api/medicines
export async function getMedicines(req, res, next) {
  try {
    const { search, category, stockLevel, sortBy } = req.query;

    const query = {};

    // Filter by search string across name, manufacturer, and id
    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { manufacturer: regex }, { id: regex }];
    }

    // Filter by category
    if (category && category !== "All Categories") {
      query.category = category;
    }

    // Filter by stock level
    if (stockLevel && stockLevel !== "All Stock Levels") {
      if (stockLevel === "Available") {
        query.quantity = { $gt: 10 };
      } else if (stockLevel === "Low Stock") {
        query.quantity = { $gt: 0, $lte: 10 };
      } else if (stockLevel === "Out of Stock") {
        query.quantity = 0;
      }
    }

    // Build sort options
    let sortOptions = { createdAt: -1 };
    if (sortBy === "name-asc") sortOptions = { name: 1 };
    else if (sortBy === "name-desc") sortOptions = { name: -1 };
    else if (sortBy === "price-asc") sortOptions = { price: 1 };
    else if (sortBy === "price-desc") sortOptions = { price: -1 };
    else if (sortBy === "qty-asc") sortOptions = { quantity: 1 };
    else if (sortBy === "qty-desc") sortOptions = { quantity: -1 };
    else if (sortBy === "expiry-asc") sortOptions = { expiryDate: 1 };

    const medicines = await Medicine.find(query).sort(sortOptions);
    const totalCount = await Medicine.countDocuments();

    res.status(200).json({
      success: true,
      count: medicines.length,
      total: totalCount,
      data: medicines
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single medicine by item ID or _id
// @route   GET /api/medicines/:id
export async function getMedicineById(req, res, next) {
  try {
    const { id } = req.params;

    // Check by custom id (e.g. MED-1001) or MongoDB ObjectId
    const medicine =
      (await Medicine.findOne({ id: id.toUpperCase() })) ||
      (id.match(/^[0-9a-fA-F]{24}$/) ? await Medicine.findById(id) : null);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: `Medicine with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Create a new medicine record
// @route   POST /api/medicines
export async function createMedicine(req, res, next) {
  try {
    let { id, name, manufacturer, category, price, quantity, expiryDate } = req.body;

    if (!id || id.trim() === "") {
      id = await generateUniqueId();
    } else {
      id = id.trim().toUpperCase();
      const existing = await Medicine.findOne({ id });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Medicine item code "${id}" already exists. Please choose or auto-generate a unique ID.`
        });
      }
    }

    const newMedicine = await Medicine.create({
      id,
      name: name?.trim(),
      manufacturer: manufacturer?.trim(),
      category,
      price: Number(price),
      quantity: Number(quantity),
      expiryDate
    });

    res.status(201).json({
      success: true,
      message: `Medicine "${newMedicine.name}" added successfully.`,
      data: newMedicine
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Update an existing medicine record
// @route   PUT /api/medicines/:id
export async function updateMedicine(req, res, next) {
  try {
    const { id } = req.params;
    const { name, manufacturer, category, price, quantity, expiryDate } = req.body;

    // Locate medicine by id or _id
    let medicine =
      (await Medicine.findOne({ id: id.toUpperCase() })) ||
      (id.match(/^[0-9a-fA-F]{24}$/) ? await Medicine.findById(id) : null);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: `Medicine with ID "${id}" was not found.`
      });
    }

    if (name !== undefined) medicine.name = name.trim();
    if (manufacturer !== undefined) medicine.manufacturer = manufacturer.trim();
    if (category !== undefined) medicine.category = category;
    if (price !== undefined) medicine.price = Number(price);
    if (quantity !== undefined) medicine.quantity = Number(quantity);
    if (expiryDate !== undefined) medicine.expiryDate = expiryDate;

    const updatedMedicine = await medicine.save();

    res.status(200).json({
      success: true,
      message: `Medicine "${updatedMedicine.name}" (${updatedMedicine.id}) updated successfully.`,
      data: updatedMedicine
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete a medicine record
// @route   DELETE /api/medicines/:id
export async function deleteMedicine(req, res, next) {
  try {
    const { id } = req.params;

    const medicine =
      (await Medicine.findOne({ id: id.toUpperCase() })) ||
      (id.match(/^[0-9a-fA-F]{24}$/) ? await Medicine.findById(id) : null);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: `Medicine with ID "${id}" was not found.`
      });
    }

    const deletedInfo = { id: medicine.id, name: medicine.name };
    await medicine.deleteOne();

    res.status(200).json({
      success: true,
      message: `Medicine "${deletedInfo.name}" (${deletedInfo.id}) was permanently removed.`,
      data: deletedInfo
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get inventory aggregated stats
// @route   GET /api/stats
export async function getStats(req, res, next) {
  try {
    const medicines = await Medicine.find();

    const totalMedicines = medicines.length;
    const totalUnits = medicines.reduce((sum, item) => sum + Number(item.quantity), 0);
    const lowStockCount = medicines.filter(
      (item) => Number(item.quantity) > 0 && Number(item.quantity) <= 10
    ).length;
    const outOfStockCount = medicines.filter((item) => Number(item.quantity) === 0).length;
    const inventoryValue = medicines.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalMedicines,
        totalUnits,
        lowStockCount,
        outOfStockCount,
        inventoryValue: parseFloat(inventoryValue.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Seed initial medicines data if empty or on reset
// @route   POST /api/medicines/seed
export async function seedMedicines(req, res, next) {
  try {
    const force = req.query.force === "true";
    const existingCount = await Medicine.countDocuments();

    if (existingCount > 0 && !force) {
      return res.status(200).json({
        success: true,
        message: `Database already contains ${existingCount} records. Pass ?force=true to reseed.`,
        count: existingCount
      });
    }

    if (force) {
      await Medicine.deleteMany({});
    }

    const inserted = await Medicine.insertMany(initialMedicines);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} medicine records into database.`,
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    next(error);
  }
}
