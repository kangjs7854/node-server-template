import { Controller, Param, Post, BodyParam } from "routing-controllers";

const mongoose = require('mongoose')
// const expressJwt = require("express-jwt")
const mockSchema = mongoose.Schema()

//api列表的模式
const apiListSchema = mongoose.Schema({
    method: String,
    apiName: String,
    dataSource: [
        {
            id: String,
            key: String,
            value: String,
            unique: Boolean,
            type: {
                type: String
            },
            children: [{
                id: String,
                key: String,
                value: String,
                type: {
                    type: String
                },
                isInner: Boolean
            }],
            test: String
        }
    ],
})
//api列表的模型
const apiListModel = mongoose.model('apiList', apiListSchema)

interface IDataSource{
    key:string,
    value:string,
    type:string,
    children:IDataSource[]
}

@Controller()
export class MockController {
    @Post('/api/:id')
    async createApi(
        @Param("id") apiName: string,
        @BodyParam("dataSource") dataSource:IDataSource[],
        @BodyParam('newData') newDataSoure: any,
        @BodyParam('deleteId') deleteId: string,
        @BodyParam('deleteKey') deleteKey: string,
        @BodyParam("isInsert") isInsert: boolean
    ) {
        if (!apiName) return
        //只记住第一次传入时的数据模型,查找mock过的api的记录
        const apiListRecord = await apiListModel.find({ apiName }).exec()
        //表格数据
        if(!dataSource){
            dataSource = apiListRecord[0].dataSource
        }

        let {mockModel, query, payload} = this.handleDataSource(dataSource, apiName)
        if (deleteId) {
            await mockModel.findOneAndRemove({_id: deleteId}).exec()
        } else if (isInsert) {
            await mockModel.findOneAndUpdate(query, payload, {upsert: true, new: true}).exec()
            //保存该mock的api到api列表
            await apiListModel.findOneAndUpdate({apiName}, {
                dataSource,
                method: 'POST',
                apiName
            }, {upsert: true, new: true}).exec()
        } else if (newDataSoure) {
            query = {_id: newDataSoure._id}
            payload = deleteKey ? {$unset: {[deleteKey]: ''}} : newDataSoure
            await mockModel.findOneAndUpdate(query, payload, {upsert: true, new: true}).exec()
        }
        return await mockModel.find({}).exec()
    }

    /**
 * @description 处理表格数据
 * @param dataSource 表格数据
 * @param apiName
 * @returns {{query: 查询条件, payload:填充内容 mockModel: 数据模型}}
 */
 handleDataSource(dataSource, apiName) {
    let uniqueObj:any = {}//含有唯一标识的key的对象
    let query = {} //匹配条件,根据什么字段进行插入或者更新
    const Schema = {}//数据模式
    const payload = {} //数据内容
    const innerSchema = {}//嵌套对象时，该对象的数据模式
    const innerPayload = {}//嵌套对象时，该对象的数据内容
    //处理前端传过来的表格数据，转化成Schema和需要插入或更新的数据内容payload
    dataSource.forEach(el => {
        if (el.unique) {
            uniqueObj = el
            query = {[uniqueObj.key]: uniqueObj.value}
        }
        //处理引用类型的数据结构
        if (el.children && el.children.length) {
            const innerDataSource = el.children
            innerDataSource.forEach(innerEl => {
                innerSchema[innerEl.key] = innerEl.type
                innerPayload[innerEl.key] = innerEl.value
            })
            Schema[el.key] = el.type == 'Array' ? [innerSchema] : innerSchema
            payload[el.key] = el.type == 'Array' ? [innerPayload] : innerPayload
            return
        }
        Schema[el.key] = el.type
        payload[el.key] = el.value
    })
    //动态添加schema的字段和数据类型
    mockSchema.add(Schema)
    //再生成模型
    const mockModel = mongoose.model(apiName, mockSchema)
    return {
        mockModel,
        query,
        payload
    }
}


}