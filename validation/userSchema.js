import joi from '@hapi/joi'

const schema= {

        user: joi.object({

        Name: joi.string().max(100).required(),
        Post: joi.string().max(100).required(),
        Description: joi.string().max(500).required(),
        Active: joi.number().integer().min(1).required(),

    })
}

export default schema