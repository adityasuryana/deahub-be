const { Engineering } = require('../models');

const DEFAULT_STAGES = {
    engineering: 'BELUM MULAI',
    procurement: 'BELUM MULAI',
    cutting: 'BELUM MULAI',
    bending: 'BELUM MULAI',
    welding: 'BELUM MULAI',
    grinding: 'BELUM MULAI',
    assy: 'BELUM MULAI',
    galvaniz: 'BELUM MULAI',
    qcSortir: 'BELUM MULAI',
    packing: 'BELUM MULAI',
    delivery: 'BELUM MULAI'
};

const getAllProjects = async (req, res) => {
    try {
        const projects = await Engineering.findAll({
            order: [['id', 'DESC']]
        });

        // Ensure stages is parsed if stored as string
        const formatted = projects.map(p => {
            const data = p.toJSON();
            if (typeof data.stages === 'string') {
                try {
                    data.stages = JSON.parse(data.stages);
                } catch {
                    data.stages = { ...DEFAULT_STAGES };
                }
            } else if (!data.stages) {
                data.stages = { ...DEFAULT_STAGES };
            }
            return data;
        });

        res.status(200).json(formatted);
    } catch (error) {
        console.error('Error fetching engineering projects:', error);
        res.status(500).json({ error: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Engineering.findByPk(id);
        if (!project) {
            return res.status(404).json({ message: 'Proyek engineering tidak ditemukan' });
        }

        const data = project.toJSON();
        if (typeof data.stages === 'string') {
            try {
                data.stages = JSON.parse(data.stages);
            } catch {
                data.stages = { ...DEFAULT_STAGES };
            }
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching engineering project by id:', error);
        res.status(500).json({ error: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const {
            startProject,
            customer,
            woNumber,
            projectName,
            item,
            qty,
            uom,
            stages,
            targetFinish,
            finishDate,
            pic,
            priority,
            remarks
        } = req.body;

        if (!projectName || !woNumber) {
            return res.status(400).json({ error: 'Nama Proyek dan Nomor WO wajib diisi' });
        }

        let parsedStages = stages;
        if (typeof stages === 'string') {
            try {
                parsedStages = JSON.parse(stages);
            } catch {
                parsedStages = { ...DEFAULT_STAGES };
            }
        } else if (!stages || typeof stages !== 'object') {
            parsedStages = { ...DEFAULT_STAGES };
        }

        const newProject = await Engineering.create({
            startProject: startProject || new Date().toISOString().split('T')[0],
            customer: customer || '',
            woNumber,
            projectName,
            item: item || '',
            qty: qty !== undefined && qty !== null ? String(qty) : '1',
            uom: uom || 'UNIT',
            stages: parsedStages,
            targetFinish: targetFinish || '',
            finishDate: finishDate || '',
            pic: pic || '',
            priority: priority || '2 (MEDIUM / NORMAL)',
            remarks: remarks || ''
        });

        const result = newProject.toJSON();
        if (typeof result.stages === 'string') {
            try {
                result.stages = JSON.parse(result.stages);
            } catch {
                result.stages = { ...DEFAULT_STAGES };
            }
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating engineering project:', error);
        res.status(500).json({ error: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Engineering.findByPk(id);
        if (!project) {
            return res.status(404).json({ message: 'Proyek engineering tidak ditemukan' });
        }

        const {
            startProject,
            customer,
            woNumber,
            projectName,
            item,
            qty,
            uom,
            stages,
            targetFinish,
            finishDate,
            pic,
            priority,
            remarks
        } = req.body;

        if (startProject !== undefined) project.startProject = startProject;
        if (customer !== undefined) project.customer = customer;
        if (woNumber !== undefined) project.woNumber = woNumber;
        if (projectName !== undefined) project.projectName = projectName;
        if (item !== undefined) project.item = item;
        if (qty !== undefined) project.qty = String(qty);
        if (uom !== undefined) project.uom = uom;
        if (targetFinish !== undefined) project.targetFinish = targetFinish;
        if (finishDate !== undefined) project.finishDate = finishDate;
        if (pic !== undefined) project.pic = pic;
        if (priority !== undefined) project.priority = priority;
        if (remarks !== undefined) project.remarks = remarks;

        if (stages !== undefined) {
            let parsedStages = stages;
            if (typeof stages === 'string') {
                try {
                    parsedStages = JSON.parse(stages);
                } catch {
                    parsedStages = { ...DEFAULT_STAGES };
                }
            }
            project.stages = parsedStages;
        }

        await project.save();

        const result = project.toJSON();
        if (typeof result.stages === 'string') {
            try {
                result.stages = JSON.parse(result.stages);
            } catch {
                result.stages = { ...DEFAULT_STAGES };
            }
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating engineering project:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Engineering.findByPk(id);
        if (!project) {
            return res.status(404).json({ message: 'Proyek engineering tidak ditemukan' });
        }

        await project.destroy();
        res.status(200).json({ message: 'Proyek engineering berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting engineering project:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
