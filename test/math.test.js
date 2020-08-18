/*
 * @Date: 2020-08-18 16:53:57
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-18 16:58:30
 * @FilePath: \server\test\math.test.js
 */
const add = require("./math")
test("add is right",()=>{
    expect(add(1,2)).toBe(4)
})