'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Engineerings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startProject: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customer: {
        type: Sequelize.STRING,
        allowNull: true
      },
      woNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      projectName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      item: {
        type: Sequelize.STRING,
        allowNull: true
      },
      qty: {
        type: Sequelize.STRING,
        allowNull: true
      },
      uom: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'UNIT'
      },
      stages: {
        type: Sequelize.JSON,
        allowNull: true
      },
      targetFinish: {
        type: Sequelize.STRING,
        allowNull: true
      },
      finishDate: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pic: {
        type: Sequelize.STRING,
        allowNull: true
      },
      priority: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '2 (MEDIUM / NORMAL)'
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Seed initial demo fabrication engineering projects
    const now = new Date();
    await queryInterface.bulkInsert('Engineerings', [
      {
        startProject: '2026-08-10',
        customer: 'PT. ZTE / TELKOMSEL',
        woNumber: 'WO-26-0104',
        projectName: 'FABRIKASI TOWER COMBAT 42M (BATCH 1)',
        item: 'TOWER SEGMENT & PLATFORM',
        qty: '12',
        uom: 'UNIT',
        stages: JSON.stringify({
          engineering: 'SELESAI',
          procurement: 'SELESAI',
          cutting: 'SELESAI',
          bending: 'SELESAI',
          welding: 'PROSES',
          grinding: 'BELUM MULAI',
          assy: 'BELUM MULAI',
          galvaniz: 'BELUM MULAI',
          qcSortir: 'BELUM MULAI',
          packing: 'BELUM MULAI',
          delivery: 'BELUM MULAI'
        }),
        targetFinish: '2026-09-25',
        finishDate: '',
        pic: 'Aditya Suryana',
        priority: '3 (HIGH)',
        remarks: 'Material SS400 lengkap, shop drawing sudah disetujui Telkomsel.',
        createdAt: now,
        updatedAt: now
      },
      {
        startProject: '2026-08-01',
        customer: 'PT. INDOSAT OOREDOO',
        woNumber: 'WO-26-0089',
        projectName: 'STRUKTUR FABRIKASI MOUNTING ANTENA',
        item: 'BRACKET & FRAME',
        qty: '50',
        uom: 'SET',
        stages: JSON.stringify({
          engineering: 'SELESAI',
          procurement: 'SELESAI',
          cutting: 'SELESAI',
          bending: 'SELESAI',
          welding: 'SELESAI',
          grinding: 'SELESAI',
          assy: 'SELESAI',
          galvaniz: 'PROSES',
          qcSortir: 'BELUM MULAI',
          packing: 'BELUM MULAI',
          delivery: 'BELUM MULAI'
        }),
        targetFinish: '2026-09-12',
        finishDate: '',
        pic: 'Hendra Tan',
        priority: '2 (MEDIUM / NORMAL)',
        remarks: 'Proses galvanizing berjalan di pabrik partner.',
        createdAt: now,
        updatedAt: now
      },
      {
        startProject: '2026-09-01',
        customer: 'PT. XL AXIATA TBK',
        woNumber: 'WO-26-0112',
        projectName: 'REMOVABLE TOWER COMBAT 30M LIGHT',
        item: 'LATTICE & BASE FRAME',
        qty: '5',
        uom: 'UNIT',
        stages: JSON.stringify({
          engineering: 'SELESAI',
          procurement: 'PROSES',
          cutting: 'BELUM MULAI',
          bending: 'BELUM MULAI',
          welding: 'BELUM MULAI',
          grinding: 'BELUM MULAI',
          assy: 'BELUM MULAI',
          galvaniz: 'BELUM MULAI',
          qcSortir: 'BELUM MULAI',
          packing: 'BELUM MULAI',
          delivery: 'BELUM MULAI'
        }),
        targetFinish: '2026-10-15',
        finishDate: '',
        pic: 'Rian Febrian',
        priority: '4 (URGENT)',
        remarks: 'Menunggu pengiriman plat tebal 12mm dari supplier utama.',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Engineerings');
  }
};
