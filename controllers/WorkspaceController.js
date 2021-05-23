const { Op } = require("sequelize");
const models = require("../models");
const uniqueNameGenerator = require("../utils/util")
const count = process.env.SUGGETION_COUNT

class WorkspaceController {
    async createWorkspace(req, res) {
        try {
            const data = await models.workspace.create({
                name: req.body.name,
                subDomain: req.body.subDomain,
                Created_by: req.user.id
            })
            if (data)
                return res.send({
                    success: true,
                    data
                })
        }
        catch (err) {
            if (err.name == "SequelizeValidationError" || err.name == "SequelizeUniqueConstraintError") {
                return res.status(400).send({ message: err.message });
            }
            else
                return res.status(500).send({ message: err.message });

        }
    }

    async updateWorkspace(req, res) {
        const { id } = req.params
        const { name, subDomain } = req.body
        try {
            const data = await models.workspace.update({
                name,
                subDomain,
            }, {
                where: {
                    id
                },
                returning: true
            })
            if (data)
                return res.send({
                    success: true,
                    data
                })
        }
        catch (err) {
            if (err.name == "SequelizeValidationError") {
                return res.status(400).send({ message: err });
            }
            else
                return res.status(500).send({ message: err });

        }
    }

    async getWorkspace(req, res) {
        try {
            const data = await models.workspace.findAll({
                where: {
                    Created_by: req.user.id
                },
                include: [{
                    required: true,
                    model: models.User,
                    where: {
                        id: req.user.id
                    },
                    attributes: ['id', 'fullName', 'email']
                }]
            })
            if (data) return res.send(data)
            return res.send({ message: "workspace not found" })
        }
        catch (err) {
            return res.status(500).send({ message: err });
        }
    }

    async deleteWorkspace(req, res) {
        try {
            const { id } = req.params
            const data = await models.workspace.destroy({
                where: {
                    id,
                    Created_by: req.user.id
                }
            })
            if (data) return res.send({ success: true, message: "deleted" })
            return res.send({ success: false, message: "workspace not found" })
        }
        catch (err) {
            return res.status(500).send({ message: err });
        }

    }

    async suggestedSubDomain(req, res) {
        const { subDomain } = req.body
        try {
            let allWorkspaceData = await models.workspace.findAll({
                raw: true,
                where: {
                    subDomain: {
                        [Op.like]: `${subDomain}%`
                    }
                }
            });
            let data = await uniqueNameGenerator(subDomain, allWorkspaceData, 5)
            return res.status(200).send({ data, succes: true })
        }
        catch (err) {
            return res.status(500).send({ success: false, message: "something went wrong" })
        }



    }
}

module.exports = new WorkspaceController