let mongoose = require('mongoose')
let Schema = mongoose.Schema;

module.exports = function (conn) {

    const jobSchema = new Schema({


        jobId: {
            type: String,
            trim: true
        },

        name: {
            type: String,
            trim: true
        },

        salary: {
            type: String,
            trim: true
        },

        age: {
            type: String,
            trim: true
        },

        education: {
            type: String,
            trim: true
        },


        slug: {
            type: String,
            trim: true
        },
        url: {
            type: String,
            trim: true
        },

        companyName: {
            type: String,
            trim: true
        },

        source: {
            type: String,
            trim: true
        },

        urlCompanyLogo: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        jobFunction: {
            type: String,
            trim: true
        },

        jobIndustry: {
            type: String,
            trim: true
        },

        jobLevel: {
            type: String,
            trim: true
        },

        jobType: {
            type: String,
            trim: true
        },

        jobDescription: {
            type: String,
            trim: true
        },
        publishDate: {
            type: String,
            trim: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        createdAt: {
            type: Date,
            default: Date.now
        }

    })

    // note : when function change to arrow function, field can't set properly
    jobSchema.pre('save', function (next) {
        const self = this
        self.updatedAt = new Date()
        next()
    })


    const Job = conn.model('Job', jobSchema)
    return Job;
}
