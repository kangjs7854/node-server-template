/*
 * @Date: 2020-08-11 13:46:44
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-12 16:02:04
 * @FilePath: \server\controllers\index.js
 */

module.exports = {
    find,
    insert,
    remove,
    update
}
async function find(Model, query = {}, populate = []) {
    //匹配条件为空，返回全部,否则返回匹配到的数据
    return isNull(query)
        ? await Model.find().populate(populate[0], populate[1]).exec()
        : await Model.findOne(query).populate(populate[0], populate[1]).exec()
}

async function insert(Model, query = {}, payload = {}, populate = []) {
    !isNull(query) && await Model.findOneAndUpdate(query, payload, { upsert: true, new: true, setDefaultsOnInsert: true }).exec()
    return await Model.find().populate(populate[0], populate[1]).exec()
}

async function remove(Model, id, isRemoveAll = false, populate = []) {
    if (isRemoveAll) {
        const data = await Model.find().exec()
        for (let i = 0; i < data.length; i++) {
            if (data[i]._id != id) {
                await Model.findByIdAndRemove(data[i]._id)
            }
        }
    } else {
        await Model.findByIdAndRemove(id).exec()
    }
    return await Model.find().populate(populate[0], populate[1]).exec()
}

async function update(Model,query,payload){
    await Model.findOneAndUpdate(query,payload).exec()
    return await Model.find().exec()
}

function isNull(obj) {
    for (let i in obj) {
        return obj[i] == 'undefined' || obj[i] == 'null' || !obj[i]
    }
}