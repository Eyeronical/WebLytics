async function enhanceDescription(description, brandName) {
  try {
    if (!description || description === 'No description available') {
      return `Discover ${brandName} - innovative solutions and exceptional service for modern users.`;
    }
    return description;
  } catch (error) {
    return description;
  }
}

module.exports = { enhanceDescription };
