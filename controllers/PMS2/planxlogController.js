const response = require("../../common/response.js");
const addPlanXLogModel = require("../../models/PMS2/planxlogModel.js");
const mongoose = require("mongoose");

exports.addPlanXLogs = async (req, res) => {
    try {
        const planData = new addPlanXLogModel({
            plan_name: req.body.plan_name,
            cost_price: req.body.cost_price,
            selling_price: req.body.selling_price,
            no_of_pages: req.body.no_of_pages,
            post_count: req.body.post_count,
            story_count: req.body.story_count,
            description: req.body.description,
            sales_executive_id: req.body.sales_executive_id,
            account_id: req.body.account_id,
            brand_id: req.body.brand_id,
            brief: req.body.brief,
            plan_status: req.body.plan_status,
            plan_saved: req.body.plan_saved,
            created_by: req.body.created_by
        });

        const planxlogdata = await planData.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Add Plan X Logs Data Created Successfully",
            planxlogdata
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getPlanXLogs = async (req, res) => {
    try {
        const planxData = await addPlanXLogModel
            .aggregate([
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "sales_executive_id",
                        foreignField: "user_id",
                        as: "userData",
                    },
                },
                {
                    $unwind: {
                        path: "$userData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "created_by",
                        foreignField: "user_id",
                        as: "userCreatedData",
                    },
                },
                {
                    $unwind: {
                        path: "$userCreatedData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "accountmastermodels",
                        localField: "account_id",
                        foreignField: "_id",
                        as: "accountData",
                    },
                },
                {
                    $unwind: {
                        path: "$accountData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "accountbrandmodels",
                        localField: "brand_id",
                        foreignField: "_id",
                        as: "brandData",
                    },
                },
                {
                    $unwind: {
                        path: "$brandData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        plan_name: 1,
                        cost_price: 1,
                        selling_price: 1,
                        no_of_pages: 1,
                        post_count: 1,
                        story_count: 1,
                        description: 1,
                        sales_executive_id: 1,
                        sales_executive_name: "$userData.user_name",
                        account_id: 1,
                        account_name: "$accountData.account_name",
                        brand_id: 1,
                        brand_name: "$brandData.brand_name",
                        brief: 1,
                        plan_status: 1,
                        plan_saved: 1,
                        created_by: 1,
                        created_by_name: "$userCreatedData.user_name"
                    },
                },
            ]);
        if (!planxData) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }
        res.status(200).send(planxData)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSinglePlanXLog = async (req, res) => {
    try {
        const planxSingleData = await addPlanXLogModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "sales_executive_id",
                        foreignField: "user_id",
                        as: "userData",
                    },
                },
                {
                    $unwind: {
                        path: "$userData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "created_by",
                        foreignField: "user_id",
                        as: "userCreatedData",
                    },
                },
                {
                    $unwind: {
                        path: "$userCreatedData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "accountmastermodels",
                        localField: "account_id",
                        foreignField: "_id",
                        as: "accountData",
                    },
                },
                {
                    $unwind: {
                        path: "$accountData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "accountbrandmodels",
                        localField: "accountData.brand_id",
                        foreignField: "_id",
                        as: "brandData",
                    },
                },
                {
                    $unwind: {
                        path: "$brandData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        plan_name: 1,
                        cost_price: 1,
                        selling_price: 1,
                        no_of_pages: 1,
                        post_count: 1,
                        story_count: 1,
                        description: 1,
                        sales_executive_id: 1,
                        sales_executive_name: "$userData.user_name",
                        account_id: 1,
                        account_name: "$accountData.account_name",
                        brand_id: 1,
                        brand_name: "$brandData.brand_name",
                        brief: 1,
                        plan_status: 1,
                        plan_saved: 1,
                        created_by: 1,
                        created_by_name: "$userCreatedData.user_name"
                    },
                },
            ]);
        if (!planxSingleData) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }
        res.status(200).send(planxSingleData)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.editPlanXLog = async (req, res) => {
    try {
        const editPlanData = await addPlanXLogModel.findOneAndUpdate(
            { _id: req.body.id },
            {
                plan_name: req.body.plan_name,
                cost_price: req.body.cost_price,
                selling_price: req.body.selling_price,
                no_of_pages: req.body.no_of_pages,
                post_count: req.body.post_count,
                story_count: req.body.story_count,
                description: req.body.description,
                sales_executive_id: req.body.sales_executive_id,
                account_id: req.body.account_id,
                brand_id: req.body.brand_id,
                brief: req.body.brief,
                plan_status: req.body.plan_status,
                plan_saved: req.body.plan_saved,
                created_by: req.body.created_by,
                last_updated_by: req.body.last_updated_by
            },
            { new: true }
        );
        if (!editPlanData) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found With This Plan X Log Id",
                {}
            );
        }
        return response.returnTrue(200, req, res, " Plan X Log Data Updation Successfully", editPlanData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deletePlanXLog = async (req, res) => {
    addPlanXLogModel.deleteOne({ _id: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Plan X Log Data Deleted Successfully' })
        } else {
            return res.status(404).json({ success: false, message: 'Plan X Log Data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};