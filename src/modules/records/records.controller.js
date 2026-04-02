const recordsService = require('./records.service');
const { success } = require('../../utils/apiResponse');

const createRecord = async (req, res, next) => {
    try {
        const record = await recordsService.createRecord(req.body, req.user.userId);
        return success(res, 201, 'Record created successfully', record);
    } catch (err) { next(err); }
};

const getRecords = async (req, res, next) => {
    try {
        const result = await recordsService.getRecords(req.query);
        return success(res, 200, 'Records fetched successfully', result);
    } catch (err) { next(err); }
};

const getRecordById = async (req, res, next) => {
    try {
        const record = await recordsService.getRecordById(req.params.id);
        return success(res, 200, 'Record fetched successfully', record);
    } catch (err) { next(err); }
};

const updateRecord = async (req, res, next) => {
    try {
        const record = await recordsService.updateRecord(req.params.id, req.body);
        return success(res, 200, 'Record updated successfully', record);
    } catch (err) { next(err); }
};

const deleteRecord = async (req, res, next) => {
    try {
        await recordsService.deleteRecord(req.params.id);
        return success(res, 200, 'Record deleted (soft) successfully', null);
    } catch (err) { next(err); }
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };