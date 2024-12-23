import mongoose from "mongoose";
import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    const { address, city, pinCode, phone, note } = req.body;
    const { _id: userId } = req.user;

    // Validate required fields
    if (!address || !city || !pinCode || !phone || !note) {
      return res.status(400).json({
        success: false,
        message: "Please provide address, city, pinCode, phone, and note.",
      });
    }

    // Create new address
    const newAddress = new Address({
      address,
      city,
      pinCode,
      phone,
      note,
      userId,
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to add address.",
    });
  }
};

export const fetchAddress = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const address = await Address.find({ userId });
    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to fetch addresses.",
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { _id: userId } = req.user;
    const { address, city, pinCode, phone, note } = req.body;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    // Validate required fields
    if (!address || !city || !pinCode || !phone || !note) {
      return res.status(400).json({
        success: false,
        message: "Please provide address, city, pinCode, phone, and note.",
      });
    }

    // Find the address by ID and update it
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { address, city, pinCode, phone, note },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to update address.",
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { _id: userId } = req.user;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
      data: deletedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete address.",
    });
  }
};
