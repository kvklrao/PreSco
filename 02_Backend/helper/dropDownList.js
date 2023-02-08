const {sequelize} = require('../sequelize')


const dropdownList = async (req, res) => {


    const [fungi_list] = await sequelize.query(`select id, ItemName  as itemName from fungi_list;`, {});

    const [gram_negative_bac_list] = await sequelize.query(`select id, ItemName as itemName from gram_negative_bac_list;`, {});

    const [gram_positive_bac_list] = await sequelize.query(`select id, ItemName as itemName from gram_positive_bac_list;`, {});

    const [antibiotics_list] = await sequelize.query(`select id, ItemName as itemName from antibiotics_list;`, {});

    var results = {
        fungi_list, gram_negative_bac_list, gram_positive_bac_list, antibiotics_list
    };

    res.json( { results });

};

module.exports = dropdownList;