export function weekCount(date = new Date()){
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = Math.floor(
        (date.getTime() - startOfYear.getTime()) / 86400000
    );

    return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
}