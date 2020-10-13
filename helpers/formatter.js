module.exports.formatPhone = (phone) => {
  let formattedPhone = phone.replace(/^\+1/gi, '').replace(/\D/g, "").replace(/\s+/gi, "").trim();

  return formattedPhone;
}