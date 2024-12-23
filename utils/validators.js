// Validates if the provided price is a valid positive number.
export const isValidPrice = (price) => {
  return !isNaN(price) && price > 0; // Validates that the price is a positive number
};

// Validates if a given string is a valid and non-empty title.
export const isValidTitle = (title) => {
  return typeof title === "string" && title.trim().length > 0; // Checks if the title is a non-empty string
};

// Validates if the given category is one of the allowed categories.
export const isValidCategory = (category) => {
  const allowedCategories = ["men", "women", "kids", "accessories", "footwear"];
  return allowedCategories.includes(category); // Checks if the category is one of the allowed values
};

// Validates if the given description is a valid non-empty string.
export const isValidDescription = (description) => {
  return typeof description === "string" && description.trim().length > 0; // Checks if the description is a non-empty string
};
