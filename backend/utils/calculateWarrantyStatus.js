// utils/calculateWarrantyStatus.js
function getWarrantyStatus(warrantyExpiryDate) {
  if (!warrantyExpiryDate) return { expired: null, daysLeft: null };

  const expiry = new Date(warrantyExpiryDate);
  const today = new Date();
  const diffMs = expiry - today;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    expired: daysLeft < 0,
    daysLeft: daysLeft < 0 ? 0 : daysLeft,
  };
}
