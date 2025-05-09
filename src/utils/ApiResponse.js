class apiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { apiResponse }
//humne yaha constructor m statuscode,data,message ko pass kra ha kyuki api response ka mtlb ha ki koi error nhi toh mtlb humko api ka status code bhi milega data bhi milega or eek message milega jo humara usually success hoga