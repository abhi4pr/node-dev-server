const response = require("../../common/response");
const constant = require("../../common/constant");
const targetCompetitionModel = require("../../models/Sales/targetCompetitionModel");

/**
 * Api is to used for the Target Competition data add in the DB collection.
 */
exports.createTargetCompetition = async (req, res) => {
    try {
        const { competition_name, start_date, end_date, target_amount, created_by } = req.body;
        const addTargetCompetition = await targetCompetitionModel.create({
            competition_name: competition_name,
            start_date: start_date,
            end_date: end_date,
            target_amount: target_amount,
            created_by: created_by,
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Target Competition Details Created Successfully",
            addTargetCompetition
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Target Competition data get_ByID in the DB collection.
 */
exports.getTargetCompetitionDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const targetCompetitionDetails = await targetCompetitionModel.findOne({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        });
        if (!targetCompetitionDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Target Competition details retrive successfully!",
            targetCompetitionDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Target Competition data update in the DB collection.
 */
exports.updateTargetCompetition = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { competition_name, start_date, end_date, target_amount, status, updated_by } = req.body;

        const targetCompetitionUpdated = await targetCompetitionModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                competition_name: competition_name,
                start_date: start_date,
                end_date: end_date,
                target_amount: target_amount,
                status: status,
                updated_by: updated_by
            },
        }, {
            new: true
        });

        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Target Competition update successfully!",
            targetCompetitionUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Target Competition data get_list in the DB collection.
 */
exports.getTargetCompetitionList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of records with pagination applied
        const targetCompetitionList = await targetCompetitionModel.find({
            status: {
                $ne: constant.DELETED
            }
        }).skip(skip).limit(limit).sort(sort);

        // Get the total count of records in the collection
        const targetCompetitionCount = await targetCompetitionModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (targetCompetitionList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Payment mode list retrieved successfully!",
            targetCompetitionList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + targetCompetitionList.length : targetCompetitionList.length,
                total_records: targetCompetitionCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(targetCompetitionCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Target Competition data delete in the DB collection.
 */
exports.deleteTargetCompetition = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const targetCompetitionDeleted = await targetCompetitionModel.findOneAndUpdate({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        }, {
            $set: {
                // Update the status to DELETED
                status: constant.DELETED,
            }
        }, {
            new: true
        });
        // If no record is found or updated, return a response indicating no record found
        if (!targetCompetitionDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Target Competition deleted Succesfully! for id ${id}`,
            targetCompetitionDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};