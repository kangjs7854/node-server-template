/*
 * @Date: 2020-08-11 13:46:44
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-11 17:08:31
 * @FilePath: \server\controllers\index.js
 */

module.exports = {
    /**
     * @description
     * 1.没传id，返回全部内容
     * 2.传id，无文档，创建一个
     * 2.传id，有文档，更新
     * @param {Object} Model 需要进行数据操作的模型
     * @param {Object} query 匹配条件，有就更新，无就新增
     * @param {Object} payload 需要插入或者更新的内容
     * @param {Array} populate 一个参数的时候表示返回全部，两个参数的时候返回对应的联表的属性
     * @return {Object} 返回处理完的数据
     */
    insertOrUpDate(Model, query = {}, payload = {}, populate = []) {
        return new Promise((resolve, reject) => {
            const temp = JSON.stringify(query) != "{}"
                ? Model.findOneAndUpdate(
                    query,
                    payload,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                )
                : Model.find().populate(populate[0], populate[1])
            temp.populate(populate[0], populate[1]).exec((err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }
}