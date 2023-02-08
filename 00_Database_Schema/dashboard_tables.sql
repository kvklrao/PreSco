create table fungi_list(

    id int NOT NULL AUTO_INCREMENT,
    ItemName varchar(255) NOT NULL,
    PRIMARY KEY(id)
);

create table gram_negative_bac_list(

    id int NOT NULL AUTO_INCREMENT,
    ItemName varchar(255) NOT NULL,
    PRIMARY KEY(id)
);

create table gram_positive_bac_list(

    id int NOT NULL AUTO_INCREMENT,
    ItemName varchar(255) NOT NULL,
    PRIMARY KEY(id)
);

create table antibiotics_list(

    id int NOT NULL AUTO_INCREMENT,
    ItemName varchar(255) NOT NULL,
    PRIMARY KEY(id)
);

//
INSERT INTO fungi_list(ItemName)
VALUES
    ("Candida auris"),
    ("Candida non albicans spp"),
    ("Candida spp"),
    ("Candida Tropicalis"),
    ("Candida Pelliculosa");

//
INSERT INTO gram_negative_bac_list(ItemName)
VALUES
    ("Acinetobacter baumanii"),
    ("Acinetobacter haemolyticus"),
    ("urkholderia cepacia"),
    ("E Coli"),
    ("Enterobacter spp"),
    ("Klebsiella_spp_10_5_CFU_ml"),
    ("Klebsiella pneumoniae"),
    ("Non fermenting Gram negative bacilli"),
    ("Pseudomonas aeruginosa"),
    ("Skin flora"),
    ("Sphingomonas paucimobilis"),
    ("Candida Pelliculosa"),
    ("Others");

// 
INSERT INTO gram_positive_bac_list(ItemName)
VALUES
    ("Coagulase negative Staphylococci"),
    ("Cocci"),
    ("Staphylococcus aureus"),
    ("Staphylococcus epidermidis"),
    ("Staphylococcus hominis hominis"),
    ("Others");


//
INSERT INTO antibiotics_list(ItemName)
VALUES
    ("Amikacin"),
    ("Amoxyclav"),
    ("Amphotericin B"),
    ("Ampicillin"),
    ("Aztreonam"),
    ("Caspofungin"),
    ("Cefepime"),
    ("cefixime"),
    ("Cefuroxime Axetil"),
    ("Cephepime"),
    ("Cephoperazone"),
    ("Ciprofloxacin"),
    ("Clavulanic acid"),
    ("Clindamycin"),
    ("Colistin"),
    ("Comoxicillin"),
    ("Cotrimoxazole"),
    ("Erythromycin"),
    ("Fluconazole"),
    ("Gentamicin"),
    ("Imipenem"),
    ("Levofloxacin"),
    ("Linezolid"),
    ("Meropenem"),
    ("Micafungin"),
    ("Netilmicin"),
    ("Ofloxacin"),
    ("Oxacillin"),
    ("Pencillin"),
    ("Piperacillin"),
    ("PolymyzinB"),
    ("Sulbactam"),
    ("Sulfamethoxazole"),
    ("Tazobactam"),
    ("Tetracycline"),
    ("Tigecycline"),
    ("Tobramycin"),
    ("Trimethoprim"),
    ("Vancomycin"),
    ("Voriconalzole"),
    ("Tericoplanin"),
    ("Cloxacillin"),
    ("Methicillin"),
    ("Cefotaxime"),
    ("Ceftriazone"),
    ("Chloranpenicol"),
    ("Teicoplanin"),
    ("Ceftazibime"),
    ("Chlorampenicol"),
    ("Nalidic acid"),
    ("Nitrofuranton"),
    ("Norfloxacin");


