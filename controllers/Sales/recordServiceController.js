const mongoose = require("mongoose");
const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const { message } = require("../../common/message");
const salesRecordServiceModel = require("../../models/Sales/recordServiceModel.js");
const { uploadImage, deleteImage, moveImage } = require("../../common/uploadImage.js");
const response = require("../../common/response.js");
const constant = require("../../common/constant.js");
const deletedSalesBookingModel = require("../../models/Sales/deletedSalesBookingModel.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "excel_upload", maxCount: 10 }
]);

exports.createRecordServiceMaster = [
    upload, async (req, res) => {
        try {
            const addRecordServiceMaster = new salesRecordServiceModel({
                sale_booking_id: req.body.sale_booking_id,
                sales_service_master_id: req.body.sales_service_master_id,
                amount: req.body.amount,
                no_of_hours: req.body.no_of_hours,
                goal: req.body.goal,
                day: req.body.day,
                quantity: req.body.quantity,
                brand_name: req.body.brand_name,
                hashtag: req.body.hashtag,
                individual_amount: req.body.individual_amount,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                per_month_amount: req.body.per_month_amount,
                no_of_creators: req.body.no_of_creators,
                deliverables_info: req.body.deliverables_info,
                remarks: req.body.remarks,
                sale_executive_id: req.body.sale_executive_id,
                created_by: req.body.created_by,
            });
            // Define the image fields 
            const imageFields = {
                excel_upload: 'ExcelUploadFile',
            };
            for (const [field] of Object.entries(imageFields)) {            //itreates 
                if (req.files[field] && req.files[field][0]) {
                    addRecordServiceMaster[field] = await uploadImage(req.files[field][0], "SalesRecordServiceFiles");
                }
            }
            await addRecordServiceMaster.save();
            return response.returnTrue(200, req, res, "Sales record service created successfully", addRecordServiceMaster);

        } catch (err) {
            return response.returnFalse(500, req, res, err.message, {});
        }
    }];


exports.getRecordServiceMasterDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const recordServiceDetail = await salesRecordServiceModel.findOne({
            _id: id,
        });
        if (!recordServiceDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Sales record service details retrive successfully!",
            recordServiceDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


/**
 * Api is to used for the record_service_master data update in the DB collection.
 */
exports.updateRecordServiceMaster = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = {
                sale_booking_id: req.body.sale_booking_id,
                sales_service_master_id: req.body.sales_service_master_id,
                amount: req.body.amount,
                no_of_hours: req.body.no_of_hours,
                goal: req.body.goal,
                day: req.body.day,
                quantity: req.body.quantity,
                brand_name: req.body.brand_name,
                hashtag: req.body.hashtag,
                individual_amount: req.body.individual_amount,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                per_month_amount: req.body.per_month_amount,
                no_of_creators: req.body.no_of_creators,
                deliverables_info: req.body.deliverables_info,
                remarks: req.body.remarks,
                updated_by: req.body.updated_by,
            };

            // Fetch the old document and update it
            const updatedRecordService = await salesRecordServiceModel.findByIdAndUpdate({ _id: id }, updateData, { new: true });

            if (!updatedRecordService) {
                return response.returnFalse(404, req, res, `Record service data not found`, {});
            }

            // Define the image fields 
            const imageFields = {
                excel_upload: 'ExcelUploadFile',
            };

            // Remove old images not present in new data and upload new images
            for (const [fieldName] of Object.entries(imageFields)) {
                if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

                    // Delete old image if present
                    if (updatedRecordService[fieldName]) {
                        await deleteImage(`SalesRecordServiceFiles/${updatedRecordService[fieldName]}`);
                    }
                    // Upload new image
                    updatedRecordService[fieldName] = await uploadImage(req.files[fieldName][0], "SalesRecordServiceFiles");
                }
            }
            // Save the updated document with the new image URLs
            await updatedRecordService.save();

            return response.returnTrue(200, req, res, "Record service data updated successfully!", updatedRecordService);
        } catch (error) {
            return response.returnFalse(500, req, res, `${error.message}`, {});
        }
    }];

exports.getRecordServiceMasterList = async (req, res) => {
    try {
        const page = (req.query?.page && parseInt(req.query.page)) || null;
        const limit = (req.query?.limit && parseInt(req.query.limit)) || null;
        const skip = (page && limit) ? (page - 1) * limit : 0;

        let addFieldsObj = {
            $addFields: {
                excel_upload_url: {
                    $cond: {
                        if: { $ne: ["$excel_upload", ""] },
                        then: {
                            $concat: [
                                constant.GCP_SALES_RECORD_SERVICE_FOLDER_URL,
                                "/",
                                "$excel_upload",
                            ],
                        },
                        else: "$excel_upload",
                    },
                },
            },
        };

        const pipeline = [addFieldsObj];

        if (page && limit) {
            pipeline.push(
                { $skip: skip },
                { $limit: limit }
            );
        }

        recordServiceList = await salesRecordServiceModel.aggregate(pipeline);
        const recordServiceCount = await salesRecordServiceModel.countDocuments(addFieldsObj);

        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Record service list retreive successfully!",
            recordServiceList,
            {
                start_record: skip + 1,
                end_record: skip + recordServiceList.length,
                total_records: recordServiceCount,
                current_page: page || 1,
                total_page: (page && limit) ? Math.ceil(recordServiceCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


/**
 * Api is to used for the reocrd_service_master data delete in the DB collection.
 */
exports.deleteRecordServiceMaster = async (req, res) => {
    try {
        const { id } = req.params;
        const recordServiceDeleted = await salesRecordServiceModel.findOneAndUpdate({ _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!recordServiceDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Record service deleted successfully id ${id}`,
            recordServiceDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.getRecordServiceDataDeleted = async (req, res) => {
    try {
        const recordServiceDeleted = await salesRecordServiceModel.find({ status: constant.DELETED });

        if (!recordServiceDeleted) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }
        return response.returnTrue(200, req, res, 'Record Service data retrieved successfully!', recordServiceDeleted);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};