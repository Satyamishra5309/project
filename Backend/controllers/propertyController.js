import Property from "../models/Property.js";

export const createProperty = async (req, res) => {
  try {
    const { title, location, images, description, pricing } = req.body;

    const property = await Property.create({
      title,
      location,
      images: images || [],
      description,
      pricing,
      listed_By: req.user._id,
    });

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (minPrice || maxPrice) {
      query.pricing = {};

      if (minPrice) {
        query.pricing.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.pricing.$lte = Number(maxPrice);
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(query)
      .populate("listed_By", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalProperties = await Property.countDocuments(query);

    res.status(200).json({
      properties,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProperties / Number(limit)),
      totalProperties,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "listed_By",
      "name email"
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json({
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (property.listed_By.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own property",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (property.listed_By.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own property",
      });
    }

    await property.deleteOne();

    res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};