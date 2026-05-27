const buildDateFilter = ({ fromDate, toDate, month, year }) => {

    if (fromDate && toDate) {
        return {
            date: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate).setHours(23, 59, 59, 999)
            }
        }
    }

    if (month && year) {
        return {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1)
        }
    }

    if (year) {
        return {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1)
        }
    }

    return null
}

export { buildDateFilter }