function validateFields(requiredFields, data) {
  const missingFields = requiredFields.filter((field) => !data[field]);
  return missingFields;
}
module.exports = validateFields;
