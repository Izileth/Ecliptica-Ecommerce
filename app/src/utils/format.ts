export const formatPrice = (price?: number) => {
    return (price ?? 0).toFixed(2);
}