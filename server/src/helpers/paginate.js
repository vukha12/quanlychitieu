const paginate = async (Model, filter, { page = 1, limit = 20, sort = { date: -1 }, select = '' }) => {
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
        Model.find(filter).sort(sort).skip(skip).limit(limit).select(select).lean(),
        Model.countDocuments(filter)
    ])

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total
        }
    }
}

export { paginate }