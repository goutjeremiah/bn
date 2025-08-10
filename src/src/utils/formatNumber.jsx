export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
};

export const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};