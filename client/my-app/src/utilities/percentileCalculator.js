// פונקציה לחישוב אחוזון
export function calculatePercentile(value, mean, stdDev) {
    if (stdDev === 0) {
        throw new Error("Standard deviation cannot be zero.");
    }
    const zScore = (value - mean) / stdDev;

    // פונקציית התפלגות נורמלית מצטברת (CDF)
    const percentile = 0.5 * (1 + erf(zScore / Math.sqrt(2)));
    return (percentile * 100).toFixed(2); // אחוזון בפורמט של שתי ספרות
}

// פונקציית עזר לחישוב ERF (שגיאה מצטברת)
function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
}