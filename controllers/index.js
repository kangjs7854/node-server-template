/*
 * @Date: 2020-08-11 13:46:44
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-18 11:17:39
 * @FilePath: \server\controllers\index.js
 */

module.exports = class Controller {
    constructor(Model){
        this.Model = Model
    }

    static isNull(obj) {
        for (let i in obj) {
            return obj[i] == 'undefined' || obj[i] == 'null' || !obj[i]
        }
    }

    async find(query = {}, populate = []) {
        //匹配条件为空，返回全部,否则返回匹配到的数据
        return Controller.isNull(query)
            ? await this.Model.find().populate(populate[0], populate[1]).exec()
            : await this.Model.findOne(query).populate(populate[0], populate[1]).exec()
    }

    async insert(query = {}, payload = {}, populate = []) {
        !Controller.isNull(query) && await this.Model.findOneAndUpdate(query, payload, { upsert: true, new: true, setDefaultsOnInsert: true }).exec()
        return await this.Model.find().populate(populate[0], populate[1]).exec()
    }

    async remove(id, isRemoveAll = false, populate = []) {
        if (isRemoveAll) {
            const data = await this.Model.find().exec()
            for (let i = 0; i < data.length; i++) {
                if (data[i]._id != id) {
                    await this.Model.findByIdAndRemove(data[i]._id)
                }
            }
        } else {
            await this.Model.findByIdAndRemove(id).exec()
        }
        return await this.Model.find().populate(populate[0], populate[1]).exec()
    }

    async update(query, payload) {      
        await this.Model.findOneAndUpdate(query, payload).exec()
        return await this.Model.find().exec()
    }


}
